const express = require("express");
const isLogin = require("../middlewares/isLogin");
const isStudent = require("../middlewares/isStudent");
const { applyToInternship } = require("../controllers/internshipApplicationCtrl");


const internshipApplicationRouter = express.Router();

// Apply to an internship
internshipApplicationRouter.post("/:id", isLogin, isStudent, applyToInternship);


module.exports = internshipApplicationRouter; 