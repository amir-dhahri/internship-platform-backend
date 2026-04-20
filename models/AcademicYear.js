const mongoose = require("mongoose")

const { Schema } = mongoose;

const academicYearSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        academicLevelId: {
            type: Schema.Types.ObjectId,
            ref: "AcademicLevel",
            required: true
        }
    },
    {
        timestamps: true,
    }
);

//=====Model=====//

const AcademicYear = mongoose.model("AcademicYear", academicYearSchema);

module.exports = AcademicYear;