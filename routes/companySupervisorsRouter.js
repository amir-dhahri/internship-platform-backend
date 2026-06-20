const express = require("express");
const multer = require("multer");
const isLogin = require("../middlewares/isLogin");
const isAcademicCoordinator = require("../middlewares/isAcademicCoordinator");
const isAcademicSupervisor = require("../middlewares/isAcademicSupervisor");
const { registerAcademicSupervisorCtrl, getAcademicSupervisorCtrl, getAcademicSupervisorsCtrl, updateAcademicSupervisorProfileCtrl, deleteAcademicSupervisorCtrl, toggleAssignAcademicYearToSupervisorCtrl, loginAcademicSupervisorCtrl, fetchAcademicSupervisorProfileCtrl, modifyAcademicSupervisorProfileCtrl, getNotificationsCtrl, logoutCtrl, getDepartments, getStudents, sendMessage, getMessages, createInternshipsCtrl, getInternshipCtrl, deleteInternshipCtrl, getInternshipsCtrl, updateInternshipCtrl, getAcademicSupervisorStudentsCtrl } = require("../controllers/academicSupervisorCtrl");

const upload = multer({ storage: multer.memoryStorage() });


const companySupervisorRouter = express.Router();

//Get Students 
companySupervisorRouter.get("/students", isLogin, isAcademicSupervisor, getAcademicSupervisorStudentsCtrl);
//Update Internship 
companySupervisorRouter.put("/internships/update/:id", isLogin, isAcademicSupervisor, upload.single("file"), updateInternshipCtrl)

//Get Internship
companySupervisorRouter.get("/internships/get/single/:id", isLogin, isAcademicSupervisor, getInternshipCtrl);

//Delete Internship
companySupervisorRouter.delete("/internships/delete/:id", isLogin, isAcademicSupervisor, deleteInternshipCtrl);

//Get Internships
companySupervisorRouter.get("/internships/get", isLogin, isAcademicSupervisor, getInternshipsCtrl)

// Add Internship
companySupervisorRouter.post("/internships/add", isLogin, isAcademicSupervisor, upload.single("file"), createInternshipsCtrl);

// Send Message
companySupervisorRouter.post("/chat/messages/send", isLogin, isAcademicSupervisor, sendMessage);

// Get Messages
companySupervisorRouter.get("/chat/messages", isLogin, isAcademicSupervisor, getMessages);

// Get Student
companySupervisorRouter.get("/academic-years/:id", isLogin, isAcademicSupervisor, getStudents);

// Get Academic Supervisor Departments
companySupervisorRouter.get("/departments", isLogin, isAcademicSupervisor, getDepartments);

// Register Academic Supervisor
companySupervisorRouter.post("/", isLogin, isAcademicCoordinator, registerAcademicSupervisorCtrl);

// Get Academic Supervisors
companySupervisorRouter.get("/", isLogin, isAcademicCoordinator, getAcademicSupervisorsCtrl);

// Get Academic Supervisor Profile
companySupervisorRouter.get("/fetch/profile", isLogin, isAcademicSupervisor, fetchAcademicSupervisorProfileCtrl);

// Update Academic Supervisor Profile
companySupervisorRouter.put("/modify/profile", isLogin, isAcademicSupervisor, upload.single("file"), modifyAcademicSupervisorProfileCtrl);

// Login Academic Supervisor
companySupervisorRouter.post("/login", loginAcademicSupervisorCtrl);

// Login Academic Supervisor
companySupervisorRouter.post("/logout", isLogin, isAcademicSupervisor, logoutCtrl);

// Login Academic Supervisor
companySupervisorRouter.get("/notifications", isLogin, isAcademicSupervisor, getNotificationsCtrl);

// Get Academic Supervisor
companySupervisorRouter.get("/:id", isLogin, isAcademicCoordinator, getAcademicSupervisorCtrl);

// Update Academic Supervisor Profile
companySupervisorRouter.put("/:id/profile", isLogin, isAcademicCoordinator, upload.single("file"), updateAcademicSupervisorProfileCtrl);

// Get Academic Supervisor Profile
companySupervisorRouter.get("/:id/profile", isLogin, isAcademicCoordinator, getAcademicSupervisorCtrl);

// Delete Academic Supervisor 
companySupervisorRouter.delete("/:id", isLogin, isAcademicCoordinator, deleteAcademicSupervisorCtrl);

// Assing Academic Supervisor Academic Years
companySupervisorRouter.post("/:id/academic-years", isLogin, isAcademicCoordinator, toggleAssignAcademicYearToSupervisorCtrl);



module.exports = companySupervisorRouter;

