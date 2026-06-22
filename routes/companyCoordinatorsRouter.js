const express = require("express");
const multer = require("multer");
const { registerCompanyCtrl, getCompanyCtrl, registerCompanyCoordinatorCtrl, loginCompanyCoordinatorCtrl, getCompanyCoordinatorProfileCtrl, updateAcademicCoordinatorProfileCtrl, createNotificationCtrl, getNotificationsCtrl, logoutCtrl, updateCompanyCoordinatorProfileCtrl, getDepartmentsCtrl } = require("../controllers/companyCoordinatorCtrl");
const isLogin = require("../middlewares/isLogin");
const isCompanyCoordinator = require("../middlewares/isCompanyCoordinator");

const upload = multer({ storage: multer.memoryStorage() });


const companyCoordinatorRouter = express.Router();

// Register Company Coordinator
companyCoordinatorRouter.post("/register", registerCompanyCoordinatorCtrl);

// login Company Coordinator
companyCoordinatorRouter.post("/login", loginCompanyCoordinatorCtrl);

// Update Company coordinator profile
companyCoordinatorRouter.put("/profile", isLogin, isCompanyCoordinator, upload.single("file"), updateCompanyCoordinatorProfileCtrl)

// Get Company Coordinator Profile
companyCoordinatorRouter.get("/profile", isLogin, isCompanyCoordinator, getCompanyCoordinatorProfileCtrl);

// Get Company
companyCoordinatorRouter.get("/company", isLogin, isCompanyCoordinator, getCompanyCtrl);

// Register Company
companyCoordinatorRouter.post("/register/company", isLogin, isCompanyCoordinator, upload.single("file"), registerCompanyCtrl)

// Get All Notifications
companyCoordinatorRouter.get("/notifications", isLogin, isCompanyCoordinator, getNotificationsCtrl)

// Company Coordinator Log out
companyCoordinatorRouter.post("/logout", isLogin, isCompanyCoordinator, logoutCtrl);

// Get Company Coordinator Departments
companyCoordinatorRouter.get("/departments", isLogin, isCompanyCoordinator, getDepartmentsCtrl);

module.exports = companyCoordinatorRouter;



