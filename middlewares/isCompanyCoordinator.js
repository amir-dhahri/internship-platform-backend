const CompanyCoordinator = require("../models/CompanyCoordinator");

const isCompanyCoordinator = async (req, res, next) => {
    const { id } = req.userAuth;
    const companyCoordinatorFound = await CompanyCoordinator.findById(id);

    if (companyCoordinatorFound?.role === "company-coordinator") {
        next();
    } else {
        next(new Error("Access Denied, company coordinator only!"));
    }
}

module.exports = isCompanyCoordinator;