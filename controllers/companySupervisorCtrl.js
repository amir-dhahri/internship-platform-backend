const AsyncHandler = require("express-async-handler");
const { default: Notification } = require("../models/Notification");
const AcademicSupervisor = require("../models/AcademicSupervisor");
const { hashPassword, isPassMatched } = require("../utils/helpers");
const { uploadImage } = require("../utils/cloudinary");
const generateToken = require("../utils/generateToken");
const Message = require("../models/Message");
const Internship = require("../models/Internship");
const CompanySupervisor = require("../models/CompanySupervisor");
const CompanyCoordinator = require("../models/CompanyCoordinator");
const Department = require("../models/Department");

//@desc Register company supervisor
//@route POST /api/v1/company-supervisors/
//@access Private Company Coordinator Only
exports.registerCompanySupervisorCtrl = AsyncHandler(async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password
    } = req.body;

    const companySupervisorFound = await CompanySupervisor.findOne({ email });

    if (companySupervisorFound) {
        throw new Error("Company supervisor already exists");
    }

    const companySupervisor = await CompanySupervisor.create(
        {
            firstName,
            lastName,
            email,
            password: await hashPassword(password),
        }
    )

    const { id } = req.userAuth;

    const companyCoordinator = await CompanyCoordinator.findById(id);

    const receivers = [id]

    const notif = await Notification.create({
        sender: id,
        receivers,
        type: "SYSTEM",
        entity: `${firstName} ${lastName}`,
        entityType: "Company Supervisors",
        message: `New company supervisor "${firstName} ${lastName}" was registered`,
        isRead: false,
        senderPhoto: companyCoordinator.photo
    });
    const io = req.app.get("io");

    receivers.forEach((receiverId) => {
        io.to(receiverId.toString()).emit("receiveNotification", notif)
    })

    res.status(201).json({
        status: "success",
        message: "Company supervisor registered successfully",
        data: companySupervisor,
    })
})

//@desc Get all company supervisors
//@route GET /api/v1/company-supervisors/
//@access Private Company Coordinator Only
exports.getCompanySupervisorsCtrl = AsyncHandler(async (req, res) => {
    const companySupervisors = await CompanySupervisor.find().select("-password");
    res.status(200).json(
        {
            status: "success",
            message: "Company supervisors fetched successfully",
            data: companySupervisors,
        }
    );
})

//@desc Get company supervisor
//@route GET /api/v1/company-supervisors/:id
//@access Private Company Coordinator Only
exports.getCompanySupervisorCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const companySupervisor = await CompanySupervisor.findById(id);
    if (!companySupervisor) {
        throw new Error("Company superivor Not Found!");
    }
    res.status(200).json({
        status: "success",
        message: "Company superivor fetched successfully",
        data: companySupervisor,
    });
})

//@desc Get company supervisor profile
//@route GET /api/v1/company-supervisors/:id/profile
//@access Private Company Coordinators 
exports.getCompanySupervisorProfileCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const companySupervisor = await CompanySupervisor.findById(id).select("-password");
    if (!companySupervisor) {
        throw new Error("Company superivor Not Found!");
    }
    res.status(200).json({
        status: "success",
        message: "Company superivor fetched successfully",
        data: companySupervisor,
    });
})

