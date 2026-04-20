const AsyncHandler = require("express-async-handler");
const AcademicLevel = require("../models/AcademicLevel");
const { default: Notification } = require("../models/Notification");
const AcademicCoordinator = require("../models/AcademicCoordinator");
const AcademicYear = require("../models/AcademicYear");

//@desc Add academic level
//@route POST /api/v1/academic-levels
//@access Private University Coordinator Only
exports.createAcademicLevelCtrl = AsyncHandler(async (req, res) => {
    const {
        name,
        departmentId
    } = req.body;

    
    const academicLevelFound = await AcademicLevel.findOne({ name, departmentId });
    if (academicLevelFound) {
        throw new Error("Academic level already exists");
    }
    
    const academicLevel = await AcademicLevel.create(
        {
            name,
            departmentId
        }
    )
    const {id} = req.userAuth;

    const academicCoordinator = await AcademicCoordinator.findById(id);
    
    const receivers = [id]
    
    const notif = await Notification.create({
        sender: id,
        receivers,
        type: "SYSTEM",
        entity: name,
        entityType: "Academic Levels",
        message: `New academic level "${name}" was created`,
        isRead: false,
        senderPhoto: academicCoordinator.photo
    });

    const io = req.app.get("io");

    receivers.forEach((receiverId) => {
        io.to(receiverId.toString()).emit("receiveNotification", notif)
    })

    res.status(201).json({
        status: "success",
        message: "Academic level added successfully",
        data: academicLevel,
    })
})

//@desc Get all academic levels
//@route GET /api/v1/academic-levels
//@access Private University Coordinator Only
exports.getAcademicLevelsCtrl = AsyncHandler(async (req, res) => {
    const academicLevels = await AcademicLevel.find();
    res.status(200).json(
        {
            status: "success",
            message: "Academic levels fetched successfully",
            data: academicLevels,
        }
    );
})

//@desc Get academic level
//@route GET /api/v1/academic-levels/:id
//@access Private University Coordinator Only
exports.getAcademicLevelCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const academicLevel = await AcademicLevel.findById(id);
    if (!academicLevel) {
        throw new Error("Academic level Not Found!");
    }
    res.status(200).json({
        status: "success",
        message: "Academic level fetched successfully",
        data: academicLevel,
    });
})

//@desc Update academic level
//@route PUT /api/v1/academic-levels/:id
//@access Private University Coordinator Only
exports.updateAcademicLevelCtrl = AsyncHandler(async (req, res) => {

    const { name, departmentId } = req.body;
    const { id } = req.params;
    // If name exists

    const academicLevelExists = await AcademicLevel.findOne({ name, departmentId, _id: { $ne: id } });
    if (academicLevelExists) {
        throw new Error("Academic level already exists");
    }
    const academicLevel = await AcademicLevel.findByIdAndUpdate(id,
        {
            name,
        }, {
        new: true,
    });
    const {id: userId} = req.userAuth;
    
    const academicCoordinator = await AcademicCoordinator.findById(userId);
    
    const receivers = [userId]
    
    const notif = await Notification.create({
        sender: userId,
        receivers,
        type: "SYSTEM",
        entity: name,
        entityType: "Academic Levels",
        message: `New academic level "${name}" was updated`,
        isRead: false,
        senderPhoto: academicCoordinator.photo
    });

    const io = req.app.get("io");

    receivers.forEach((receiverId) => {
        io.to(receiverId.toString()).emit("receiveNotification", notif)
    })
    res.status(200).json({
        status: "success",
        message: "Academic level updated successfully",
        data: academicLevel
    })
})

//@desc Delete academic level
//@route DELETE /api/v1/academic-levels/:id
//@access Private University Coordinator Only
exports.deleteAcademicLevelCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    const {name} = await AcademicLevel.findByIdAndDelete(id);
    
    const {id: userId} = req.userAuth;
    
    const academicCoordinator = await AcademicCoordinator.findById(userId);
    
    const receivers = [userId]
    
    const notif = await Notification.create({
        sender: userId,
        receivers,
        type: "SYSTEM",
        entity: name,
        entityType: "Academic Levels",
        message: `New academic level "${name}" was deleted`,
        isRead: false,
        senderPhoto: academicCoordinator.photo
    });

    const io = req.app.get("io");

    receivers.forEach((receiverId) => {
        io.to(receiverId.toString()).emit("receiveNotification", notif)
    })
    res.status(200).json({
        status: "success",
        message: "Academic level deleted successfully",
        data: {},
    });
})

//@desc Get Academic level's academic years
//@route GET /api/v1/departments/:id/academic-years/
//@access Private University Coordinator Only
exports.getAcademicLevelAcademicYearsCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const academicYears = await AcademicYear.find({ academicLevelId: id });
    res.status(200).json(
        {
            status: "success",
            message: "Academic years fetched successfully",
            data: academicYears,
        }
    );
})