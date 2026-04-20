const AsyncHandler = require("express-async-handler");
const AcademicLevel = require("../models/AcademicLevel");
const AcademicYear = require("../models/AcademicYear");

//@desc Add academic year
//@route POST /api/v1/academic-years
//@access Private University Coordinator Only
exports.createAcademicYearCtrl = AsyncHandler(async (req, res) => {
    const {
        name,
        academicLevelId
    } = req.body;

    const {id} = req.userAuth;

    const academicLevelFound = await AcademicLevel.findOne({ name, academicLevelId });
    if (academicLevelFound) {
        throw new Error("Academic year already exists");
    }

    const academicYear = await AcademicYear.create(
        {
            name,
            academicLevelId
        }
    )

    const receivers = [id]

    const notif = await Notification.create({
        sender: id,
        receivers,
        type: "SYSTEM",
        entity: name,
        entityType: "Academic Years",
        message: `New academic year "${name}" was created`,
        isRead: false,
        senderPhoto: academicCoordinator.photo
    });

    const io = req.app.get("io");

    receivers.forEach((receiverId) => {
        io.to(receiverId.toString()).emit("receiveNotification", notif)
    })

    res.status(201).json({
        status: "success",
        message: "Academic year added successfully",
        data: academicYear,
    })
})

//@desc Get all academic years
//@route GET /api/v1/academic-years
//@access Private University Coordinator Only
exports.getAcademicYearsCtrl = AsyncHandler(async (req, res) => {
    const academicYears = await AcademicYear.find();
    res.status(200).json(
        {
            status: "success",
            message: "Academic years fetched successfully",
            data: academicYears,
        }
    );
})

//@desc Get academic year
//@route GET /api/v1/academic-years/:id
//@access Private University Coordinator Only
exports.getAcademicYearCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const academicYear = await AcademicYear.findById(id);
    if (!academicYear) {
        throw new Error("Academic Year Not Found!");
    }
    res.status(200).json({
        status: "success",
        message: "Academic year fetched successfully",
        data: academicYear,
    });
})

//@desc Update academic year
//@route PUT /api/v1/academic-years/:id
//@access Private University Coordinator Only
exports.updateAcademicYearCtrl = AsyncHandler(async (req, res) => {

    const { name, academicLevelId } = req.body;
    const { id } = req.params;
    // If name exists

    const academicYearExists = await AcademicYear.findOne({ name, academicLevelId, _id: { $ne: id } });
    if (academicYearExists) {
        throw new Error("Academic ta already exists");
    }
    const academicYear = await AcademicYear.findByIdAndUpdate(id,
        {
            name,
        }, {
        new: true,
    });
    res.status(200).json({
        status: "success",
        message: "Academic year updated successfully",
        data: academicYear
    })
})

//@desc Delete academic year
//@route DELETE /api/v1/academic-years/:id
//@access Private University Coordinator Only
exports.deleteAcademicYearCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    await AcademicYear.findByIdAndDelete(id);

    res.status(200).json({
        status: "success",
        message: "Academic year deleted successfully",
        data: {},
    });
})

//@desc Get Academic level's academic years
//@route GET /api/v1/departments/:id/academic-years/
//@access Private University Coordinator Only
exports.getAcademicLevelAcademicYearsCtrl = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const academicYears = await AcademicYear.find({ academicLevelId: id });
    res.status(200).json(
        {
            status: "success",
            message: "Academic years fetched successfully",
            data: academicYears,
        }
    );
})