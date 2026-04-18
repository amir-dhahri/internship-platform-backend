const jwt = require("jsonwebtoken");

const key = process.env.TOKEN_KEY;

const verifyToken = (token) => {
    return jwt.verify(token, key, (err, decoded) => {
        if (err) {
            return false;
        }
        return decoded
    });
}

module.exports = verifyToken;