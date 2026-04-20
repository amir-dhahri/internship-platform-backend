const AsyncHandler = require("express-async-handler");
const Department = require("../models/Department");
const AcademicLevel = require("../models/AcademicLevel");
const University = require("../models/University");
const AcademicCoordinator = require("../models/AcademicCoordinator");


//@desc Add department
//@route POST /api/v1/departments
//@access Private University Coordinator Only
exports.createDepartmentCtrl = AsyncHandler(async (req, res) => {
    const {
        name,
        description,
        isActive,
    } = req.body;
    const { id } = req.userAuth;
    const university = await University.findOne({ academicCoordinator: id });
    const departmentFound = await Department.findOne({ name, university: university._id });
    if (departmentFound) {
        throw new Error("Department already exists");
    }
    const department = await Department.create(
        {
            name,
            description,
            isActive,
            university: university._id
        }
    )
    const academicCoordinator = await AcademicCoordinator.findById(id);

    const receivers = [id]

    const notif = await Notification.create({
        sender: id,
        receivers,
        type: "SYSTEM",
        entity: name,
        entityType: Department,
        message: `New department "${name}" was created`,
        isRead: false,
        senderPhoto: academicCoordinator.photo
    });

    const io = req.app.get("io");

    receivers.forEach((receiverId) => {
        io.to(receiverId.toString()).emit("receiveNotification", notif)
    })

    res.status(201).json({
        status: "success",
        message: "Department added successfully",
        data: department,
    })
})


//@desc Get all departments
//@route GET /api/v1/departments
//@access Private University Coordinator Only
exports.getDepartmentsCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.userAuth;
    const university = await University.findOne({ academicCoordinator: id });
    const departments = await Department.find({ university: university._id });
    res.status(200).json(
        {
            status: "success",
            message: "Departments fetched successfully",
            data: departments,
        }
    );
})

//@desc Get departments statistics
//@route GET /api/v1/departments/statistics
//@access Private University Coordinator Only
exports.getDepartmentsStatisticsCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.userAuth;
    const university = await University.findOne({ academicCoordinator: id });
    const departments = await Department.find({ university: university._id });
    const departmentsCount = departments.length;
    let activeCount = 0;
    let inactiveCount = 0;
    for (const department of departments) {
        if (department.isActive) {
            activeCount += 1
        } else {
            inactiveCount += 1
        }
    }
    const activePercentage = ((activeCount / departmentsCount) * 100).toFixed(3);
    const inactivePercentage = ((inactiveCount / departmentsCount) * 100).toFixed(3);
    const statistics = {
        activePercentage,
        inactivePercentage,
        departmentsCount,
        activeCount,
        inactiveCount,
    }
    res.status(200).json(
        {
            status: "success",
            message: "Departments statistics fetched successfully",
            data: statistics,
        }
    );
})

//@desc Get recent departments 
//@route GET /api/v1/departments/recent
//@access Private University Coordinator Only
exports.getRecentDepartmentsCtrl = AsyncHandler(async (req, res) => {
    const { count } = req.query;
    const { id } = req.userAuth;
    const university = await University.findOne({ academicCoordinator: id });
    const departments = await Department.find({ university: university._id }).sort({ createdAt: -1 }).limit(count);
    res.status(200).json(
        {
            status: "success",
            message: "Departments fetched successfully",
            data: departments,
        }
    );
})

//@desc Get department academic levels
//@route GET /api/v1/departments/:id/academic-levels/
//@access Private University Coordinator Only
exports.getDepartmentAcademicLevelsCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const academicLevels = await AcademicLevel.find({ departmentId: id });
    res.status(200).json(
        {
            status: "success",
            message: "Academic levels fetched successfully",
            data: academicLevels,
        }
    );
})

//@desc Get department
//@route GET /api/v1/departments/:id
//@access Private University Coordinator Only
exports.getDepartmentCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const department = await Department.findById(id);
    if (!department) {
        throw new Error("Department Not Found!");
    }
    res.status(200).json({
        status: "success",
        message: "Department fetched successfully",
        data: department,
    });
})

//@desc Update department
//@route PUT /api/v1/departments/:id
//@access Private University Coordinator Only
exports.updateDepartmentCtrl = AsyncHandler(async (req, res) => {
    const { name,
        description,
        isActive, } = req.body;
    const { id } = req.params;
    // If name exists
    const university = await University.findOne({ academicCoordinator: req.userAuth.id });
    const departmentExists = await Department.findOne({ name, _id: { $ne: id }, university: university._id });
    if (departmentExists) {
        throw new Error("Department already exists");
    }
    const department = await Department.findByIdAndUpdate(id,
        {
            name,
            description,
            isActive,
        }, {
        new: true,
    });
    res.status(200).json({
        status: "success",
        message: "Department updated successfully",
        data: department
    })
})

//@desc Delete department
//@route DELETE /api/v1/departments/:id
//@access Private University Coordinator Only
exports.deleteDepartmentCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    await Department.findByIdAndDelete(id);

    res.status(200).json({
        status: "success",
        message: "Department deleted successfully",
        data: {},
    });
})

