const mongoose = require("mongoose")

const { Schema } = mongoose;

const academicCoordinatorSchema = new Schema(
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
        role: {
            type: String,
            default: "academic-coordinator"
        },
    },
    {
        timestamps: true,
    }
);

//=====Model=====//

const AcademicCoordinator = mongoose.model("AcademicCoordinator", academicCoordinatorSchema);

module.exports = AcademicCoordinator;