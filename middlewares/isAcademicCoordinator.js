const AcademicCoordinator = require("../models/AcademicCoordinator");

const isAcademicCoordinator = async (req, res, next) => {
    console.log(req.url);
    
    const { id } = req.userAuth;
    const academicCoordinatorFound = await AcademicCoordinator.findById(id);

    if (academicCoordinatorFound?.role === "academic-coordinator") {
        next();
    } else {
        next(new Error("Access Denied, academic coordinator only!"));
    }
}

module.exports = isAcademicCoordinator;