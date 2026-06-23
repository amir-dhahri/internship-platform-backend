const InternshipApplication = require("../models/InternshipApplication");
const Student = require("../models/Student");
const AsyncHandler = require("express-async-handler");
const { default: Notification } = require("../models/Notification");
const Internship = require("../models/Internship");
//@desc Apply to an internship
//@route POST /api/v1/internship-applications/:id
//@access Private Students Only
exports.applyToInternship = AsyncHandler(async (req, res) => {
    const studentId = req.userAuth.id;
    const internshipId = req.params.id;
    const existing = await InternshipApplication.findOne({
        student: studentId,
        internship: internshipId,
    });

    if (existing) {
        return res.status(400).json({
            status: "fail",
            message: "Already applied",
        });
    }
    let cv = null;

    if (req.file) {
        cv = await uploadPdf(req.file);
    }
    const student = await Student.findById(studentId);
    const internship = await Internship.findById(internshipId);

    const application = await InternshipApplication.create({
        student: studentId,
        internship: internshipId,
        cv,
        academicSupervisor: student.academicSupervisorId,
        companySupervisor: internship.companySupervisor ? internship.companySupervisor : null
    });

    const receivers = [studentId]

    const notif = await Notification.create({
        sender: studentId,
        receivers,
        type: "SYSTEM",
        entity: internship.title,
        entityType: "Stages",
        message: `Vous avez postulé au stage "${internship.title}"`,
        isRead: false,
        senderPhoto: student.photo
    });
    const io = req.app.get("io");

    receivers.forEach((receiverId) => {
        io.to(receiverId.toString()).emit("receiveNotification", notif)
    })
    res.status(201).json({
        status: "success",
        message: "Application created",
        data: application,
    });
});