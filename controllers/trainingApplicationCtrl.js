const Student = require("../models/Student");
const AsyncHandler = require("express-async-handler");
const { default: Notification } = require("../models/Notification");
const { uploadPdf } = require("../utils/cloudinary");
const TrainingApplication = require("../models/trainingApplication");
const Training = require("../models/Training");

//@desc Apply to an training
//@route POST /api/v1/training-applications/:id
//@access Private Students Only
exports.applyToTraining = AsyncHandler(async (req, res) => {
    const studentId = req.userAuth.id;
    const trainingId = req.params.id;
    const existing = await TrainingApplication.findOne({
        student: studentId,
        training: trainingId,
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
    const training = await Training.findById(trainingId);
    
    const application = await TrainingApplication.create({
        student: studentId,
        training: trainingId,
        cv,
        companySupervisor: training.companySupervisor
    });

    const receivers = [studentId]

    const notif = await Notification.create({
        sender: studentId,
        receivers,
        type: "SYSTEM",
        entity: training.title,
        entityType: "Fromations",
        message: `Vous avez postulé à la formation"${training.title}"`,
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