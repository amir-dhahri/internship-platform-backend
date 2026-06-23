const express = require("express");
const multer = require("multer");
const isLogin = require("../middlewares/isLogin");
const isStudent = require("../middlewares/isStudent");
const { applyToTraining } = require("../controllers/trainingApplicationCtrl");

const upload = multer({ storage: multer.memoryStorage() });


const trainingApplicationRouter = express.Router();

// Apply to an job
trainingApplicationRouter.post("/:id", isLogin, isStudent,  upload.single("cv"), applyToTraining);


module.exports = trainingApplicationRouter; 