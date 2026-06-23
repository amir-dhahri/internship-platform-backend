const mongoose = require("mongoose");

const trainingApplicationSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },

        training: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Training",
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

const TrainingApplication = mongoose.model("TrainingApplication", trainingApplicationSchema);

module.exports = TrainingApplication;
