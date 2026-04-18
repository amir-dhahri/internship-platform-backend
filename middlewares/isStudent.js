const Student = require("../models/Student");

const isStudent = async (req, res, next) => {
    const { id } = req.userAuth;
    const studentFound = await Student.findById(id);

    if (studentFound?.role === "student") {
        next();
    } else {
        next(new Error("Access Denied, student only!"));
    }
}

module.exports = isStudent;