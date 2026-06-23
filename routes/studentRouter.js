const express = require("express");
const multer = require("multer");
const isLogin = require("../middlewares/isLogin");
const isAcademicSupervisor = require("../middlewares/isAcademicSupervisor");
const {getJobs, getJobApplications, getInternship, getDepartments, getAcademicYearStudentCtrl, registerStudentCtrl, getStudentsCtrl, fetchStudentProfileCtrl, modifyStudentProfileCtrl, loginStudentCtrl, getStudentProfileCtrl, updateStudentProfileCtrl, deleteStudentCtrl, toggleAssignAcademicYearToStudentCtrl, logoutCtrl, getNotificationsCtrl, getInternships, getInternshipApplications, getJob, getTrainings, getTraining } = require("../controllers/studentCtrl");
const isStudent = require("../middlewares/isStudent");

const upload = multer({ storage: multer.memoryStorage() });


const studentRouter = express.Router();



// Get Trainings 
studentRouter.get("/trainings", isLogin, isStudent, getTrainings);

// Get Training 
studentRouter.get("/trainings/:id", isLogin, isStudent, getTraining);

// Get Jobs 
studentRouter.get("/jobs", isLogin, isStudent, getJobs);

// Get Job 
studentRouter.get("/jobs/:id", isLogin, isStudent, getJob);

//Get job Applications 
studentRouter.get("/job-applications", isLogin, isStudent, getJobApplications);

//Get training Applications 
studentRouter.get("/training-applications", isLogin, isStudent, getJobApplications);

//Get internship Applications 
studentRouter.get("/internship-applications", isLogin, isStudent, getInternshipApplications);

// Get Internships 
studentRouter.get("/internships", isLogin, isStudent, getInternships);

// Get Internship 
studentRouter.get("/internships/:id", isLogin, isStudent, getInternship);

// Get Student Departments
studentRouter.get("/departments", isLogin, isAcademicSupervisor, getDepartments);

// Register Student
studentRouter.post("/", isLogin, isAcademicSupervisor, registerStudentCtrl);

// Get Students
studentRouter.get("/", isLogin, isAcademicSupervisor, getStudentsCtrl);

// Get Student Profile
studentRouter.get("/fetch/profile", isLogin, isStudent, fetchStudentProfileCtrl);

// Update Student Profile
studentRouter.put("/modify/profile", isLogin, isStudent, upload.single("file"), modifyStudentProfileCtrl);

// Login Student
studentRouter.post("/login", loginStudentCtrl);

// logout Student
studentRouter.post("/logout", isLogin, isStudent, logoutCtrl);

// Login Student
studentRouter.get("/notifications", isLogin, isStudent, getNotificationsCtrl);

// Get Student Profile
studentRouter.get("/:id/profile", isLogin, isAcademicSupervisor, getStudentProfileCtrl);

// Assing Student Academic Years
studentRouter.post("/:id/academic-years", isLogin, isAcademicSupervisor, toggleAssignAcademicYearToStudentCtrl);

// Update Student Profile
studentRouter.put("/:id/profile", isLogin, isAcademicSupervisor, upload.single("file"), updateStudentProfileCtrl);

// Get Student
studentRouter.get("/:id", isLogin, isAcademicSupervisor, getStudentProfileCtrl);

// Delete Student 
studentRouter.delete("/:id", isLogin, isAcademicSupervisor, deleteStudentCtrl);

// Get Academic Year students
studentRouter.get("/academic-years/:id", isLogin, isAcademicSupervisor, getAcademicYearStudentCtrl);


module.exports = studentRouter;