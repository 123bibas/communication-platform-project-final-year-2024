const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1d" });
};
// Hash Token
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token.toString()).digest("hex");
};
module.exports = {
  generateToken,
  hashToken,
};
