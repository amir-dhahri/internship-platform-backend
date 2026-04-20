const cookie = require("cookie");
const verifyToken = require("../utils/verifyToken");


const socketIoAuth = (socket, next) => {
    try {
        const rawCookie = socket.handshake.headers.cookie;

        if (!rawCookie) {
            return next(new Error("No cookies found"));
        }

        // parse cookies
        const parsedCookies = cookie.parse(rawCookie);

        const token = parsedCookies.token;

        if (!token) {
            return next(new Error("No token"));
        }

        const decoded = verifyToken(token);

        if (!decoded) {
            return next(new Error("Invalid token"));
        }

        // attach user to socket
        socket.user = { id: decoded.id };

        next();
    } catch (err) {
        next(new Error("Authentication error"));
    }
};

module.exports = socketIoAuth;