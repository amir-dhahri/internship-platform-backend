const AsyncHandler = require("express-async-handler");
const { default: Notification } = require("../models/Notification");
const AcademicCoordinator = require("../models/AcademicCoordinator");
const Student = require("../models/Student");
const AcademicSupervisor = require("../models/AcademicSupervisor");
const AcademicYear = require("../models/AcademicYear");
const { hashPassword, isPassMatched } = require("../utils/helpers");
const { uploadImage } = require("../utils/cloudinary");
const generateToken = require("../utils/generateToken");

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
//@access Private University Coordinators 
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
//@access Private University Coordinators 
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
        instagram,
        email
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
exports.toggleAssignAcademicYearToSupervisorCtrl = AsyncHandler(async (req, res) => {
    const { id: supervisorId } = req.params;
    const { academicYearId } = req.body;
    const academicSupervisor = await AcademicSupervisor.findById(supervisorId);
    if (!academicSupervisor) {
        throw new Error("Academic spervisor not found");
    }
    const academicYear = await AcademicYear.findById(academicYearId);
    if (!academicYear) {
        throw new Error("Academic year not found");
    }
    const exists = academicSupervisor.academicYears.some(
        (id) => id.toString() === academicYearId
    );

    if (exists) {
        academicSupervisor.academicYears = academicSupervisor.academicYears.filter(
            (id) => id.toString() !== academicYearId
        );
    } else {
        academicSupervisor.academicYears.push(academicYearId);
    }

    await academicSupervisor.save();

    const name = `${academicSupervisor.firstName} ${academicSupervisor.lastName}`

    const message = exists
        ? `Academic supervisor "${name}" was unassigned from academic year "${academicYear.name}".`
        : `Academic supervisor "${name}" was assigned a new academic year "${academicYear.name}".`;

    const { id: userId } = req.userAuth;

    const academicCoordinator = await AcademicCoordinator.findById(userId);

    const receivers = [userId]

    const notif = await Notification.create({
        sender: userId,
        receivers,
        type: "SYSTEM",
        entity: name,
        entityType: "Academic Supervisors",
        message: message,
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

//@desc Login academic supervisor
//@route POST /api/v1/academic-supervisors/login
//@access Private Academic Supervisors Only
exports.loginAcademicSupervisorCtrl = AsyncHandler(async (req, res) => {

    const { email, password } = req.body;

    const academicSupervisor = await AcademicSupervisor.findOne({ email });

    // Check if email exists

    if (!academicSupervisor) {
        throw new Error("Invalid login credentials");
    }


    const isMatched = await isPassMatched(password, academicSupervisor.password);


    if (!isMatched) {
        throw new Error("Invalid login credentials");
    }

    const token = generateToken(academicSupervisor._id, "academic-supervisor");

    res.cookie('token', token, {
        httpOnly: true,
        secure: false,        // true in production (HTTPS)
        sameSite: 'lax',  // or 'lax' depending on your setup
        path: '/',
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    });
    res.status(200)
        .json({
            status: "success",
            message: "Academic supervisor logged in successfully",
            // data: token
        })
})

//@desc Get academic supervisor profile
//@route GET /api/v1/academic-supervisors/profile
//@access Private University Supervisor 
exports.fetchAcademicSupervisorProfileCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.userAuth;

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
//@route PUT /api/v1/academic-supervisors/profile
//@access Private University Supervisors 
exports.modifyAcademicSupervisorProfileCtrl = AsyncHandler(async (req, res) => {

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
        instagram,
        email
    } = req.body;
    const { id } = req.userAuth;

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

    const academicCoordinator = await AcademicCoordinator.findById(id);

    const receivers = [id]

    const name = `${academicCoordinator.firstName} ${academicCoordinator.lastName}`

    const notif = await Notification.create({
        sender: id,
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


//@desc Get all notifications 
//@route GET /api/v1/academic-supervisors/notifications
//@access  Private Academic Supervisor Only
exports.getNotificationsCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.userAuth;
    const notifications = await Notification.find({
        receivers: { $in: id }
    }).sort({ createdAt: -1 });
    res.status(200).send({
        status: "success",
        message: "Notifications fetched successfully",
        data: notifications
    })
})

//@desc Logout Academic Supervisor
//@route GET /api/v1/academic-supervisors/logout
//@access  Private Academic Supervisor Only
exports.logoutCtrl = AsyncHandler(async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
    });

    res.status(200).json({
        status: "success",
        message: "Logged out successfully"
    });
});


//@desc Get Academic Supervisor Departments
//@route GET /api/v1/academic-supervisors/departments
//@access Private Academic Supervisor Only
exports.getDepartments = AsyncHandler(async (req, res) => {
    const { id } = req.userAuth;
    const academicSupervisor = await AcademicSupervisor.findById(id).populate({
        path: "academicYears",
        populate: {
            path: "academicLevelId",
            populate: {
                path: "departmentId"
            }
        }
    });
    
    const years = academicSupervisor.academicYears;
    
    const departments = {};

    years.forEach(year => {
        const level = year.academicLevelId;
        const department = level.departmentId;
        const depId = department._id.toString();
        const levelId = level._id.toString();
        if (!departments[depId]) {
            departments[depId] = {
                ...department,
                academicLevels: {}
            }
        }
        if (!departments[depId].academicLevels[levelId]) {
            departments[depId].academicLevels[levelId] = {
                ...level,
                academicYears: []
            }; 
        }
        departments[depId].academicLevels[levelId].academicYears.push(year);
    });
    
    res.status(200).json({
        status: "success",
        message: "Departments fetched successfully",
        data: departments
    })
})

//@desc Get Academic Supervisor students
//@route GET /api/v1/academic-supervisors/academic-years/:id
//@access Private Academic Supervisor Only
exports.getStudents = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const students = await Student.find({
        academicYearId: id
    });
    res.status(200).json({
        status: "success",
        message: "Students fetched successfully",
        data: students
    })
})
