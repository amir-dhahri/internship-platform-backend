const express = require("express");
const { getAcademicYearsCtrl, createAcademicYearCtrl, updateAcademicYearCtrl, deleteAcademicYearCtrl, getAcademicYearCtrl } = require("../controllers/academicYearCtrl");
const isLogin = require("../middlewares/isLogin");
const isAcademicCoordinator = require("../middlewares/isAcademicCoordinator");


const acdemicYearRouter = express.Router();

// Get all academic Years
acdemicYearRouter.get("/", getAcademicYearsCtrl);

// Get single academic Year
acdemicYearRouter.get("/:id", isLogin, isAcademicCoordinator, getAcademicYearCtrl);

// Create academic Year
acdemicYearRouter.post("/", isLogin, isAcademicCoordinator, createAcademicYearCtrl)

// Update academic Year
acdemicYearRouter.put("/:id", isLogin, isAcademicCoordinator, updateAcademicYearCtrl)

// Delete academic Year
acdemicYearRouter.delete("/:id", isLogin, isAcademicCoordinator, deleteAcademicYearCtrl)



module.exports = acdemicYearRouter; 