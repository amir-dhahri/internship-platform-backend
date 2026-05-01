const express = require("express");
const multer = require("multer");
const isLogin = require("../middlewares/isLogin");
const isAcademicSupervisor = require("../middlewares/isAcademicSupervisor");
const { getDepartments, registerStudentCtrl, getStudentsCtrl, fetchStudentProfileCtrl, modifyStudentProfileCtrl, loginStudentCtrl, getStudentProfileCtrl, updateStudentProfileCtrl, deleteStudentCtrl, toggleAssignAcademicYearToStudentCtrl, logoutCtrl, getNotificationsCtrl } = require("../controllers/studentCtrl");

const upload = multer({ storage: multer.memoryStorage() });


const studentRouter = express.Router();

// Get Student Departments
studentRouter.get("/departments", isLogin, isAcademicSupervisor, getDepartments);

// Register Student
studentRouter.post("/", isLogin, isAcademicSupervisor, registerStudentCtrl);

// Get Students
studentRouter.get("/", isLogin, isAcademicSupervisor, getStudentsCtrl);

// Get Student Profile
studentRouter.get("/fetch/profile", isLogin, isAcademicSupervisor, fetchStudentProfileCtrl);

// Update Student Profile
studentRouter.put("/modify/profile", isLogin, isAcademicSupervisor, upload.single("file"), modifyStudentProfileCtrl);

// Login Student
studentRouter.post("/login", loginStudentCtrl);

// Login Student
studentRouter.post("/logout", isLogin, isAcademicSupervisor, logoutCtrl);

// Login Student
studentRouter.get("/notifications", isLogin, isAcademicSupervisor, getNotificationsCtrl);

// Get Student
studentRouter.get("/:id", isLogin, isAcademicSupervisor, getStudentProfileCtrl);

// Update Student Profile
studentRouter.put("/:id/profile", isLogin, isAcademicSupervisor, upload.single("file"), updateStudentProfileCtrl);

// Get Student Profile
studentRouter.get("/:id/profile", isLogin, isAcademicSupervisor, getStudentsCtrl);

// Delete Student 
studentRouter.delete("/:id", isLogin, isAcademicSupervisor, deleteStudentCtrl);

// Assing Student Academic Years
studentRouter.post("/:id/academic-years", isLogin, isAcademicSupervisor, toggleAssignAcademicYearToStudentCtrl);


module.exports = studentRouter;