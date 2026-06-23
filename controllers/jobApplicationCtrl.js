const Student = require("../models/Student");
const AsyncHandler = require("express-async-handler");
const { default: Notification } = require("../models/Notification");
const { uploadPdf } = require("../utils/cloudinary");
const JobApplication = require("../models/jobApplication");
const Job = require("../models/Job");

//@desc Apply to an job
//@route POST /api/v1/job-applications/:id
//@access Private Students Only
exports.applyToJob = AsyncHandler(async (req, res) => {
    const studentId = req.userAuth.id;
    const jobId = req.params.id;
    const existing = await JobApplication.findOne({
        student: studentId,
        job: jobId,
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
    const job = await Job.findById(jobId);
    
    const application = await JobApplication.create({
        student: studentId,
        job: jobId,
        cv,
        companySupervisor: job.companySupervisor
    });

    const receivers = [studentId]

    const notif = await Notification.create({
        sender: studentId,
        receivers,
        type: "SYSTEM",
        entity: job.title,
        entityType: "Offres d'emploi",
        message: `Vous avez postulé à l'offre d'emploi "${job.title}"`,
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