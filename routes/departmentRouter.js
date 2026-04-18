const express = require("express");
const { getDepartmentsCtrl, createDepartmentCtrl, updateDepartmentCtrl, deleteDepartmentCtrl, getDepartmentCtrl, getDepartmentsStatisticsCtrl, getRecentDepartmentsCtrl, getDepartmentAcademicLevelsCtrl } = require("../controllers/departmentCtrl");
const isLogin = require("../middlewares/isLogin");
const isAcademicCoordinator = require("../middlewares/isAcademicCoordinator");


const departmentRouter = express.Router();

// Get all departments
departmentRouter.get("/", isLogin, isAcademicCoordinator, getDepartmentsCtrl);

// Get recent departments
departmentRouter.get("/recent", isLogin, isAcademicCoordinator, getRecentDepartmentsCtrl);

// Get department academic levels
departmentRouter.get("/:id/academic-levels", isLogin, isAcademicCoordinator, getDepartmentAcademicLevelsCtrl);

// Get departments statistics
departmentRouter.get("/statistics", isLogin, isAcademicCoordinator, getDepartmentsStatisticsCtrl);

// Get single department
departmentRouter.get("/:id", isLogin, isAcademicCoordinator, getDepartmentCtrl);

// Create department
departmentRouter.post("/", isLogin, isAcademicCoordinator, createDepartmentCtrl)

// Update department
departmentRouter.put("/:id", isLogin, isAcademicCoordinator, updateDepartmentCtrl)

// Delete department
departmentRouter.delete("/:id", isLogin, isAcademicCoordinator, deleteDepartmentCtrl)



module.exports = departmentRouter; 