const express = require("express");
const multer = require("multer");
const isLogin = require("../middlewares/isLogin");
const isCompanySupervisor = require("../middlewares/isCompanySupervisor");
const { updateInternshipCtrl, getInternshipCtrl, deleteInternshipCtrl, createInternshipsCtrl, sendMessage, getMessages, getDepartments, getCompanySupervisorsCtrl, fetchCompanySupervisorProfileCtrl, modifyCompanySupervisorProfileCtrl, loginCompanySupervisorCtrl, getCompanySupervisorCtrl, updateCompanySupervisorProfileCtrl, deleteCompanySupervisorCtrl, toggleAssignDepartmentsToSupervisorCtrl, registerCompanySupervisorCtrl, getInternshipsCtrl } = require("../controllers/companySupervisorCtrl");
const isCompanyCoordinator = require("../middlewares/isCompanyCoordinator");
const { logoutCtrl, getNotificationsCtrl } = require("../controllers/companyCoordinatorCtrl");

const upload = multer({ storage: multer.memoryStorage() });


const companySupervisorRouter = express.Router();


//Update Internship 
companySupervisorRouter.put("/internships/update/:id", isLogin, isCompanySupervisor, upload.single("file"), updateInternshipCtrl)

//Get Internship
companySupervisorRouter.get("/internships/get/single/:id", isLogin, isCompanySupervisor, getInternshipsCtrl);

//Delete Internship
companySupervisorRouter.delete("/internships/delete/:id", isLogin, isCompanySupervisor, deleteInternshipCtrl);

//Get Internships
companySupervisorRouter.get("/internships/get", isLogin, isCompanySupervisor, getInternshipsCtrl)

// Add Internship
companySupervisorRouter.post("/internships/add", isLogin, isCompanySupervisor, upload.single("file"), createInternshipsCtrl);

// Send Message
companySupervisorRouter.post("/chat/messages/send", isLogin, isCompanySupervisor, sendMessage);

// Get Messages
companySupervisorRouter.get("/chat/messages", isLogin, isCompanySupervisor, getMessages);

// Get Company Supervisor Departments
companySupervisorRouter.get("/departments", isLogin, isCompanySupervisor, getDepartments);

// Register Company Supervisor
companySupervisorRouter.post("/", isLogin, isCompanyCoordinator, registerCompanySupervisorCtrl);

// Get Company Supervisors
companySupervisorRouter.get("/", isLogin, isCompanyCoordinator, getCompanySupervisorsCtrl);

// Get Company Supervisor Profile
companySupervisorRouter.get("/fetch/profile", isLogin, isCompanySupervisor, fetchCompanySupervisorProfileCtrl);

// Update Company Supervisor Profile
companySupervisorRouter.put("/modify/profile", isLogin, isCompanySupervisor, upload.single("file"), modifyCompanySupervisorProfileCtrl);

// Login Company Supervisor
companySupervisorRouter.post("/login", loginCompanySupervisorCtrl);

// Logout Company Supervisor
companySupervisorRouter.post("/logout", isLogin, isCompanySupervisor, logoutCtrl);

// Fech Company Supervisor Notificaiotns
companySupervisorRouter.get("/notifications", isLogin, isCompanySupervisor, getNotificationsCtrl);

// Get Company Supervisor
companySupervisorRouter.get("/:id", isLogin, isCompanyCoordinator, getCompanySupervisorCtrl);

// Update Company Supervisor Profile
companySupervisorRouter.put("/:id/profile", isLogin, isCompanyCoordinator, upload.single("file"), updateCompanySupervisorProfileCtrl);

// Get Company Supervisor Profile
companySupervisorRouter.get("/:id/profile", isLogin, isCompanyCoordinator, getCompanySupervisorCtrl);

// Delete Company Supervisor 
companySupervisorRouter.delete("/:id", isLogin, isCompanyCoordinator, deleteCompanySupervisorCtrl);

// Assing Company Supervisor Departments
companySupervisorRouter.post("/:id/departments", isLogin, isCompanyCoordinator, toggleAssignDepartmentsToSupervisorCtrl);



module.exports = companySupervisorRouter;

