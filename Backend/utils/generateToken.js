// ============================================================
// SHANTI ENTERPRISES
// JWT Token Utility
// Backend - Authentication
// ============================================================

const jwt = require("jsonwebtoken");

// ============================================================
// GENERATE JWT TOKEN
// ============================================================

const generateToken = (userId) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

// ============================================================
// EXPORT
// ============================================================

module.exports = generateToken;