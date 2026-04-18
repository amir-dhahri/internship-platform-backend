const jwt = require("jsonwebtoken");

const key = process.env.TOKEN_KEY;

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, key, { expiresIn: "5d" })
}

module.exports = generateToken; 