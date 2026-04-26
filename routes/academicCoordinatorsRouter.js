const express = require("express");
const multer = require("multer");
const { registerUniversityCtrl, getUniversityCtrl, registerAcademicCoordinatorCtrl, loginAcademicCoordinatorCtrl, getAcademicCoordinatorProfileCtrl, updateAcademicCoordinatorProfileCtrl, createNotificationCtrl, getNotificationsCtrl, logoutCtrl } = require("../controllers/academicCoordinatorCtrl");
const isLogin = require("../middlewares/isLogin");
const isAcademicCoordinator = require("../middlewares/isAcademicCoordinator");

const upload = multer({ storage: multer.memoryStorage() });


const academicCoordinatorRouter = express.Router();

// Register Academic Coordinator
academicCoordinatorRouter.post("/register", registerAcademicCoordinatorCtrl);

// login Academic Coordinator
academicCoordinatorRouter.post("/login", loginAcademicCoordinatorCtrl);

//Update academic coordinator profile
academicCoordinatorRouter.put("/profile", isLogin, isAcademicCoordinator, upload.single("file"), updateAcademicCoordinatorProfileCtrl)

// Get academic Coordinator Profile
academicCoordinatorRouter.get("/profile", isLogin, isAcademicCoordinator, getAcademicCoordinatorProfileCtrl);

// Get University
academicCoordinatorRouter.get("/university", isLogin, isAcademicCoordinator, getUniversityCtrl);

// Register University
academicCoordinatorRouter.post("/register/university", isLogin, isAcademicCoordinator, upload.single("file"), registerUniversityCtrl)

// Get All Notifications
academicCoordinatorRouter.get("/notifications", isLogin, isAcademicCoordinator, getNotificationsCtrl)

// Academic Coordinator Log out
academicCoordinatorRouter.post("/logout", isLogin, isAcademicCoordinator, logoutCtrl);

module.exports = academicCoordinatorRouter; 



