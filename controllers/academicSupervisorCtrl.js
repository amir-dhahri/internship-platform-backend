const AsyncHandler = require("express-async-handler");
const { default: Notification } = require("../models/Notification");
const AcademicCoordinator = require("../models/AcademicCoordinator");
const Student = require("../models/Student");
const AcademicSupervisor = require("../models/AcademicSupervisor");
const AcademicYear = require("../models/AcademicYear");
const { hashPassword, isPassMatched } = require("../utils/helpers");
const { uploadImage } = require("../utils/cloudinary");
const generateToken = require("../utils/generateToken");
const Message = require("../models/Message");
const Internship = require("../models/Internship");

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

//@desc Academic Supervisor send message
//@route POST /api/v1/academic-supervisors/chat/send
//@access Private Academic Supervisor Only
exports.sendMessage = AsyncHandler(async (req, res) => {
    const { text, receiverId } = req.body;
    const { id: senderId } = req.userAuth;
    const files = req.files;
    const attachments = [];

    if (files) {
        for (let file in files) {
            const photo = await uploadImage(file);
            attachments.push(photo);
        }
    }

    const message = await Message.create({
        receiverId,
        senderId,
        text,
        attachments
    });

    const io = req.app.get("io");

    io.to(receiverId.toString()).emit("receive_message", message);

    res.status(200).json({
        status: "success",
        message: "Message sent successfully",
        data: message
    })
})

//@desc Academic Supervisor Get Messages
//@route POST /api/v1/academic-supervisors/chat/messages
//@access Private Academic Supervisor Only
exports.getMessages = AsyncHandler(async (req, res) => {
    const { receiverId } = req.body;
    const { id: senderId } = req.userAuth;
    const messages = await Message.find({ senderId, receiverId });
    res.status(200).json({
        status: "success",
        message: "Messages fetched successfully",
        data: messages
    })
})

//@desc Add internship
//@route POST /api/v1/internships
//@access Private University & Company Supervisors Only
exports.createInternshipsCtrl = AsyncHandler(async (req, res) => {
    const {
        title,
        description,
        startDate,
        endDate,
        location,
        workMode,
        topic,
        requirementsStr,
        status,
        type
    } = req.body;

    const { id } = req.userAuth;
    const internshipFound = await Internship.findOne({ title, academicSupervisor: id });
    if (internshipFound) {
        throw new Error("Internship already exists");
    }

    const file = req.file;

    if (!file) {
        throw new Error("Kindly attach an image.");
    }

    const imgURL = await uploadImage(file);

    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationInMonths =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());

    const internship = await Internship.create(
        {
            title,
            description,
            duration: durationInMonths.toString(),
            startDate,
            endDate,
            location,
            workMode,
            topic,
            requirements: requirementsStr ? JSON.parse(requirementsStr) : [],
            status,
            type,
            image: imgURL,
            academicSupervisor: id
        }
    )


    const academicSupervisor = await AcademicSupervisor.findById(id);

    const receivers = [id]

    const notif = await Notification.create({
        sender: id,
        receivers,
        type: "SYSTEM",
        entity: title,
        entityType: "Internships",
        message: `New internship "${title}" was created`,
        isRead: false,
        senderPhoto: academicSupervisor.photo
    });
    const io = req.app.get("io");

    receivers.forEach((receiverId) => {
        io.to(receiverId.toString()).emit("receiveNotification", notif)
    })

    res.status(201).json({
        status: "success",
        message: "Internship added successfully",
        data: internship,
    })
})

//@desc Get Internships
//@route GET /api/vi/internships
//@access Private University & Company Supervisors Only
exports.getInternshipsCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.userAuth;
    const internships = await Internship.find({ academicSupervisor: id });
    res.status(200).send({
        status: "success",
        message: "Internships fetched successfully",
        data: internships,
    })
})

//@desc Get single internship
//@route Get /api/v1/internships/get/single/:id
//@access Private Universitry & Company Supevisors Only
exports.getInternshipCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const internship = await Internship.findById(id);
    res.status(200).send({
        status: "success",
        message: "Internship fetched successfully",
        data: internship,
    })
})

//@desc Get single internship
//@route Get /api/v1/internships/delete/:id
//@access Private Universitry & Company Supevisors Only
exports.deleteInternshipCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const internship = await Internship.findOneAndDelete(id);
    res.status(200).send({
        status: "success",
        message: "Internship deleted successfully",
        data: internship,
    })
})

//@desc Get single internship
//@route Get /api/v1/internships/delete/:id
//@access Private Universitry & Company Supevisors Only
exports.updateInternshipCtrl = AsyncHandler(async (req, res) => {
    const {
        title,
        description,
        startDate,
        endDate,
        location,
        workMode,
        topic,
        requirementsStr,
        status,
        type,
    } = req.body;

    const { id } = req.userAuth;

    const internshipFound = await Internship.findOne({
        _id: req.params.id,
        academicSupervisor: id,
    });

    if (!internshipFound) {
        throw new Error("Internship not found!");
    }

    let imgURL = internshipFound.image;

    const file = req.file;
    if (file) {
        imgURL = await uploadImage(file);
    }

    let durationInMonths = internshipFound.duration;

    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        durationInMonths =
            (end.getFullYear() - start.getFullYear()) * 12 +
            (end.getMonth() - start.getMonth());
    }

    const updatedInternship = await Internship.findByIdAndUpdate(
        req.params.id,
        {
            title,
            description,
            startDate,
            endDate,
            location,
            workMode,
            topic,
            requirements: requirementsStr
                ? JSON.parse(requirementsStr)
                : internshipFound.requirements,
            status,
            type,
            image: imgURL,
            duration: durationInMonths,
        },
        { new: true }
    );

    const academicSupervisor = await AcademicSupervisor.findById(id);

    const receivers = [id];

    const notif = await Notification.create({
        sender: id,
        receivers,
        type: "SYSTEM",
        entity: title,
        entityType: "Internships",
        message: `Internship "${title}" was updated`,
        isRead: false,
        senderPhoto: academicSupervisor.photo,
    });

    const io = req.app.get("io");

    receivers.forEach((receiverId) => {
        io.to(receiverId.toString()).emit("receiveNotification", notif);
    });

    res.status(200).json({
        status: "success",
        message: "Internship updated successfully",
        data: updatedInternship,
    });
});