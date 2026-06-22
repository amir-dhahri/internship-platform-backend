const AsyncHandler = require("express-async-handler");
const { hashPassword, isPassMatched } = require("../utils/helpers");
const Company = require("../models/Company");
const { uploadImage } = require("../utils/cloudinary");
const generateToken = require("../utils/generateToken");
const { default: Notification } = require("../models/Notification");
const CompanyCoordinator = require("../models/CompanyCoordinator");
const Department = require("../models/Department");


//@desc Register company coordinator
//@route POST /api/v1/company-coordinators/register
//@access Private Company Coordinator Only
exports.registerCompanyCoordinatorCtrl = AsyncHandler(async (req, res) => {
    const {
        name,
        email,
        password,
    } = req.body;

    const companyCoordinatorFound = await CompanyCoordinator.findOne({ email });
    if (companyCoordinatorFound) {
        throw new Error("Company coordinator already exists");
    }
    const firstName = name.split(" ")[0];
    const lastName = name.split(" ")[1];
    const companyCoordinator = await CompanyCoordinator.create(
        {
            firstName,
            lastName,
            email,
            password: await hashPassword(password)
        }
    )
    res.status(201).json({
        status: "success",
        message: "Company coordinator registered successfully",
        data: companyCoordinator,
    })
})

//@desc Update company coordinator profile
//@route PUT /api/v1/company-coordinators/profile
//@acces Private Company Coordinator Only
exports.updateCompanyCoordinatorProfileCtrl = AsyncHandler(async (req, res) => {
    const {
        firstName,
        lastName,
        phone,
        email,
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

    const { id } = req.userAuth;

    const companyCoordinatorFound = await CompanyCoordinator.findOne({ email, _id: { $ne: id } });
    if (companyCoordinatorFound) {
        throw new Error("Company coordinator credentials already exist")
    }

    const file = req.file;
    let photo = undefined;
    if (file) {
        photo = await uploadImage(file);
    }

    const companyCoordinator = await CompanyCoordinator.findByIdAndUpdate(id, {
        firstName,
        lastName,
        phone,
        bio,
        address,
        city,
        email,
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

    const name = `${companyCoordinator.firstName} ${companyCoordinator.lastName}`

    const receivers = [id]

    const notif = await Notification.create({
        sender: id,
        receivers,
        type: "SYSTEM",
        entity: name,
        entityType: "Company Coordinators",
        message: `Company coordinator "${name}" profile was updated`,
        isRead: false,
        senderPhoto: companyCoordinator.photo
    });

    const io = req.app.get("io");

    receivers.forEach((receiverId) => {
        io.to(receiverId.toString()).emit("receiveNotification", notif)
    })

    res.status(200).json({
        status: "success",
        message: "Company coordinator profile updated successfully",
        data: companyCoordinator,
    })
})

//@desc Login compnay coordinator
//@route POST /api/v1/compnay-coordinators/login
//@access Private Compnay Coordinator Only
exports.loginCompanyCoordinatorCtrl = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log(email);
    console.log(password);
    
    const companyCoordinator = await CompanyCoordinator.findOne({ email });

    // Check if email exists

    if (!companyCoordinator) {
        throw new Error("Invalid login credentials");
    }

    const isMatched = await isPassMatched(password, companyCoordinator.password);

    if (!isMatched) {
        throw new Error("Invalid login credentials");
    }

    const token = generateToken(companyCoordinator._id, "company-coordinator");
    console.log(token);
    
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
            message: "Company coordinator logged in successfully",
            // data: token
        })
})

//@desc Get company coordinator profile
//@route GET /api/v1/company-coordinators/profile
//@access Private Company Coordinator Only
exports.getCompanyCoordinatorProfileCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.userAuth;
    const companyCoordinator = await CompanyCoordinator.findById(id).select(
        "-password -createdAt -updatedAt"
    );
    if (!companyCoordinator) {
        throw new Error("Company coordinator Not Found!");
    }
    res.status(200).json({
        status: "success",
        message: "Company coordinator profile fetched successfully",
        data: companyCoordinator,
    });
})

//@desc Get company
//@route GET /api/v1/company-coordinators/company
//@access Private Company Coordinator Only
exports.getCompanyCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.userAuth;
    const company = await Company.findOne({ companyCoordinator: id });
    res.status(200).json({
        status: "success",
        message: "Company supervisor registered successfully",
        data: company,
    })
})

//@desc Register company
//@route POST /api/v1/company-coordinators/register/company
//@access Private Company Coordinator Only
exports.registerCompanyCtrl = AsyncHandler(async (req, res) => {
    const {
        name,
        description,
        website,
        email,
        phone,
        address,
        city,
        country,
        postalCode,
    } = req.body;
    const { id } = req.userAuth;
    const companyFound = await Company.findOne({ name, academicCoordinator: id });
    if (companyFound) {
        throw new Error("Company already exists");
    }
    const file = req.file;
    const logo = await uploadImage(file)
    const company = await Company.create(
        {
            name,
            description,
            website,
            email,
            phone,
            address,
            city,
            country,
            postalCode,
            logo,
            companyCoordinator: id
        }
    )

    const companyCoordinator = await CompanyCoordinator.findById(id);

    const receivers = [id]

    const notif = await Notification.create({
        sender: id,
        receivers,
        type: "SYSTEM",
        entity: name,
        entityType: "Company",
        message: `New company "${name}" was registered`,
        isRead: false,
        senderPhoto: companyCoordinator.photo
    });
    const io = req.app.get("io");

    receivers.forEach((receiverId) => {
        io.to(receiverId.toString()).emit("receiveNotification", notif)
    })

    res.status(201).json({
        status: "success",
        message: "Company registered successfully",
        data: company,
    })
})

//@desc Get all notifications 
//@route GET /api/v1/company-coordinators/notifications
//@access  Private Company Coordinator Only
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

//@desc Logout Company Coordinator
//@route GET /api/v1/company-coordinators/logout
//@access  Private Company Coordinator Only
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

//@desc Get all departments
//@route GET /api/v1/company-coordinators/departments
//@access Private Company Coordinator Only
exports.getDepartmentsCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.userAuth;
    const company = await Company.findOne({ companyCoordinator: id });
    const departments = await Department.find({ company: company._id });
    res.status(200).json(
        {
            status: "success",
            message: "Departments fetched successfully",
            data: departments,
        }
    );
})