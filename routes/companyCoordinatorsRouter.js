const express = require("express");
const multer = require("multer");
const { registerUniversityCtrl, getUniversityCtrl, registerAcademicCoordinatorCtrl, loginAcademicCoordinatorCtrl, getAcademicCoordinatorProfileCtrl, updateAcademicCoordinatorProfileCtrl, createNotificationCtrl, getNotificationsCtrl, logoutCtrl } = require("../controllers/academicCoordinatorCtrl");
const isLogin = require("../middlewares/isLogin");
const isAcademicCoordinator = require("../middlewares/isAcademicCoordinator");

const upload = multer({ storage: multer.memoryStorage() });


const companyCoordinatorRouter = express.Router();

// Register Academic Coordinator
companyCoordinatorRouter.post("/register", registerAcademicCoordinatorCtrl);

// login Academic Coordinator
companyCoordinatorRouter.post("/login", loginAcademicCoordinatorCtrl);

//Update academic coordinator profile
companyCoordinatorRouter.put("/profile", isLogin, isAcademicCoordinator, upload.single("file"), updateAcademicCoordinatorProfileCtrl)

// Get academic Coordinator Profile
companyCoordinatorRouter.get("/profile", isLogin, isAcademicCoordinator, getAcademicCoordinatorProfileCtrl);

// Get University
companyCoordinatorRouter.get("/university", isLogin, isAcademicCoordinator, getUniversityCtrl);

// Register University
companyCoordinatorRouter.post("/register/university", isLogin, isAcademicCoordinator, upload.single("file"), registerUniversityCtrl)

// Get All Notifications
companyCoordinatorRouter.get("/notifications", isLogin, isAcademicCoordinator, getNotificationsCtrl)

// Academic Coordinator Log out
companyCoordinatorRouter.post("/logout", isLogin, isAcademicCoordinator, logoutCtrl);

module.exports = companyCoordinatorRouter; 



