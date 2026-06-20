const mongoose = require("mongoose");

const { Schema } = mongoose;

const studentSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            default: "#"
        },
        photo: {
            type: String,
            default: "#"
        },
        bio: {
            type: String,
            default: "#"
        },
        address: {
            type: String,
            default: "#"
        },
        city: {
            type: String,
            default: "#"
        },
        country: {
            type: String,
            default: "#"
        },
        postalCode: {
            type: String,
            default: "#"
        },
        facebook: {
            type: String,
            default: "#"
        },
        x: {
            type: String,
            default: "#"
        },
        linkedin: {
            type: String,
            default: "#"
        },
        instagram: {
            type: String,
            default: "#"
        },
        academicYearId: {
            type: String,
            default: "#"
        },
        academicSupervisorId: {
            type: Schema.Types.ObjectId,
            ref: "AcademicSupervisor",
            required: true
        },
        role: {
            type: String,
            default: "student"
        },
    },
    {
        timestamps: true,
    }
);

//=====Model=====//

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;