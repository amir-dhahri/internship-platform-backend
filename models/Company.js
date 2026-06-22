const mongoose = require("mongoose");
const { Schema } = mongoose;

const companySchema = new Schema(
{
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    companyCoordinator: {
        type: Schema.Types.ObjectId,
        ref: "CompanyCoordinator",
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

const Company = mongoose.model("Company", companySchema);

module.exports = Company;