const mongoose = require("mongoose")

const { Schema } = mongoose;

const companyCoordinatorSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        middlename: {
            type: String,
            required: false,
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
        role: {
            type: String,
            default: "student",
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
            default: "Tunisia"
        },
        role: {
            type: String,
            default: "company-coordinator",
        },
    },
    {
        timestamps: true,
    }
);

//=====Model=====//

const CompanyCoordinator = mongoose.model("CompanyCoordinator", companyCoordinatorSchema);

module.exports = CompanyCoordinator;