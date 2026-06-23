const mongoose = require("mongoose");

const internshipApplicationSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },

        internship: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Internship",
            required: true,
        },
        cv: {
            url: String,
            public_id: String,
        },

        academicSupervisor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AcademicSupervisor",
            default: null,
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

module.exports = mongoose.model("InternshipApplication", internshipApplicationSchema);