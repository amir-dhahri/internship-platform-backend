const mongoose = require("mongoose")

const { Schema } = mongoose;

const academicLevelSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        departmentId: {
            type: Schema.ObjectId,
            ref: "Department",
            required: true
        }
    },
    {
        timestamps: true,
    }
);

//=====Model=====//

const AcademicLevel = mongoose.model("AcademicLevel", academicLevelSchema);

module.exports = AcademicLevel;