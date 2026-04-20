const AsyncHandler = require("express-async-handler");
const AcademicLevel = require("../models/AcademicLevel");
const { default: Notification } = require("../models/Notification");
const AcademicCoordinator = require("../models/AcademicCoordinator");
const AcademicSupervisor = require("../models/AcademicSupervisor");

//@desc Register academic supervisor
//@route POST /api/v1/academic-supervisors/
//@access Private Academic Coordinator Only
exports.createAcademicSupervisorCtrl = AsyncHandler(async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        bio,
        address,
        city,
        country,
        postalcode,
        facebook,
        x,
        linkedin,
        instagram,
        password
    } = req.body;
    const academicSupervisorFound = await AcademicSupervisor.findOne({ email });
    if (academicSupervisorFound) {
        throw new Error("Academic supervisor already exists");
    }
    const file = req.file;
    const photo = await uploadImage(file)
    const academicSupervisor = await AcademicSupervisor.create(
        {
            firstName,
            lastName,
            email,
            phone,
            bio,
            address,
            city,
            country,
            postalcode,
            facebook,
            x,
            linkedin,
            instagram,
            photo,
            password: await hashPassword(password),
        }
    )

    const {id} = req.userAuth;

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
//@route GET /api/v1/academic-supervisors
//@access Private University Coordinator Only
exports.getAcademicSupervisorsCtrl = AsyncHandler(async (req, res) => {
    const academicSupervisors = await AcademicSupervisor.find();
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
//@route GET /api/v1/academic-levels/:id/academic-years/
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