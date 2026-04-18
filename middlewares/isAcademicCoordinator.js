const AcademicCoordinator = require("../models/AcademicCoordinator");

const isAcademicCoordinator = async (req, res, next) => {
    const { id } = req.userAuth;
    const adminFound = await AcademicCoordinator.findById(id);

    if (adminFound?.role === "academic-coordinator") {
        next();
    } else {
        next(new Error("Access Denied, academic coordinator only!"));
    }
}

module.exports = isAcademicCoordinator;