const AsyncHandler = require("express-async-handler");
const { default: Notification } = require("../models/Notification");
const Message = require("../models/Message");
const Student = require("../models/Student");
const AcademicYear = require("../models/AcademicYear");
const { hashPassword, isPassMatched } = require("../utils/helpers");
const { uploadImage } = require("../utils/cloudinary");
const generateToken = require("../utils/generateToken");
const AcademicSupervisor = require("../models/AcademicSupervisor");
const Internship = require("../models/Internship");
const InternshipApplication = require("../models/InternshipApplication");
const JobApplication = require("../models/jobApplication");
const Job = require("../models/Job");
const Training = require("../models/Training");
const TrainingApplication = require("../models/trainingApplication");
const Task = require("../models/task");

//@desc Register student
//@route POST /api/v1/students/
//@access Private Academic Supervisors Only
exports.registerStudentCtrl = AsyncHandler(async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password
    } = req.body;
    const { id } = req.userAuth;
    const studentFound = await Student.findOne({ email });

    if (studentFound) {
        throw new Error("Student already exists");
    }

    const student = await Student.create(
        {
            firstName,
            lastName,
            email,
            academicSupervisorId: id,
            password: await hashPassword(password),
        }
    )
    const academicSupervisor = await AcademicSupervisor.findById(id);

    const receivers = [id]

    const notif = await Notification.create({
        sender: id,
        receivers,
        type: "SYSTEM",
        entity: `${firstName} ${lastName}`,
        entityType: "Students",
        message: `New student "${firstName} ${lastName}" was registered`,
        isRead: false,
        senderPhoto: academicSupervisor.photo
    });

    const io = req.app.get("io");

    receivers.forEach((receiverId) => {
        io.to(receiverId.toString()).emit("receiveNotification", notif)
    })

    res.status(201).json({
        status: "success",
        message: "Student registered successfully",
        data: student,
    })
})

//@desc Get all students
//@route GET /api/v1/students/
//@access Private Academic Supervisor Only
exports.getStudentsCtrl = AsyncHandler(async (req, res) => {
    const students = await Student.find().select("-password");
    res.status(200).json(
        {
            status: "success",
            message: "Students fetched successfully",
            data: students,
        }
    );
})

//@desc Get all student
//@route GET /api/v1/students/single
//@access Private Academic Supervisor Only
exports.getStudentSingleCtrl = AsyncHandler(async (req, res) => {
    const {id} = req.userAuth;
    const student = await Student.findById(id).select("-password");
    res.status(200).json(
        {
            status: "success",
            message: "Student fetched successfully",
            data: student,
        }
    );
})


//@desc Get student
//@route GET /api/v1/students/:id
//@access Private Academic Supervisor Only
exports.getStudentCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
        throw new Error("Student Not Found!");
    }
    res.status(200).json({
        status: "success",
        message: "Student fetched successfully",
        data: student,
    });
})

//@desc Get student profile
//@route GET /api/v1/students/:id/profile
//@access Private Academic Supervisor
exports.getStudentProfileCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const student = await Student.findById(id).select("-password");
    if (!student) {
        throw new Error("Student Not Found!");
    }
    res.status(200).json({
        status: "success",
        message: "Student fetched successfully",
        data: student,
    });
})

