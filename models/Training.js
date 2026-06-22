const mongoose = require("mongoose")

const { Schema } = mongoose;

const trainingSchema = new Schema(
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
            enum: ["onsite", "remote", "hybrid"],
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
        sujet: {
            type: String
        },
        requirements: [{
            type: String,
            enum: [
                "student",
                "basic_knowledge",
                "motivation",
                "laptop",
                "internet",
                "cv",
                "project",
                "availability",
                "teamwork",
                "communication",
            ]
        }],
        status: {
            type: String,
            enum: ["pending", "approved", "ongoing", "completed", "rejected"],
            default: "pending",
            required: true,
        },
        type: {
            type: String,
            enum: ["bootcamp", "training", "workshop", "certification", "online"],
            default: "bootcamp",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

//=====Model=====//

const Training = mongoose.model("Training", trainingSchema);

module.exports = Training;