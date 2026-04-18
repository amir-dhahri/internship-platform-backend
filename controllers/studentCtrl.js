const AsyncHandler = require("express-async-handler")
const Student = require("../models/Student");
const generateToken = require("../utils/generateToken");
const { hashPassword, isPassMatched } = require("../utils/helpers");

//@desc Register student
//@route POST /api/v1/students/register
//@access Private
exports.registerStudentCtrl = AsyncHandler(async (req, res) => {
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
        department,
        degree,
        university,
        year,
        skills,
        cv,
        linkedin,
        github,
        password } = req.body;

    // Check if email exists
    const StudentFound = await Student.findOne({ email });
    if (StudentFound) {
        throw new Error("Student already exists");
    }

    // Register
    const Student = await Student.create(
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
            department,
            degree,
            university,
            year,
            skills,
            cv,
            linkedin,
            github,
            password: await hashPassword(password)
        }
    )
    res.status(201).json({
        status: "success",
        message: "Student registered successfully",
        data: Student,
    })
})

//@desc Login student
//@route POST /api/v1/students/login
//@access Private
exports.loginStudentCtrl = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });

    // Check if email exists

    if (!student) {
        throw new Error("Invalid login credentials");
    }

    const isMatched = isPassMatched(password, Student.password);

    if (!isMatched) {
        throw new Error("Invalid login credentials");
    }

    const token = generateToken(Student._id);

    res.status(200)
        .json({
            status: "success",
            message: "Student logged in successfully",
            data: token,
        })
})

//@desc Get all Students
//@route GET /api/v1/Students
//@access Private
exports.getStudentsCtrl = AsyncHandler(async (req, res) => {
    const students = await Student.find();
    res.status(200).json(
        {
            status: "success",
            message: "Students fetched successfully",
            data: students,
        }
    );
})

//@desc Get student profile
//@route GET /api/v1/students/profile
//@access Private
exports.getStudentProfileCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.userAuth;
    const student = await Student.findById(id).select(
        "-password -createdAt -updatedAt"
    );
    if (!student) {
        throw new Error("Student Not Found!");
    }
    res.status(200).json({
        status: "success",
        message: "Student Profile fetched successfully",
        data: student,
    });
})

//@desc Update student
//@route PUT /api/v1/students/:id
//@access Private
exports.updateStudentCtrl = AsyncHandler(async (req, res) => {
    const { firstName,
        middleName,
        lastName,
        email,
        phone,
        photo,
        country,
        city,
        address,
        department,
        degree,
        university,
        year,
        skills,
        cv,
        linkedin,
        github,
        password } = req.body;
    // If email exists
    const { id } = req.userAuth;
    const emailExist = await Student.findOne({ email });
    if (emailExist) {
        throw new Error("This email is taken/exists");
    } else {
        const student = await Student.findByIdAndUpdate(id,
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
                department,
                degree,
                university,
                year,
                skills,
                cv,
                linkedin,
                github,
                password: await hashPassword(password),
            }, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: "success",
            message: "Student updated successfully",
            data: student
        })
    }
})

//@desc Delete Student
//@route DELETE /api/v1/Students/:id
//@access Private
exports.deleteStudentCtrl = AsyncHandler(async (req, res) => {
    try {
        res.status(200).json(
            {
                status: "success",
                data: "Delete Student"
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

//@desc Student suspends a teacher
//@route PUT /api/v1/Students/suspend/teacher/:id
//@access Private
exports.studentSuspendTeacherCtrl = AsyncHandler(async (req, res) => {
    try {
        res.status(200).json(
            {
                status: "success",
                data: "Student suspend teacher"
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

//@desc Student unsuspends a teacher
//@route PUT /api/v1/Students/unsuspend/teacher/:id
//@access Private
exports.studentUnsuspendTeacherCtrl = AsyncHandler(async (req, res) => {
    try {
        res.status(200).json(
            {
                status: "success",
                data: "Student unsuspend teacher"
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

//@desc Student withdraw a teacher
//@route PUT /api/v1/Students/withdraw/teacher/:id
//@access Private
exports.studentWithdrawTeacherCtrl = AsyncHandler(async (req, res) => {
    try {
        res.status(200).json(
            {
                status: "success",
                data: "Student withdraw teacher"
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

//@desc Student unwithdraw a teacher
//@route PUT /api/v1/Students/unwithdraw/teacher/:id
//@access Private
exports.studentUnwithdrawTeacherCtrl = AsyncHandler(async (req, res) => {
    try {
        res.status(200).json(
            {
                status: "success",
                data: "Student unwithdraw teacher"
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

//@desc Student publish exams results
//@route PUT /api/v1/Students/publish/exam/:id
//@access Private
exports.studentPublishExamCtrl = AsyncHandler(async (req, res) => {
    try {
        res.status(200).json(
            {
                status: "success",
                data: "Student publish exam results"
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

//@desc Student unpublish exams results
//@route PUT /api/v1/Students/unpublish/exam/:id
//@access Private
exports.studentUnpublishExamCtrl = AsyncHandler(async (req, res) => {
    try {
        res.status(200).json(
            {
                status: "success",
                data: "Student unpublish exam results"
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