//@desc Update company supervisor profile
//@route PUT /api/v1/company-supervisors/:id/profile
//@access Private Company Coordinators 
exports.updateCompanySupervisorProfileCtrl = AsyncHandler(async (req, res) => {
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

    const companySupervisorFound = await companySupervisor.findOne({ email, _id: { $ne: id } });
    if (companySupervisorFound) {
        throw new Error("company supervisor credentials already exist")
    }

    const file = req.file;
    let photo = undefined;
    if (file) {
        photo = await uploadImage(file);
    }

    const companySupervisor = await companySupervisor.findByIdAndUpdate(id, {
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

    const companyCoordinator = await CompanyCoordinator.findById(userId);

    const receivers = [userId]

    const name = `${companyCoordinator.firstName} ${companyCoordinator.lastName}`

    const notif = await Notification.create({
        sender: userId,
        receivers,
        type: "SYSTEM",
        entity: `${name}`,
        entityType: "Company Supervisors",
        message: `Company supervisor "${name}" profile was updated`,
        isRead: false,
        senderPhoto: companyCoordinator.photo
    });

    const io = req.app.get("io");

    receivers.forEach((receiverId) => {
        io.to(receiverId.toString()).emit("receiveNotification", notif)
    })

    res.status(200).json({
        status: "success",
        message: "Company supervisor profile updated successfully",
        data: companySupervisor,
    })
})

//@desc Delete company superivsor
//@route DELETE /api/v1/company-supervisors/:id
//@access Private Company Coordinator Only
exports.deleteCompanySupervisorCtrl = AsyncHandler(async (req, res) => {

    const { id } = req.params;

    const { firstName, lastName } = await CompanySupervisor.findByIdAndDelete(id);

    const name = `${firstName} ${lastName}`

    const { id: userId } = req.userAuth;

    const companyCoordinator = await CompanyCoordinator.findById(userId);

    const receivers = [userId]

    const notif = await Notification.create({
        sender: userId,
        receivers,
        type: "SYSTEM",
        entity: name,
        entityType: "Company Levels",
        message: `New company supervisor "${name}" was deleted`,
        isRead: false,
        senderPhoto: companyCoordinator.photo
    });

    const io = req.app.get("io");

    receivers.forEach((receiverId) => {
        io.to(receiverId.toString()).emit("receiveNotification", notif)
    })

    res.status(200).json({
        status: "success",
        message: "Company supervisor deleted successfully",
        data: {},
    });
})

//@desc Assign company year
//@route POST /api/v1/company-supervisors/:id/company-years
//@access Private Company Coordinator Only
exports.toggleAssignDepartmentsToSupervisorCtrl = AsyncHandler(async (req, res) => {
    const { id: supervisorId } = req.params;
    const { departmentId } = req.body;
    const companySupervisor = await CompanySupervisor.findById(supervisorId);
    if (!companySupervisor) {
        throw new Error("Company spervisor not found");
    }
    const departement = await Department.findById(departmentId);
    if (!departement) {
        throw new Error("Department not found");
    }
    const exists = companySupervisor.departments.some(
        (id) => id.toString() === departmentId
    );

    if (exists) {
        companySupervisor.departments = companySupervisor.departments.filter(
            (id) => id.toString() !== departmentId
        );
    } else {
        companySupervisor.departments.push(departmentId);
    }

    await companySupervisor.save();

    const name = `${companySupervisor.firstName} ${companySupervisor.lastName}`

    const message = exists
        ? `Company supervisor "${name}" was unassigned from company year "${companyYear.name}".`
        : `Company supervisor "${name}" was assigned a new company year "${companyYear.name}".`;

    const { id: userId } = req.userAuth;

    const companyCoordinator = await CompanyCoordinator.findById(userId);

    const receivers = [userId]

    const notif = await Notification.create({
        sender: userId,
        receivers,
        type: "SYSTEM",
        entity: name,
        entityType: "Company Supervisors",
        message: message,
        isRead: false,
        senderPhoto: companyCoordinator.photo
    });

    const io = req.app.get("io");

    receivers.forEach((receiverId) => {
        io.to(receiverId.toString()).emit("receiveNotification", notif)
    })

    res.status(200).json({
        status: "success",
        message: "Company year assigned successfully",
        data: companySupervisor
    });
})

//@desc Login company supervisor
//@route POST /api/v1/company-supervisors/login
//@access Private Company Supervisors Only
exports.loginCompanySupervisorCtrl = AsyncHandler(async (req, res) => {

    const { email, password } = req.body;

    const companySupervisor = await CompanySupervisor.findOne({ email });

    // Check if email exists

    if (!companySupervisor) {
        throw new Error("Invalid login credentials");
    }


    const isMatched = await isPassMatched(password, companySupervisor.password);


    if (!isMatched) {
        throw new Error("Invalid login credentials");
    }

    const token = generateToken(companySupervisor._id, "company-supervisor");

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
            message: "Company supervisor logged in successfully",
            // data: token
        })
})

