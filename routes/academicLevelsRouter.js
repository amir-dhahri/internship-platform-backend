const express = require("express");
const { getAcademicLevelsCtrl, createAcademicLevelCtrl, updateAcademicLevelCtrl, deleteAcademicLevelCtrl, getAcademicLevelCtrl } = require("../controllers/academicLevelCtrl");
const isLogin = require("../middlewares/isLogin");
const isAcademicCoordinator = require("../middlewares/isAcademicCoordinator");
const { getAcademicLevelAcademicYearsCtrl } = require("../controllers/academicLevelCtrl");


const acdemicLevelRouter = express.Router();

// Get all academic levels
acdemicLevelRouter.get("/", getAcademicLevelsCtrl);

// Get single academic level
acdemicLevelRouter.get("/:id", isLogin, isAcademicCoordinator, getAcademicLevelCtrl);

// Create academic level
acdemicLevelRouter.post("/", isLogin, isAcademicCoordinator, createAcademicLevelCtrl)

// Update academic level
acdemicLevelRouter.put("/:id", isLogin, isAcademicCoordinator, updateAcademicLevelCtrl)

// Delete academic level
acdemicLevelRouter.delete("/:id", isLogin, isAcademicCoordinator, deleteAcademicLevelCtrl)

// Get academic level academic years
acdemicLevelRouter.get("/:id/academic-years", isLogin, isAcademicCoordinator, getAcademicLevelAcademicYearsCtrl);



module.exports = acdemicLevelRouter; 