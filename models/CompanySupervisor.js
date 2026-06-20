const mongoose = require("mongoose")

const { Schema } = mongoose;

const companySupervisorSchema = new Schema(
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
        departments: [
            {
                type: Schema.Types.ObjectId,
                ref: "Department",
                required: false
            }
        ],
        role: {
            type: String,
            default: "company-supervisor"
        }
    },
    {
        timestamps: true,
    }
);

//=====Model=====//

const CompanySupervisor = mongoose.model("CompanySupervisor", companySupervisorSchema);

module.exports = CompanySupervisor;