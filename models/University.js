const mongoose = require("mongoose");
const { Schema } = mongoose;

const universitySchema = new Schema(
{
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    academicCoordinator: {
        type: Schema.Types.ObjectId,
        ref: "AcademicCoordinator",
        required: true
    },
    description: {
        type: String
    },
    website: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
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
    logo: {
        type: String 
    },
    postalCode: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
}
);

//=====Model=====//

const University = mongoose.model("University", universitySchema);

module.exports = University;