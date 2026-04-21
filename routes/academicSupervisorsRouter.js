const express = require("express");
const multer = require("multer");
const isLogin = require("../middlewares/isLogin");
const isAcademicCoordinator = require("../middlewares/isAcademicCoordinator");
const { registerAcademicSupervisorCtrl, getAcademicSupervisorCtrl, getAcademicSupervisorsCtrl, updateAcademicSupervisorProfileCtrl, deleteAcademicSupervisorCtrl, assignAcademicYearToSupervisorCtrl } = require("../controllers/academicSupervisorCtrl");

const upload = multer({ storage: multer.memoryStorage() });


const academicSupervisorsRouter = express.Router();

// Register Academic Supervisor
academicSupervisorsRouter.post("/", isLogin, isAcademicCoordinator, registerAcademicSupervisorCtrl);

// Get Academic Supervisors
academicSupervisorsRouter.get("/", isLogin, isAcademicCoordinator, getAcademicSupervisorsCtrl);

// Get Academic Supervisor
academicSupervisorsRouter.get("/:id", isLogin, isAcademicCoordinator, getAcademicSupervisorCtrl);

// Update Academic Supervisor profile
academicSupervisorsRouter.put("/:id/profile", isLogin, isAcademicCoordinator, updateAcademicSupervisorProfileCtrl);

// Delete Academic Supervisor 
academicSupervisorsRouter.delete("/:id", isLogin, isAcademicCoordinator, deleteAcademicSupervisorCtrl);

// Update Academic Supervisor profile
academicSupervisorsRouter.post("/:id/academic-years", isLogin, isAcademicCoordinator, assignAcademicYearToSupervisorCtrl);


module.exports = academicSupervisorsRouter;

