const express = require("express");
const { registerAdminCtrl,
    loginAdminCtrl,
    getAdminsCtrl,
    updateAdminCtrl,
    deleteAdminCtrl,
    adminSuspendTeacherCtrl,
    adminUnsuspendTeacherCtrl,
    adminWithdrawTeacherCtrl,
    adminUnwithdrawTeacherCtrl,
    adminPublishExamCtrl,
    adminUnpublishExamCtrl,
    getAdminProfileCtrl } = require("../controllers/adminCtrl");
const isLogin = require("../middlewares/isLogin");
const isAdmin = require("../middlewares/isAdmin");

const adminRouter = express.Router();

// Register
adminRouter.post("/register", registerAdminCtrl)

// login
adminRouter.post("/login", loginAdminCtrl)

// Get all 
adminRouter.get("/", isLogin, isAdmin, getAdminsCtrl)

// Get single 
adminRouter.get("/profile", isLogin, isAdmin, getAdminProfileCtrl)

// Update 
adminRouter.put("/", isLogin, isAdmin, updateAdminCtrl)

// Delete 
adminRouter.delete("/:id", deleteAdminCtrl)

// Suspend 
adminRouter.put("/suspend/teacher/:id", adminSuspendTeacherCtrl)

// Unsuspend 
adminRouter.put("/unsuspend/teacher/:id", adminUnsuspendTeacherCtrl)

// Withdraw
adminRouter.put("/withdraw/teacher/:id", adminWithdrawTeacherCtrl)

// unwithdraw 
adminRouter.put("/unwithdraw/teacher/:id", adminUnwithdrawTeacherCtrl)

// publish 
adminRouter.put("/publish/exam/:id", adminPublishExamCtrl)

// Unpublish
adminRouter.put("/unpublish/exam/:id", adminUnpublishExamCtrl)


module.exports = adminRouter; 