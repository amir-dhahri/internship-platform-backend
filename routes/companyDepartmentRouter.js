const express = require("express");
const { getDepartmentsCtrl, createDepartmentCtrl, updateDepartmentCtrl, deleteDepartmentCtrl, getDepartmentCtrl, getDepartmentsStatisticsCtrl, getRecentDepartmentsCtrl } = require("../controllers/companyCoordinatorCtrl");
const isLogin = require("../middlewares/isLogin");
const isCompanyCoordinator = require("../middlewares/isCompanyCoordinator");


const companyDepartmentRouter = express.Router();

// Get all departments
companyDepartmentRouter.get("/", isLogin, isCompanyCoordinator, getDepartmentsCtrl);

// Get recent departments
companyDepartmentRouter.get("/recent", isLogin, isCompanyCoordinator, getRecentDepartmentsCtrl);

// Get departments statistics
companyDepartmentRouter.get("/statistics", isLogin, isCompanyCoordinator, getDepartmentsStatisticsCtrl);

// Get single department
companyDepartmentRouter.get("/:id", isLogin, isCompanyCoordinator, getDepartmentCtrl);

// Create department
companyDepartmentRouter.post("/", isLogin, isCompanyCoordinator, createDepartmentCtrl)

// Update department
companyDepartmentRouter.put("/:id", isLogin, isCompanyCoordinator, updateDepartmentCtrl)

// Delete department
companyDepartmentRouter.delete("/:id", isLogin, isCompanyCoordinator, deleteDepartmentCtrl)



module.exports = companyDepartmentRouter; 