const express = require("express");
const multer = require("multer");
const isLogin = require("../middlewares/isLogin");
const isAcademicCoordinator = require("../middlewares/isAcademicCoordinator");
const isAcademicSupervisor = require("../middlewares/isAcademicSupervisor");
const { registerAcademicSupervisorCtrl, getAcademicSupervisorCtrl, getAcademicSupervisorsCtrl, updateAcademicSupervisorProfileCtrl, deleteAcademicSupervisorCtrl, toggleAssignAcademicYearToSupervisorCtrl, loginAcademicSupervisorCtrl, fetchAcademicSupervisorProfileCtrl, modifyAcademicSupervisorProfileCtrl, getNotificationsCtrl, logoutCtrl, getDepartments, getStudents, sendMessage, getMessages, createInternshipsCtrl, getInternshipCtrl, deleteInternshipCtrl, getInternshipsCtrl, updateInternshipCtrl, getAcademicSupervisorStudentsCtrl } = require("../controllers/academicSupervisorCtrl");

const upload = multer({ storage: multer.memoryStorage() });


const academicSupervisorsRouter = express.Router();

//Get Students 
academicSupervisorsRouter.get("/students", isLogin, isAcademicSupervisor, getAcademicSupervisorStudentsCtrl);
//Update Internship 
academicSupervisorsRouter.put("/internships/update/:id", isLogin, isAcademicSupervisor, upload.single("file"), updateInternshipCtrl)

//Get Internship
academicSupervisorsRouter.get("/internships/get/single/:id", isLogin, isAcademicSupervisor, getInternshipCtrl);

//Delete Internship
academicSupervisorsRouter.delete("/internships/delete/:id", isLogin, isAcademicSupervisor, deleteInternshipCtrl);

//Get Internships
academicSupervisorsRouter.get("/internships/get", isLogin, isAcademicSupervisor, getInternshipsCtrl)

// Add Internship
academicSupervisorsRouter.post("/internships/add", isLogin, isAcademicSupervisor, upload.single("file"), createInternshipsCtrl);

// Send Message
academicSupervisorsRouter.post("/chat/messages/send", isLogin, isAcademicSupervisor, sendMessage);

// Get Messages
academicSupervisorsRouter.get("/chat/messages", isLogin, isAcademicSupervisor, getMessages);

// Get Student
academicSupervisorsRouter.get("/academic-years/:id", isLogin, isAcademicSupervisor, getStudents);

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

