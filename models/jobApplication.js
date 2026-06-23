const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },

        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        cv: {
            url: String,
            public_id: String,
        },
        companySupervisor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CompanySupervisor",
            default: null,
        },
        status: {
            type: String,
            enum: ["en attente", "approuvé", "en cours", "terminé", "rejeté"],
            default: "en attente",
            required: true,
        },
    },
    { timestamps: true }
);

const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);

module.exports = JobApplication;