//@desc Get company supervisor profile
//@route GET /api/v1/company-supervisors/profile
//@access Private Company Supervisor 
exports.fetchCompanySupervisorProfileCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.userAuth;

    const companySupervisor = await CompanySupervisor.findById(id).select("-password");
    if (!companySupervisor) {
        throw new Error("Company superivor Not Found!");
    }

    res.status(200).json({
        status: "success",
        message: "Company superivor fetched successfully",
        data: companySupervisor,
    });
})

//@desc Update company supervisor profile
//@route PUT /api/v1/company-supervisors/profile
//@access Private Company Supervisors 
exports.modifyCompanySupervisorProfileCtrl = AsyncHandler(async (req, res) => {
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

    const companySupervisorFound = await CompanySupervisor.findOne({ email, _id: { $ne: id } });
    if (companySupervisorFound) {
        throw new Error("company supervisor credentials already exist")
    }

    const file = req.file;
    let photo = undefined;
    if (file) {
        photo = await uploadImage(file);
    }

    const companySupervisor = await CompanySupervisor.findByIdAndUpdate(id, {
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

    const companyCoordinator = await CompanyCoordinator.findById(id);

    const receivers = [id]

    const name = `${companyCoordinator.firstName} ${companyCoordinator.lastName}`

    const notif = await Notification.create({
        sender: id,
        receivers,
        type: "SYSTEM",
        entity: `${name}`,
        entityType: "company Supervisors",
        message: `Company supervisor "${name}" profile was updated`,
        isRead: false,
        senderPhoto: companyCoordinator.photo
    });

    const io = req.app.get("io");

    receivers.forEach((receiverId) => {
        io.to(receiverId.toString()).emit("receiveNotification", notif)
    })

    res.status(200).json({
        status: "success",
        message: "Company supervisor profile updated successfully",
        data: companySupervisor,
    })
})

//@desc Get all notifications 
//@route GET /api/v1/company-supervisors/notifications
//@access  Private Company Supervisor Only
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

//@desc Logout company Supervisor
//@route GET /api/v1/company-supervisors/logout
//@access  Private Company Supervisor Only
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
        path: "departments",
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

//@desc company Supervisor send message
//@route POST /api/v1/company-supervisors/chat/send
//@access Private Company Supervisor Only
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

//@desc Company Supervisor Get Messages
//@route POST /api/v1/company-supervisors/chat/messages
//@access Private Company Supervisor Only
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
//@route POST /api/v1/company-supervisors/internships
//@access Private Company Supervisors Only
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
    const internshipFound = await Internship.findOne({ title, companySupervisor: id });
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
            companySupervisor: id
        }
    )


    const companySupervisor = await CompanySupervisor.findById(id);

    const receivers = [id]

    const notif = await Notification.create({
        sender: id,
        receivers,
        type: "SYSTEM",
        entity: title,
        entityType: "Internships",
        message: `New internship "${title}" was created`,
        isRead: false,
        senderPhoto: companySupervisor.photo
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
//@route GET /api/vi/company-supervisors/internships
//@access Company Supervisors Only
exports.getInternshipsCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.userAuth;
    const internships = await Internship.find({ companySupervisor: id });
    res.status(200).send({
        status: "success",
        message: "Internships fetched successfully",
        data: internships,
    })
})

//@desc Get single internship
//@route Get /api/v1/company-supervisors/internships/get/single/:id
//@access Private Company Supevisors Only
exports.getInternshipCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const internship = await Internship.findById(id);
    res.status(200).send({
        status: "success",
        message: "Internship fetched successfully",
        data: internship,
    })
})

//@desc Delete single internship
//@route DELETE /api/v1/company-supervisors/internships/delete/:id
//@access Private Company Supevisors Only
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
//@route Get /api/v1/company-supervisors/internships/delete/:id
//@access Private Company Supevisors Only
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
        companySupervisor: id,
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

    const companySupervisor = await CompanySupervisor.findById(id);

    const receivers = [id];

    const notif = await Notification.create({
        sender: id,
        receivers,
        type: "SYSTEM",
        entity: title,
        entityType: "Internships",
        message: `Internship "${title}" was updated`,
        isRead: false,
        senderPhoto: companySupervisor.photo,
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
