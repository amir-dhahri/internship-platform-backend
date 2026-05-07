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
        duration: {
            type: Number,
            required: true,
        },
        startDate: {
            type: Date,
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
        endDate: {
            type: Date,
            required: true,
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
        academicSupervisor: {
            type: Schema.Types.ObjectId,
            ref: "AcademicSupervisor",
            required: false
        },
        topic: {
            type: String
        },
        requirements: [{
            type: String
        }],
        status: {
            type: String,
            enum: ["pending", "approved", "ongoing", "completed", "rejected"],
            default: "pending",
            required: true,
        },
        type: {
            type: String,
            enum: ["summer", "end-of-study", "part-time"],
            default: "end-of-study",
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