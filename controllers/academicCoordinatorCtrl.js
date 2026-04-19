const AsyncHandler = require("express-async-handler");
const AcademicSupervisor = require("../models/AcademicSupervisor");
const { hashPassword, isPassMatched } = require("../utils/helpers");
const University = require("../models/University");
const { uploadImage } = require("../utils/cloudinary");
const AcademicCoordinator = require("../models/AcademicCoordinator");
const generateToken = require("../utils/generateToken");


//@desc Register academic coordinator
//@route POST /api/v1/academic-coordinators/register
//@access Private Academic Coordinator Only
exports.registerAcademicCoordinatorCtrl = AsyncHandler(async (req, res) => {
    const {
        name,
        email,
        password,
    } = req.body;

    const academicCoordinatorFound = await AcademicCoordinator.findOne({ email });
    if (academicCoordinatorFound) {
        throw new Error("Academic coordinator already exists");
    }
    const firstName = name.split(" ")[0];
    const lastName = name.split(" ")[1];
    const academicCoordinator = await AcademicCoordinator.create(
        {
            firstName,
            lastName,
            email,
            password: await hashPassword(password)
        }
    )
    res.status(201).json({
        status: "success",
        message: "Academic coordinator registered successfully",
        data: academicCoordinator,
    })
})

//@desc Update academic coordinator profile
//@route PUT /api/v1/academic-coordinators/profile
//@acces Private Academic Coordinator Only
exports.updateAcademicCoordinatorProfileCtrl = AsyncHandler(async (req, res) => {
    console.log("ok");
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
    const { id } = req.userAuth;
    const file = req.file;
    let photo = undefined;
    if (file) {
        photo = await uploadImage(file);
    }
    const academicCoordinator = await AcademicCoordinator.findByIdAndUpdate(id, {
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
    res.status(200).json({
        status: "success",
        message: "Academic coordinator profile updated successfully",
        data: academicCoordinator,
    })
})

//@desc Login academic coordinator
//@route POST /api/v1/academic-coordinators/login
//@access Private Academic Coordinator Only
exports.loginAcademicCoordinatorCtrl = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    console.log("Email: ", email);
    console.log("Password: ", password);
    const academicCoordinator = await AcademicCoordinator.findOne({ email });

    // Check if email exists

    if (!academicCoordinator) {
        throw new Error("Invalid login credentials");
    }

    const isMatched = await isPassMatched(password, academicCoordinator.password);

    console.log("IsMatched: ", isMatched);


    if (!isMatched) {
        throw new Error("Invalid login credentials");
    }

    const token = generateToken(academicCoordinator._id, "academic-coordinator");
    res.cookie('token', token, {
        httpOnly: true,
        secure: false,        // true in production (HTTPS)
        sameSite: 'strict',  // or 'lax' depending on your setup
        path: '/',
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    });
    res.status(200)
        .json({
            status: "success",
            message: "Academic coordinator logged in successfully",
            // data: token
        })
})

//@desc Get academic coordinator profile
//@route GET /api/v1/academic-coordinators/profile
//@access Private Academic Coordinator Only
exports.getAcademicCoordinatorProfileCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.userAuth;
    const academicCoordinator = await AcademicCoordinator.findById(id).select(
        "-password -createdAt -updatedAt"
    );
    if (!academicCoordinator) {
        throw new Error("Academic coordinator Not Found!");
    }
    res.status(200).json({
        status: "success",
        message: "Academic coordinator profile fetched successfully",
        data: academicCoordinator,
    });
})

//@desc Get university
//@route GET /api/v1/academic-coordinators/univertsity
//@access Private Academic Coordinator Only
exports.getUniversityCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.userAuth;
    const university = await University.findOne({ academicCoordinator: id });
    res.status(200).json({
        status: "success",
        message: "Academic supervisor registered successfully",
        data: university,
    })
})

//@desc Register academic supervisor
//@route POST /api/v1/academic-coordinators/register/academic-supervisor
//@access Private Academic Coordinator Only
exports.registerAcademicSupervisorCtrl = AsyncHandler(async (req, res) => {
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
    res.status(201).json({
        status: "success",
        message: "Academic supervisor registered successfully",
        data: academicSupervisor,
    })
})

//@desc Register university
//@route POST /api/v1/academic-coordinators/register/university
//@access Private Academic Coordinator Only
exports.registerUniversityCtrl = AsyncHandler(async (req, res) => {
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
    const universityFound = await University.findOne({ name, academicCoordinator: id });
    if (universityFound) {
        throw new Error("University already exists");
    }
    const file = req.file;
    const logo = await uploadImage(file)
    const university = await University.create(
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
            academicCoordinator: id
        }
    )
    res.status(201).json({
        status: "success",
        message: "University registered successfully",
        data: university,
    })
})