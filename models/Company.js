const mongoose = require("mongoose");

const { Schema } = mongoose;

const companySchema = new Schema(
{
    name: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String
    },

    industry: {
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
        default: "Tunisia"
    },

    logo: {
        type: String 
    },

    size: {
        type: String,
        enum: ["startup", "small", "medium", "large"]
    },

    foundedYear: {
        type: Number
    },

    technologies: [{
        type: String
    }],

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

const Company = mongoose.model("Company", companySchema);

module.exports = Company;