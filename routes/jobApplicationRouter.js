const express = require("express");
const multer = require("multer");
const isLogin = require("../middlewares/isLogin");
const isStudent = require("../middlewares/isStudent");
const { applyToJob } = require("../controllers/jobApplicationCtrl");
const upload = multer({ storage: multer.memoryStorage() });


const jobApplicationRouter = express.Router();

// Apply to an job
jobApplicationRouter.post("/:id", isLogin, isStudent,  upload.single("cv"), applyToJob);


module.exports = jobApplicationRouter; 