//@desc Update student profile
//@route PUT /api/v1/students/:id/profile
//@access Private Academic Supervisor
exports.updateStudentProfileCtrl = AsyncHandler(async (req, res) => {
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

    const studentFound = await Student.findOne({ email, _id: { $ne: id } });
    if (studentFound) {
        throw new Error("Student credentials already exist")
    }

    const file = req.file;
    let photo = undefined;
    if (file) {
        photo = await uploadImage(file);
    }

    const student = await Student.findByIdAndUpdate(id, {
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

    const academicSupervisor = await AcademicSupervisor.findById(userId);

    const receivers = [userId]

    const name = `${student.firstName} ${student.lastName}`

    const notif = await Notification.create({
        sender: userId,
        receivers,
        type: "SYSTEM",
        entity: `${name}`,
        entityType: "Academic Supervisors",
        message: `Student "${name}" profile was updated`,
        isRead: false,
        senderPhoto: academicSupervisor.photo
    });

    const io = req.app.get("io");

    receivers.forEach((receiverId) => {
        io.to(receiverId.toString()).emit("receiveNotification", notif)
    })

    res.status(200).json({
        status: "success",
        message: "Student profile updated successfully",
        data: student,
    })
})

//@desc Delete student
//@route DELETE /api/v1/students/:id
//@access Private Academic Supervisor Only
exports.deleteStudentCtrl = AsyncHandler(async (req, res) => {

    const { id } = req.params;

    const { firstName, lastName } = await Student.findByIdAndDelete(id);

    const name = `${firstName} ${lastName}`

    const { id: userId } = req.userAuth;

    const academicSupervisor = await AcademicSupervisor.findById(userId);

    const receivers = [userId]

    const notif = await Notification.create({
        sender: userId,
        receivers,
        type: "SYSTEM",
        entity: name,
        entityType: "Students",
        message: `New student "${name}" was deleted`,
        isRead: false,
        senderPhoto: academicSupervisor.photo
    });

    const io = req.app.get("io");

    receivers.forEach((receiverId) => {
        io.to(receiverId.toString()).emit("receiveNotification", notif)
    })

    res.status(200).json({
        status: "success",
        message: "Student deleted successfully",
        data: {},
    });
})

//@desc Assign academic year
//@route POST /api/v1/students/:id/academic-years
//@access Private Academic Supervisor Only
exports.toggleAssignAcademicYearToStudentCtrl = AsyncHandler(async (req, res) => {
    const { id: studentId } = req.params;
    const { academicYearId } = req.body;
    const student = await Student.findById(studentId);
    if (!student) {
        throw new Error("Student not found");
    }

    const academicYear = await AcademicYear.findById(academicYearId);

    if (!academicYear) {
        throw new Error("Academic year not found");
    }

    const exists = student.academicYearId?.toString() === academicYearId;

    if (exists) {
        student.academicYearId = null;
    } else {
        student.academicYearId = academicYearId;
    }

    await student.save();

    const name = `${student.firstName} ${student.lastName}`
    console.log("exists: ", exists);

    const message = exists
        ? `Student "${name}" was unassigned from academic year "${academicYear.name}".`
        : `Student "${name}" was assigned a new academic year "${academicYear.name}".`;

    const { id: userId } = req.userAuth;

    const academicSupervisor = await AcademicSupervisor.findById(userId);

    const receivers = [userId]

    const notif = await Notification.create({
        sender: userId,
        receivers,
        type: "SYSTEM",
        entity: name,
        entityType: "Students",
        message: message,
        isRead: false,
        senderPhoto: academicSupervisor.photo
    });

    const io = req.app.get("io");

    receivers.forEach((receiverId) => {
        io.to(receiverId.toString()).emit("receiveNotification", notif)
    })

    res.status(200).json({
        status: "success",
        message: "Academic year assigned successfully",
        data: student
    });
})

//@desc Login students
//@route POST /api/v1/students/login
//@access Private Students Only
exports.loginStudentCtrl = AsyncHandler(async (req, res) => {

    const { email, password } = req.body;

    const student = await Student.findOne({ email });

    // Check if email exists

    if (!student) {
        throw new Error("Invalid login credentials");
    }


    const isMatched = await isPassMatched(password, student.password);


    if (!isMatched) {
        throw new Error("Invalid login credentials");
    }

    const token = generateToken(student._id, "student");

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
            message: "Student logged in successfully",
        })
})

//@desc Get student profile
//@route GET /api/v1/students/profile
//@access Private Academic Supervisor
exports.fetchStudentProfileCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.userAuth;

    const student = await Student.findById(id).select("-password");
    if (!student) {
        throw new Error("Student Not Found!");
    }

    res.status(200).json({
        status: "success",
        message: "Student fetched successfully",
        data: student,
    });
})

