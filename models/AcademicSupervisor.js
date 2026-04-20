const mongoose = require("mongoose")

const { Schema } = mongoose;

const academicSupervisorSchema = new Schema(
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
            type: String
        },
        photo: {
            type: String
        },
        address: {
            type: String
        },
        city: {
            type: String
        },
        country: {
            type: String,
        },
        postalCode: {
            type: Number,
        },
        facebook: {
            type: String,
        },
        x: {
            type: String
        },
        linkedin: {
            type: String,
        },
        instagram: {
            type: String,
        },
        academicYear: [
            {
                type: 
            }
        ],
        role: {
            type: String,
            default: "academic-supervisor"
        }
    },
    {
        timestamps: true,
    }
);

//=====Model=====//

const AcademicSupervisor = mongoose.model("AcademicSupervisor", academicSupervisorSchema);

module.exports = AcademicSupervisor;