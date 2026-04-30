const express = require("express");
const multer = require("multer");
const isLogin = require("../middlewares/isLogin");
const isAcademicCoordinator = require("../middlewares/isAcademicCoordinator");
const isAcademicSupervisor = require("../middlewares/isAcademicSupervisor");
const { registerAcademicSupervisorCtrl, getAcademicSupervisorCtrl, getAcademicSupervisorsCtrl, updateAcademicSupervisorProfileCtrl, deleteAcademicSupervisorCtrl, toggleAssignAcademicYearToSupervisorCtrl, loginAcademicSupervisorCtrl, getAcademicSupervisorProfileCtrl, fetchAcademicSupervisorProfileCtrl, modifyAcademicSupervisorProfileCtrl, getNotificationsCtrl, logoutCtrl, getDepartments } = require("../controllers/academicSupervisorCtrl");

const upload = multer({ storage: multer.memoryStorage() });


const academicSupervisorsRouter = express.Router();

// Get Academic Supervisor Departments
academicSupervisorsRouter.get("/departments", isLogin, isAcademicSupervisor, getDepartments);

// Register Academic Supervisor
academicSupervisorsRouter.post("/", isLogin, isAcademicCoordinator, registerAcademicSupervisorCtrl);

// Get Academic Supervisors
academicSupervisorsRouter.get("/", isLogin, isAcademicCoordinator, getAcademicSupervisorsCtrl);
// Get Academic Supervisor Profile
academicSupervisorsRouter.get("/fetch/profile", isLogin, isAcademicSupervisor, fetchAcademicSupervisorProfileCtrl);

// Update Academic Supervisor Profile
academicSupervisorsRouter.put("/modify/profile", isLogin, isAcademicSupervisor, upload.single("file"), modifyAcademicSupervisorProfileCtrl);

// Login Academic Supervisor
academicSupervisorsRouter.post("/login", loginAcademicSupervisorCtrl);

// Login Academic Supervisor
academicSupervisorsRouter.post("/logout", isLogin, isAcademicSupervisor, logoutCtrl);

// Login Academic Supervisor
academicSupervisorsRouter.get("/notifications", isLogin, isAcademicSupervisor, getNotificationsCtrl);

// Get Academic Supervisor
academicSupervisorsRouter.get("/:id", isLogin, isAcademicCoordinator, getAcademicSupervisorCtrl);

// Update Academic Supervisor Profile
academicSupervisorsRouter.put("/:id/profile", isLogin, isAcademicCoordinator, upload.single("file"), updateAcademicSupervisorProfileCtrl);

// Get Academic Supervisor Profile
academicSupervisorsRouter.get("/:id/profile", isLogin, isAcademicCoordinator, getAcademicSupervisorCtrl);

// Delete Academic Supervisor 
academicSupervisorsRouter.delete("/:id", isLogin, isAcademicCoordinator, deleteAcademicSupervisorCtrl);

// Assing Academic Supervisor Academic Years
academicSupervisorsRouter.post("/:id/academic-years", isLogin, isAcademicCoordinator, toggleAssignAcademicYearToSupervisorCtrl);



module.exports = academicSupervisorsRouter;

