const verifyToken = require("../utils/verifyToken");

const isLogin = async (req, res, next) => {
    try {
        // 1. Try Bearer token (React Native / API clients)
        const authHeader = req.headers.authorization;
        const bearerToken =
            authHeader && authHeader.startsWith("Bearer ")
                ? authHeader.split(" ")[1]
                : null;

        // 2. Fallback to cookie (Web)
        const cookieToken = req.cookies?.token;

        const token = bearerToken || cookieToken;

        if (!token) {
            return next(new Error("No token provided"));
        }

        const verifiedToken = verifyToken(token);

        if (!verifiedToken) {
            return next(new Error("Token expired/invalid"));
        }

        req.userAuth = { id: verifiedToken.id , role: verifiedToken.role};

        next();
    } catch (error) {
        next(new Error("Authentication failed"));
    }
};

module.exports = isLogin;