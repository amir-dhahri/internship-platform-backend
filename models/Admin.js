const mongoose = require("mongoose")

const { Schema } = mongoose;

const adminSchema = new Schema(
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
        role: {
            type: String,
            default: "admin",
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
    },
    {
        timestamps: true,
    }
);

//=====Model=====//

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
