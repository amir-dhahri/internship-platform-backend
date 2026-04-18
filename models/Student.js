const mongoose = require("mongoose");

const { Schema } = mongoose;

const studentSchema = new Schema(
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

        university: {
            type: Schema.Types.ObjectId,
            ref: "University",
            required: false,
        },

        department: {
            type: String
        },

        degree: {
            type: String,
            enum: ["bachelor", "master", "engineering", "phd"],
            default: "bachelor"
        },

        year: {
            type: Number
        },

        skills: [{
            type: String
        }],

        cv: {
            type: String
        },

        linkedin: {
            type: String
        },

        github: {
            type: String
        },


    },
    {
        timestamps: true
    }
);

//=====Model=====//

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;