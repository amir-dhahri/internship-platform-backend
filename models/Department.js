
const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Department name is required'],
            trim: true,
            unique: true,
            maxlength: [50, 'Department name cannot exceed 50 characters'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [200, 'Description cannot exceed 200 characters'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        university: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "University"
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company"
        }
    },
    {
        timestamps: true,
    }
);


const Department = mongoose.model('Department', departmentSchema);
module.exports = Department;