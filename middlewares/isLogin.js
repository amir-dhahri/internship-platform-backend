const verifyToken = require("../utils/verifyToken");

const isLogin = async (req, res, next) => {
    // const token = req.headers?.authorization?.split(" ")[1];
    const token = req.cookies.token;
    const verifiedToken = verifyToken(token);
    if (verifiedToken) {
        const id = verifiedToken.id;
        req.userAuth = { id };
        next();
    } else {
        const err = new Error("Token expired/invalid");
        next(err);
    }
}

module.exports = isLogin;