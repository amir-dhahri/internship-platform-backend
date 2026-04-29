const express = require("express");
const multer = require("multer");
const isLogin = require("../middlewares/isLogin");
const isAcademicCoordinator = require("../middlewares/isAcademicCoordinator");
const { registerAcademicSupervisorCtrl, getAcademicSupervisorCtrl, getAcademicSupervisorsCtrl, updateAcademicSupervisorProfileCtrl, deleteAcademicSupervisorCtrl, toggleAssignAcademicYearToSupervisorCtrl, loginAcademicSupervisorCtrl, getAcademicSupervisorProfileCtrl } = require("../controllers/academicSupervisorCtrl");
const isAcademicSupervisor = require("../middlewares/isAcademicSupervisor");

const upload = multer({ storage: multer.memoryStorage() });


const academicSupervisorsRouter = express.Router();

// Register Academic Supervisor
academicSupervisorsRouter.post("/", isLogin, isAcademicCoordinator, registerAcademicSupervisorCtrl);

// Get Academic Supervisors
academicSupervisorsRouter.get("/", isLogin, isAcademicCoordinator, getAcademicSupervisorsCtrl);

// Get Academic Supervisor
academicSupervisorsRouter.get("/:id", isLogin, isAcademicCoordinator, getAcademicSupervisorCtrl);

// Update Academic Supervisor Profile
academicSupervisorsRouter.put("/:id/profile", isLogin, isAcademicCoordinator, upload.single("file"), updateAcademicSupervisorProfileCtrl);

// Get Academic Supervisor Profile
academicSupervisorsRouter.get("/:id/profile", isLogin, isAcademicCoordinator, getAcademicSupervisorCtrl);

// Delete Academic Supervisor 
academicSupervisorsRouter.delete("/:id", isLogin, isAcademicCoordinator, deleteAcademicSupervisorCtrl);

// Update Academic Supervisor profile
academicSupervisorsRouter.post("/:id/academic-years", isLogin, isAcademicCoordinator, toggleAssignAcademicYearToSupervisorCtrl);

// Login Academic Supervisor
academicSupervisorsRouter.post("/login", loginAcademicSupervisorCtrl);

// Get Academic Supervisor Profile
academicSupervisorsRouter.get("/profile", isLogin, isAcademicSupervisor, getAcademicSupervisorProfileCtrl);

// Update Academic Supervisor Profile
academicSupervisorsRouter.get("/profile", isLogin, isAcademicSupervisor, updateAcademicSupervisorProfileCtrl);



module.exports = academicSupervisorsRouter;

