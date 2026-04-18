const AsyncHandler = require("express-async-handler")
const Admin = require("../models/Admin");
const generateToken = require("../utils/generateToken");
const { hashPassword, isPassMatched } = require("../utils/helpers");

//@desc Register admin
//@route POST /api/v1/admins/register
//@access Private
exports.registerAdminCtrl = AsyncHandler(async (req, res) => {
    const {
        firstName,
        middleName,
        lastName,
        email,
        phone,
        photo,
        country,
        city,
        address,
        password } = req.body;

    // Check if email exists
    const adminFound = await Admin.findOne({ email });
    if (adminFound) {
        throw new Error("Admin already exists");
    }

    // Register
    const admin = await Admin.create(
        {
            firstName,
            middleName,
            lastName,
            email,
            phone,
            photo,
            country,
            city,
            address,
            password: await hashPassword(password)
        }
    )
    res.status(201).json({
        status: "success",
        message: "Admin registered successfully",
        data: admin,
    })
})

//@desc Login admin
//@route POST /api/v1/admins/login
//@access Private
exports.loginAdminCtrl = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    // Check if email exists

    if (!admin) {
        throw new Error("Invalid login credentials");
    }

    const isMatched = isPassMatched(password, admin.password);

    if (!isMatched) {
        throw new Error("Invalid login credentials");
    }

    const token = generateToken(admin._id);

    res.status(200)
        .json({
            status: "success",
            message: "Admin logged in successfully",
            data: token,
        })
})

//@desc Get all admins
//@route GET /api/v1/admins
//@access Private
exports.getAdminsCtrl = AsyncHandler(async (req, res) => {
    const admins = await Admin.find();
    res.status(200).json(
        {
            status: "success",
            message: "Admins fetched successfully",
            data: admins,
        }
    );
})

//@desc Get admin profile
//@route GET /api/v1/admins/profile
//@access Private
exports.getAdminProfileCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.userAuth;
    const admin = await Admin.findById(id).select(
        "-password -createdAt -updatedAt"
    );
    if (!admin) {
        throw new Error("Admin Not Found!");
    }
    res.status(200).json({
        status: "success",
        message: "Admin Profile fetched successfully",
        data: admin,
    });
})

//@desc Update admin
//@route PUT /api/v1/admins/:id
//@access Private
exports.updateAdminCtrl = AsyncHandler(async (req, res) => {
    const { firstName,
        middleName,
        lastName,
        email,
        phone,
        photo,
        country,
        city,
        address,
        password } = req.body;
    // If email exists
    const { id } = req.userAuth;
    const emailExist = await Admin.findOne({ email });
    if (emailExist) {
        throw new Error("This email is taken/exists");
    } else {
        const admin = await Admin.findByIdAndUpdate(id,
            {
                firstName,
                middleName,
                lastName,
                email,
                phone,
                photo,
                country,
                city,
                address,
                password: await hashPassword(password),
            }, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: "success",
            message: "Admin updated successfully",
            data: admin
        })
    }
})

//@desc Delete admin
//@route DELETE /api/v1/admins/:id
//@access Private
exports.deleteAdminCtrl = AsyncHandler(async (req, res) => {
    try {
        res.status(200).json(
            {
                status: "success",
                data: "Delete admin"
            }
        );
    } catch (error) {
        res.json(
            {
                status: "failed",
                error: error.message
            }
        );
    }
})

//@desc Admin suspends a teacher
//@route PUT /api/v1/admins/suspend/teacher/:id
//@access Private
exports.adminSuspendTeacherCtrl = AsyncHandler(async (req, res) => {
    try {
        res.status(200).json(
            {
                status: "success",
                data: "Admin suspend teacher"
            }
        );
    } catch (error) {
        res.json(
            {
                status: "failed",
                error: error.message
            }
        );
    }
})

//@desc Admin unsuspends a teacher
//@route PUT /api/v1/admins/unsuspend/teacher/:id
//@access Private
exports.adminUnsuspendTeacherCtrl = AsyncHandler(async (req, res) => {
    try {
        res.status(200).json(
            {
                status: "success",
                data: "Admin unsuspend teacher"
            }
        );
    } catch (error) {
        res.json(
            {
                status: "failed",
                error: error.message
            }
        );
    }
})

//@desc Admin withdraw a teacher
//@route PUT /api/v1/admins/withdraw/teacher/:id
//@access Private
exports.adminWithdrawTeacherCtrl = AsyncHandler(async (req, res) => {
    try {
        res.status(200).json(
            {
                status: "success",
                data: "Admin withdraw teacher"
            }
        );
    } catch (error) {
        res.json(
            {
                status: "failed",
                error: error.message
            }
        );
    }
})

//@desc Admin unwithdraw a teacher
//@route PUT /api/v1/admins/unwithdraw/teacher/:id
//@access Private
exports.adminUnwithdrawTeacherCtrl = AsyncHandler(async (req, res) => {
    try {
        res.status(200).json(
            {
                status: "success",
                data: "Admin unwithdraw teacher"
            }
        );
    } catch (error) {
        res.json(
            {
                status: "failed",
                error: error.message
            }
        );
    }
})

//@desc Admin publish exams results
//@route PUT /api/v1/admins/publish/exam/:id
//@access Private
exports.adminPublishExamCtrl = AsyncHandler(async (req, res) => {
    try {
        res.status(200).json(
            {
                status: "success",
                data: "Admin publish exam results"
            }
        );
    } catch (error) {
        res.json(
            {
                status: "failed",
                error: error.message
            }
        );
    }
})

//@desc Admin unpublish exams results
//@route PUT /api/v1/admins/unpublish/exam/:id
//@access Private
exports.adminUnpublishExamCtrl = AsyncHandler(async (req, res) => {
    try {
        res.status(200).json(
            {
                status: "success",
                data: "Admin unpublish exam results"
            }
        );
    } catch (error) {
        res.json(
            {
                status: "failed",
                error: error.message
            }
        );
    }
})