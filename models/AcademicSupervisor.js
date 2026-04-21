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
        bio: {
            type: String,
            default: "#"
        },
        phone: {
            type: String,
            default: "#"
        },
        photo: {
            type: String
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
            type: Number,
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
        academicYears: [
            {
                type: Schema.Types.ObjectId,
                ref: "AcademicYear",
                required: false
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