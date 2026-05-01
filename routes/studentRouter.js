const express = require("express");
const multer = require("multer");
const isLogin = require("../middlewares/isLogin");
const isAcademicCoordinator = require("../middlewares/isAcademicCoordinator");
const isAcademicSupervisor = require("../middlewares/isAcademicSupervisor");
const { registerAcademicSupervisorCtrl, getAcademicSupervisorCtrl, getAcademicSupervisorsCtrl, updateAcademicSupervisorProfileCtrl, deleteAcademicSupervisorCtrl, toggleAssignAcademicYearToSupervisorCtrl, loginAcademicSupervisorCtrl, getAcademicSupervisorProfileCtrl, fetchAcademicSupervisorProfileCtrl, modifyAcademicSupervisorProfileCtrl, getNotificationsCtrl, logoutCtrl, getDepartments, getAcademicYears, getStudents } = require("../controllers/academicSupervisorCtrl");

const upload = multer({ storage: multer.memoryStorage() });


const studentRouter = express.Router();

// Get Student
studentRouter.get("/academic-years/:id", isLogin, isAcademicSupervisor, getStudents);

// Get Academic Supervisor Departments
studentRouter.get("/departments", isLogin, isAcademicSupervisor, getDepartments);

// Register Academic Supervisor
studentRouter.post("/", isLogin, isAcademicCoordinator, registerAcademicSupervisorCtrl);

// Get Academic Supervisors
studentRouter.get("/", isLogin, isAcademicCoordinator, getstudentCtrl);

// Get Academic Supervisor Profile
studentRouter.get("/fetch/profile", isLogin, isAcademicSupervisor, fetchAcademicSupervisorProfileCtrl);

// Update Academic Supervisor Profile
studentRouter.put("/modify/profile", isLogin, isAcademicSupervisor, upload.single("file"), modifyAcademicSupervisorProfileCtrl);

// Login Academic Supervisor
studentRouter.post("/login", loginAcademicSupervisorCtrl);

// Login Academic Supervisor
studentRouter.post("/logout", isLogin, isAcademicSupervisor, logoutCtrl);

// Login Academic Supervisor
studentRouter.get("/notifications", isLogin, isAcademicSupervisor, getNotificationsCtrl);

// Get Academic Supervisor
studentRouter.get("/:id", isLogin, isAcademicCoordinator, getAcademicSupervisorCtrl);

// Update Academic Supervisor Profile
studentRouter.put("/:id/profile", isLogin, isAcademicCoordinator, upload.single("file"), updateAcademicSupervisorProfileCtrl);

// Get Academic Supervisor Profile
studentRouter.get("/:id/profile", isLogin, isAcademicCoordinator, getAcademicSupervisorCtrl);

// Delete Academic Supervisor 
studentRouter.delete("/:id", isLogin, isAcademicCoordinator, deleteAcademicSupervisorCtrl);

// Assing Academic Supervisor Academic Years
studentRouter.post("/:id/academic-years", isLogin, isAcademicCoordinator, toggleAssignAcademicYearToSupervisorCtrl);


module.exports = studentRouter;