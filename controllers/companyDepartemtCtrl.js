const AsyncHandler = require("express-async-handler");
const Department = require("../models/Department");
const { default: Notification } = require("../models/Notification");
const Company = require("../models/Company");
const CompanyCoordinator = require("../models/CompanyCoordinator");


//@desc Add department
//@route POST /api/v1/departments/company
//@access Private Company Coordinator Only
exports.createDepartmentCtrl = AsyncHandler(async (req, res) => {
    
    const {
        name,
        description,
        isActive,
    } = req.body;
    const { id } = req.userAuth;
    const company = await Company.findOne({ companyCoordinator: id });
    const departmentFound = await Department.findOne({ name, company: company._id });
    if (departmentFound) {
        throw new Error("Company department already exists");
    }
    const department = await Department.create(
        {
            name,
            description,
            isActive,
            company: company._id
        }
    )
    const companyCoordinator = await CompanyCoordinator.findById(id);

    const receivers = [id]

    const notif = await Notification.create({
        sender: id,
        receivers,
        type: "SYSTEM",
        entity: name,
        entityType: "Company departments",
        message: `New department "${name}" was created`,
        isRead: false,
        senderPhoto: companyCoordinator.photo
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
//@route GET /api/v1/departments/company
//@access Private Company Coordinator Only
exports.getDepartmentsCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.userAuth;
    const company = await Company.findOne({ companyCoordinator: id });
    const departments = await Department.find({ company: company._id });
    res.status(200).json(
        {
            status: "success",
            message: "Company departments fetched successfully",
            data: departments,
        }
    );
})

//@desc Get departments statistics
//@route GET /api/v1/departments/company/statistics
//@access Private Company Coordinator Only
exports.getDepartmentsStatisticsCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.userAuth;
    const company = await Company.findOne({ companyCoordinator: id });
    const departments = await Department.find({ company: company._id });
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
            message: "Company departments statistics fetched successfully",
            data: statistics,
        }
    );
})

//@desc Get recent departments 
//@route GET /api/v1/departments/company/recent
//@access Private Company Coordinator Only
exports.getRecentDepartmentsCtrl = AsyncHandler(async (req, res) => {
    const { count } = req.query;
    const { id } = req.userAuth;
    const company = await Company.findOne({ companyCoordinator: id });
    const departments = await Department.find({ company: company._id }).sort({ createdAt: -1 }).limit(count);
    res.status(200).json(
        {
            status: "success",
            message: "Company departments fetched successfully",
            data: departments,
        }
    );
})


//@desc Get department
//@route GET /api/v1/departments/company/:id
//@access Private Company Coordinator Only
exports.getDepartmentCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const department = await Department.findById(id);
    if (!department) {
        throw new Error("Company Department Not Found!");
    }
    res.status(200).json({
        status: "success",
        message: "Company department fetched successfully",
        data: department,
    });
})

//@desc Update department
//@route PUT /api/v1/departments/company/:id
//@access Private Company Coordinator Only
exports.updateDepartmentCtrl = AsyncHandler(async (req, res) => {
    const { name,
        description,
        isActive, } = req.body;
    const { id } = req.params;
    const { id: userId } = req.userAuth;
    // If name exists
    const company = await Company.findOne({ companyCoordinator: userId });
    const departmentExists = await Department.findOne({ name, _id: { $ne: id }, company: company._id });
    if (departmentExists) {
        throw new Error("Company department already exists");
    }
    const department = await Department.findByIdAndUpdate(id,
        {
            name,
            description,
            isActive,
        }, {
        new: true,
    });
    const companyCoordinator = await CompanyCoordinator.findById(userId);

    const receivers = [userId]

    const notif = await Notification.create({
        sender: userId,
        receivers,
        type: "SYSTEM",
        entity: name,
        entityType: "Company departments",
        message: `New department "${name}" was updated`,
        isRead: false,
        senderPhoto: companyCoordinator.photo
    });
    const io = req.app.get("io");

    receivers.forEach((receiverId) => {
        io.to(receiverId.toString()).emit("receiveNotification", notif)
    })

    res.status(200).json({
        status: "success",
        message: "Company department updated successfully",
        data: department
    })
})

//@desc Delete department
//@route DELETE /api/v1/departments/company/:id
//@access Private Company Coordinator Only
exports.deleteDepartmentCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = await Department.findByIdAndDelete(id);

    const { id: userId } = req.userAuth;

    const companyCoordinator = await CompanyCoordinator.findById(userId);

    const receivers = [userId]

    const notif = await Notification.create({
        sender: userId,
        receivers,
        type: "SYSTEM",
        entity: name,
        entityType: "Company departments",
        message: `New department "${name}" was deleted`,
        isRead: false,
        senderPhoto: companyCoordinator.photo
    });

    const io = req.app.get("io");

    receivers.forEach((receiverId) => {
        io.to(receiverId.toString()).emit("receiveNotification", notif)
    })

    res.status(200).json({
        status: "success",
        message: "Company department deleted successfully",
        data: {},
    });
})

