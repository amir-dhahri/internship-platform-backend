const mongoose = require("mongoose")

const { Schema } = mongoose;

const companySupervisorSchema = new Schema(
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
            default: "company-supervisor"
        },
    },
    {
        timestamps: true,
    }
);

//=====Model=====//

const CompanySupervisor = mongoose.model("CompanySupervisor", companySupervisorSchema);

module.exports = CompanySupervisor;