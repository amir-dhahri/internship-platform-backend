const CompanySupervisor = require("../models/CompanySupervisor");

const isCompanySupervisor = async (req, res, next) => {
    const { id } = req.userAuth;
    const companySupervisorFound = await CompanySupervisor.findById(id);

    if (companySupervisorFound?.role === "company-supervisor") {
        next();
    } else {
        next(new Error("Access Denied, company supervisor only!"));
    }
}

module.exports = isCompanySupervisor;