//@desc Update student profile
//@route PUT /api/v1/students/profile
//@access Private University Supervisors 
exports.modifyStudentProfileCtrl = AsyncHandler(async (req, res) => {

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

    const studentFound = await Student.findOne({ email, _id: { $ne: id } });
    if (studentFound) {
        throw new Error("Student credentials already exist")
    }

    const file = req.file;
    let photo = undefined;
    if (file) {
        photo = await uploadImage(file);
    }

    const student = await Student.findByIdAndUpdate(id, {
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

    const academicSupervisor = await AcademicSupervisor.findById(id);

    const receivers = [id]

    const name = `${student.firstName} ${student.lastName}`

    const notif = await Notification.create({
        sender: id,
        receivers,
        type: "SYSTEM",
        entity: `${name}`,
        entityType: "Students",
        message: `Student "${name}" profile was updated`,
        isRead: false,
        senderPhoto: academicSupervisor.photo
    });

    const io = req.app.get("io");

    receivers.forEach((receiverId) => {
        io.to(receiverId.toString()).emit("receiveNotification", notif)
    })

    res.status(200).json({
        status: "success",
        message: "Student profile updated successfully",
        data: student,
    })
})

//@desc Get all notifications 
//@route GET /api/v1/students/notifications
//@access  Private Students Only
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

//@desc Logout Student
//@route GET /api/v1/students/logout
//@access  Private Student Only
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


//@desc Get Student Departments
//@route GET /api/v1/students/departments
//@access Private Student Only
exports.getDepartments = AsyncHandler(async (req, res) => {
    const { id } = req.userAuth;
    const student = await Student.findById(id).populate({
        path: "academicYearId",
        populate: {
            path: "academicLevelId",
            populate: {
                path: "departmentId"
            }
        }
    });


    const departments = {};

    const year = student.academicYearId;
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

    res.status(200).json({
        status: "success",
        message: "Departments fetched successfully",
        data: departments
    })
})

//@desc Get Academic Year Students
//@route GET /api/v1/students/academic-years/:id
//@access Private Academic Supervisor Only
exports.getAcademicYearStudentCtrl = AsyncHandler(async (req, res) => {
    const { id: yearId } = req.params;
    const students = await Student.find({
        academicYearId: yearId
    });
    res.status(200).send({
        status: "success",
        message: "Students fetched successfully",
        data: students
    })
})

//@desc Get Internships
//@route GET /api/v1/students/internships
//@access Private Student Only
exports.getInternships = AsyncHandler(async (req, res) => {
    const { id } = req.userAuth;

    const student = await Student.findById(id);

    const internships = [];

    internships.push(
        ...(await Internship.find({
            academicSupervisor: student.academicSupervisorId
        }))
    );

    internships.push(
        ...(await Internship.find({
            academicSupervisor: { $exists: false }
        }))
    );

    res.status(200).json({
        status: "success",
        message: "Internships fetched successfully",
        data: internships
    });
});

//@desc Get Internship
//@route GET /api/v1/students/internships/:id
//@access Private Student Only
exports.getInternship = AsyncHandler(async (req, res) => {
    const {id} = req.params;
    const internship = await Internship.findById(id);
    res.status(200).json({
        status: "success",
        message: "Internship fetched successfully",
        data: internship
    });
});

//@desc Get Jobs
//@route GET /api/v1/students/jobs
//@access Private Student Only
exports.getJobs = AsyncHandler(async (req, res) => {
    const jobs = await Job.find();
    res.status(200).json({
        status: "success",
        message: "Jobs fetched successfully",
        data: jobs
    });
});

//@desc Get Job
//@route GET /api/v1/students/jobs/:id
//@access Private Student Only
exports.getJob = AsyncHandler(async (req, res) => {
    const {id} = req.params;
    const job = await Job.findById(id);
    res.status(200).json({
        status: "success",
        message: "Job fetched successfully",
        data: job
    });
});

//@desc Get Trainings
//@route GET /api/v1/students/trainings
//@access Private Student Only
exports.getTrainings = AsyncHandler(async (req, res) => {
    const trainings = await Training.find();
    res.status(200).json({
        status: "success",
        message: "Trainings fetched successfully",
        data: trainings
    });
});

//@desc Get Training
//@route GET /api/v1/students/trainings/:id
//@access Private Student Only
exports.getTraining = AsyncHandler(async (req, res) => {
    const {id} = req.params;
    const training = await Training.findById(id);
    res.status(200).json({
        status: "success",
        message: "Training fetched successfully",
        data: training
    });
});

//@desc Get Internship Applications
//@route GET /api/v1/students/internship-application
//@access Private Student Only
exports.getInternshipApplications = AsyncHandler(async (req, res) => {
    const { id } = req.userAuth;
    const internshipApplications = await InternshipApplication.find({student: id}).populate("internship");
    res.status(200).json({
        status: "success",
        message: "Internship applications fetched successfully",
        data: internshipApplications
    });
});

//@desc Get job Applications
//@route GET /api/v1/students/job-applications
//@access Private Student Only
exports.getJobApplications = AsyncHandler(async (req, res) => {
    const { id } = req.userAuth;
    const jobApplications = await JobApplication.find({student: id}).populate("job");
    res.status(200).json({
        status: "success",
        message: "Job applications fetched successfully",
        data: jobApplications
    });
});


//@desc Get Training Applications
//@route GET /api/v1/students/Training-applications
//@access Private Student Only
exports.getTrainingApplications = AsyncHandler(async (req, res) => {
    const { id } = req.userAuth;
    const trainingApplications = await TrainingApplication.find({student: id}).populate("training");
    res.status(200).json({
        status: "success",
        message: "Training applications fetched successfully",
        data: trainingApplications
    });
});

//@desc Student send message
//@route POST /api/v1/academic-supervisors/chat/send
//@access Private Student Only
exports.sendMessage = AsyncHandler(async (req, res) => {
    const { text, receiverId } = req.body;
    const { id: senderId } = req.userAuth;
    const message = await Message.create({
        receiverId,
        senderId,
        text,
    });
    res.status(200).json({
        status: "success",
        message: "Message sent successfully",
        data: message
    })
})

//@desc Student Get Messages
//@route POST /api/v1/academic-supervisors/chat/messages
//@access Private Student Only
exports.getMessages = AsyncHandler(async (req, res) => {
    const { id } = req.userAuth;
    const messages = await Message.find({
        $or: [
            { senderId: id },
            { receiverId: id }
        ]
    });
    res.status(200).json({
        status: "success",
        message: "Messages fetched successfully",
        data: messages
    });
});

//@desc Academic Supervisor assign task
//@route POST /api/v1/academic-supervisors/tasks/assign
//@access Private Academic Supervisor Only
exports.assignTask = AsyncHandler(async (req, res) => {
    const { content,status } = req.body;
    const { id } = req.userAuth;
    const task = await Task.create({
        receiverId:id ,
        senderId: id,
        content,
        status
    });
    res.status(200).json({
        status: "success",
        message: "Task assigned successfully",
        data: task
    })
})


//@desc Students Get Tasks
//@route POST /api/v1/academic-supervisors/tasks
//@access Private Students Only
exports.getTasks = AsyncHandler(async (req, res) => {
    const { id } = req.userAuth;
    const tasks = await Task.find({ receiverId: id });
    res.status(200).json({
        status: "success",
        message: "Tasks fetched successfully",
        data: tasks
    });
});


//@desc Student Update Task
//@route POST /api/v1/academic-supervisors/tasks/update/:id
//@access Private Student Only
exports.updateTaskStatus = AsyncHandler(async (req, res) => {
    const { id: taskId } = req.params;
    const { status } = req.body;
    
    const task = await Task.findById(taskId);

    if (!task) {
        return res.status(404).json({
            status: "fail",
            message: "Task not found",
        });
    }
    task.status = status;
    await task.save();

    res.status(200).json({
        status: "success",
        message: "Task status updated successfully",
        data: task,
    });
});