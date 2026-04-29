const AcademicSupervisor = require("../models/AcademicSupervisor");

const isAcademicSupervisor = async (req, res, next) => {
    const { id } = req.userAuth;
    const academicSupervisorFound = await AcademicSupervisor.findById(id);

    if (academicSupervisorFound?.role === "academic-supervisor") {
        next();
    } else {
        next(new Error("Access Denied, academic supervisor only!"));
    }
}

module.exports = isAcademicSupervisor;