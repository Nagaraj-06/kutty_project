const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");

function generateToken(payload, expiresIn = "1d") {
  return jwt.sign(payload, jwtSecret, { expiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, jwtSecret);
}

module.exports = { generateToken, verifyToken };
