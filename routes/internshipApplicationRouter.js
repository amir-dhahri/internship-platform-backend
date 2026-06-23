const express = require("express");
const multer = require("multer");
const isLogin = require("../middlewares/isLogin");
const isStudent = require("../middlewares/isStudent");
const { applyToInternship } = require("../controllers/internshipApplicationCtrl");
const upload = multer({ storage: multer.memoryStorage() });


const internshipApplicationRouter = express.Router();

// Apply to an internship
internshipApplicationRouter.post("/:id", isLogin, isStudent,  upload.single("cv"), applyToInternship);


module.exports = internshipApplicationRouter; 