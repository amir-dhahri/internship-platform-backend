const mongoose = require("mongoose")

const { Schema } = mongoose;

const internshipSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        image: {
            type: String,
            required: true
        },
        duration: {
            type: String,
            required: true,
        },
        startDate: {
            type: String,
            required: true,
        },
        endDate: {
            type: String,
            required: true,
        },
        location: {
            type: String
        },
        workMode: {
            type: String,
            enum: ["onsite", "remote", "hybrid", "freelance", "part-time-onsite"],
            default: "onsite"
        },
        student: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: false
        },
        companySupervisor: {
            type: Schema.Types.ObjectId,
            ref: "CompanySupervisor",
            required: false
        },
        poste: {
            type: String
        },
        requirements: [{
            type: String,
            enum: ["diploma", "experience", "internship_experience", "teamwork", "autonomy", "communication", "technical_skills", "languages", "problem_solving", "portfolio"],
        }],
        status: {
            type: String,
            enum: ["pending", "approved", "ongoing", "completed", "rejected"],
            default: "pending",
            required: true,
        },
        type: {
            type: String,
            enum: ["cdi", "cdd", "stage", "alternance", "freelance", "saisonnier", "temps-partiel"],
            default: "cdi",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

//=====Model=====//

const Internship = mongoose.model("Internship", internshipSchema);

module.exports = Internship;