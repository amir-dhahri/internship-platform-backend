const AsyncHandler = require("express-async-handler");
const AcademicLevel = require("../models/AcademicLevel");
const { default: Notification } = require("../models/Notification");
const AcademicCoordinator = require("../models/AcademicCoordinator");
const AcademicSupervisor = require("../models/AcademicSupervisor");
const AcademicYear = require("../models/AcademicYear");
const { hashPassword } = require("../utils/helpers");

//@desc Register academic supervisor
//@route POST /api/v1/academic-supervisors/
//@access Private Academic Coordinator Only
exports.registerAcademicSupervisorCtrl = AsyncHandler(async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password
    } = req.body;
    
    const academicSupervisorFound = await AcademicSupervisor.findOne({ email });

    if (academicSupervisorFound) {
        throw new Error("Academic supervisor already exists");
    }
    
    const academicSupervisor = await AcademicSupervisor.create(
        {
            firstName,
            lastName,
            email,
            password: await hashPassword(password),
        }
    )

    const { id } = req.userAuth;

    const academicCoordinator = await AcademicCoordinator.findById(id);

    const receivers = [id]

    const notif = await Notification.create({
        sender: id,
        receivers,
        type: "SYSTEM",
        entity: `${firstName} ${lastName}`,
        entityType: "Academic Supervisors",
        message: `New academic supervisor "${firstName} ${lastName}" was registered`,
        isRead: false,
        senderPhoto: academicCoordinator.photo
    });
    const io = req.app.get("io");

    receivers.forEach((receiverId) => {
        io.to(receiverId.toString()).emit("receiveNotification", notif)
    })

    res.status(201).json({
        status: "success",
        message: "Academic supervisor registered successfully",
        data: academicSupervisor,
    })
})

//@desc Get all academic supervisors
//@route GET /api/v1/academic-supervisors/
//@access Private University Coordinator Only
exports.getAcademicSupervisorsCtrl = AsyncHandler(async (req, res) => {
    const academicSupervisors = await AcademicSupervisor.find().select("-password");
    res.status(200).json(
        {
            status: "success",
            message: "Academic supervisors fetched successfully",
            data: academicSupervisors,
        }
    );
})

//@desc Get academic supervisor
//@route GET /api/v1/academic-supervisors/:id
//@access Private University Coordinator Only
exports.getAcademicSupervisorCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const academicSupervisor = await AcademicSupervisor.findById(id);
    if (!academicSupervisor) {
        throw new Error("Academic superivor Not Found!");
    }
    res.status(200).json({
        status: "success",
        message: "Academic superivor fetched successfully",
        data: academicSupervisor,
    });
})

//@desc Get academic supervisor profile
//@route GET /api/v1/academic-supervisors/:id/profile
//@access Private University Coordinator Only
exports.getAcademicSupervisorProfileCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const academicSupervisor = await AcademicSupervisor.findById(id).select("-password");
    if (!academicSupervisor) {
        throw new Error("Academic superivor Not Found!");
    }
    res.status(200).json({
        status: "success",
        message: "Academic superivor fetched successfully",
        data: academicSupervisor,
    });
})

//@desc Update academic supervisor profile
//@route PUT /api/v1/academic-supervisors/:id/profile
//@access Private University Coordinator Only
exports.updateAcademicSupervisorProfileCtrl = AsyncHandler(async (req, res) => {
    const {
        firstName,
        lastName,
        phone,
        bio,
        address,
        city,
        country,
        postalCode,
        facebook,
        x,
        linkedin,
        instagram
    } = req.body;
    const { id } = req.params;

    const academicSupervisorFound = await AcademicSupervisor.findOne({ email, _id: { $ne: id } });
    if (academicSupervisorFound) {
        throw new Error("Academic supervisor credentials already exist")
    }

    const file = req.file;
    let photo = undefined;
    if (file) {
        photo = await uploadImage(file);
    }

    const academicSupervisor = await AcademicSupervisor.findByIdAndUpdate(id, {
        firstName,
        lastName,
        phone,
        bio,
        address,
        city,
        country,
        postalCode,
        facebook,
        x,
        linkedin,
        instagram,
        photo
    }, {
        new: true
    });

    const { id: userId } = req.userAuth;

    const academicCoordinator = await AcademicCoordinator.findById(userId);

    const receivers = [userId]

    const name = `${academicCoordinator.firstName} ${academicCoordinator.lastName}`

    const notif = await Notification.create({
        sender: userId,
        receivers,
        type: "SYSTEM",
        entity: `${name}`,
        entityType: "Academic Supervisors",
        message: `Academic supervisor "${name}" profile was updated`,
        isRead: false,
        senderPhoto: academicCoordinator.photo
    });

    const io = req.app.get("io");

    receivers.forEach((receiverId) => {
        io.to(receiverId.toString()).emit("receiveNotification", notif)
    })

    res.status(200).json({
        status: "success",
        message: "Academic supervisor profile updated successfully",
        data: academicSupervisor,
    })
})

//@desc Delete academic superivsor
//@route DELETE /api/v1/academic-supervisors/:id
//@access Private University Coordinator Only
exports.deleteAcademicSupervisorCtrl = AsyncHandler(async (req, res) => {
    
    const { id } = req.params;
    
    const { firstName, lastName } = await AcademicSupervisor.findByIdAndDelete(id);

    const name = `${firstName} ${lastName}`

    const { id: userId } = req.userAuth;

    const academicCoordinator = await AcademicCoordinator.findById(userId);

    const receivers = [userId]

    const notif = await Notification.create({
        sender: userId,
        receivers,
        type: "SYSTEM",
        entity: name,
        entityType: "Academic Levels",
        message: `New academic supervisor "${name}" was deleted`,
        isRead: false,
        senderPhoto: academicCoordinator.photo
    });

    const io = req.app.get("io");

    receivers.forEach((receiverId) => {
        io.to(receiverId.toString()).emit("receiveNotification", notif)
    })

    res.status(200).json({
        status: "success",
        message: "Academic supervisor deleted successfully",
        data: {},
    });
})

//@desc Assign academic year
//@route POST /api/v1/academic-supervisors/:id/academic-years
//@access Private University Coordinator Only
exports.assignAcademicYearToSupervisorCtrl = AsyncHandler(async (req, res) => {
    const { id: supervisorId } = req.params;
    const { academicYearId } = req.body;
    const academicSupervisor = await AcademicSupervisor.findById(supervisorId);
    if (!academicSupervisor) {
        throw new Error("Academic supervisor not found");
    }
    if (academicSupervisor.academicYears.includes(academicYearId)) {
        throw new Error("Academic year already assigned");
    }
    academicSupervisor.academicYears.push(academicYearId);
    await academicSupervisor.save();

    const academicYear = await AcademicYear.findById(academicYearId);

    const name = `${academicSupervisor.firstName} ${academicSupervisor.lastName}`

    const { id: userId } = req.userAuth;

    const academicCoordinator = await AcademicCoordinator.findById(userId);

    const receivers = [userId]

    const notif = await Notification.create({
        sender: userId,
        receivers,
        type: "SYSTEM",
        entity: name,
        entityType: "Academic Supervisors",
        message: `Academic supervisor "${name}" was assigned a new academic year "${academicYear.name}."`,
        isRead: false,
        senderPhoto: academicCoordinator.photo
    });

    const io = req.app.get("io");

    receivers.forEach((receiverId) => {
        io.to(receiverId.toString()).emit("receiveNotification", notif)
    })

    res.status(200).json({
        status: "success",
        message: "Academic year assigned successfully",
        data: academicSupervisor
    });
})