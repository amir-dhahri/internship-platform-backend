const express = require("express");
const { registerStudentCtrl,
    loginStudentCtrl,
    getStudentsCtrl,
    updateStudentCtrl,
    deleteStudentCtrl,
    studentSuspendTeacherCtrl,
    studentUnsuspendTeacherCtrl,
    studentWithdrawTeacherCtrl,
    studentUnwithdrawTeacherCtrl,
    studentPublishExamCtrl,
    studentUnpublishExamCtrl,
    getStudentProfileCtrl } = require("../controllers/studentCtrl");
const isLogin = require("../middlewares/isLogin");
const isStudent = require("../middlewares/isStudent");

const studentRouter = express.Router();

// Register
studentRouter.post("/register", registerStudentCtrl)

// login
studentRouter.post("/login", loginStudentCtrl)

// Get all 
studentRouter.get("/", isLogin, isStudent, getStudentsCtrl)

// Get single 
studentRouter.get("/profile", isLogin, isStudent, getStudentProfileCtrl)

// Update 
studentRouter.put("/", isLogin, isStudent, updateStudentCtrl)

// Delete 
studentRouter.delete("/:id", deleteStudentCtrl)

// Suspend 
studentRouter.put("/suspend/teacher/:id", studentSuspendTeacherCtrl)

// Unsuspend 
studentRouter.put("/unsuspend/teacher/:id", studentUnsuspendTeacherCtrl)

// Withdraw
studentRouter.put("/withdraw/teacher/:id", studentWithdrawTeacherCtrl)

// unwithdraw 
studentRouter.put("/unwithdraw/teacher/:id", studentUnwithdrawTeacherCtrl)

// publish 
studentRouter.put("/publish/exam/:id", studentPublishExamCtrl)

// Unpublish
studentRouter.put("/unpublish/exam/:id", studentUnpublishExamCtrl)


module.exports = studentRouter; 