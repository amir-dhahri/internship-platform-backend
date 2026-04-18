const express = require("express");
const multer = require("multer");
const { registerAcademicSupervisorCtrl, registerUniversityCtrl, getUniversityCtrl, registerAcademicCoordinatorCtrl, loginAcademicCoordinatorCtrl, getAcademicCoordinatorProfileCtrl, updateAcademicCoordinatorProfileCtrl } = require("../controllers/academicCoordinatorCtrl");
const isLogin = require("../middlewares/isLogin");
const isAcademicCoordinator = require("../middlewares/isAcademicCoordinator");

const upload = multer({ storage: multer.memoryStorage() });


const academicCoordinatorRouter = express.Router();

// Register Academic Coordinator
academicCoordinatorRouter.post("/register", registerAcademicCoordinatorCtrl);

// login Academic Coordinator
academicCoordinatorRouter.post("/login", loginAcademicCoordinatorCtrl);

//Update academic coordinator profile
academicCoordinatorRouter.put("/profile", isLogin, isAcademicCoordinator, updateAcademicCoordinatorProfileCtrl)

// Get academic Coordinator Profile
academicCoordinatorRouter.get("/profile", isLogin, isAcademicCoordinator, getAcademicCoordinatorProfileCtrl);

// Get University
academicCoordinatorRouter.get("/university", isLogin, isAcademicCoordinator, getUniversityCtrl);

// Register Academic Supervisor
academicCoordinatorRouter.post("/register/academic-supervisor", isLogin, isAcademicCoordinator, upload.single("file"), registerAcademicSupervisorCtrl)

// Register University
academicCoordinatorRouter.post("/register/university", isLogin, isAcademicCoordinator, upload.single("file"), registerUniversityCtrl)

module.exports = academicCoordinatorRouter; 