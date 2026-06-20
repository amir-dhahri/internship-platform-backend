const express = require("express");
const multer = require("multer");
const { registerUniversityCtrl, getUniversityCtrl, registerAcademicCoordinatorCtrl, loginAcademicCoordinatorCtrl, getAcademicCoordinatorProfileCtrl, updateAcademicCoordinatorProfileCtrl, createNotificationCtrl, getNotificationsCtrl, logoutCtrl } = require("../controllers/academicCoordinatorCtrl");
const isLogin = require("../middlewares/isLogin");
const isCompanyCoordinator = require("../middlewares/isCompanyCoordinator");

const upload = multer({ storage: multer.memoryStorage() });


const companyCoordinatorRouter = express.Router();

// Register Company Coordinator
companyCoordinatorRouter.post("/register", registerAcademicCoordinatorCtrl);

// login Company Coordinator
companyCoordinatorRouter.post("/login", loginAcademicCoordinatorCtrl);

//Update Company coordinator profile
companyCoordinatorRouter.put("/profile", isLogin, isCompanyCoordinator, upload.single("file"), updateAcademicCoordinatorProfileCtrl)

// Get Company Coordinator Profile
companyCoordinatorRouter.get("/profile", isLogin, isCompanyCoordinator, getAcademicCoordinatorProfileCtrl);

// Get Company
companyCoordinatorRouter.get("/company", isLogin, isCompanyCoordinator, getUniversityCtrl);

// Register Company
companyCoordinatorRouter.post("/register/company", isLogin, isCompanyCoordinator, upload.single("file"), registerUniversityCtrl)

// Get All Notifications
companyCoordinatorRouter.get("/notifications", isLogin, isCompanyCoordinator, getNotificationsCtrl)

// Academic Coordinator Log out
companyCoordinatorRouter.post("/logout", isLogin, isCompanyCoordinator, logoutCtrl);

module.exports = companyCoordinatorRouter; 



