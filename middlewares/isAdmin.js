const Admin = require("../models/Admin");

const isAdmin = async (req, res, next) => {
    const { id } = req.userAuth;
    const adminFound = await Admin.findById(id);

    if (adminFound?.role === "admin") {
        next();
    } else {
        next(new Error("Access Denied, admin only!"));
    }
}

module.exports = isAdmin;