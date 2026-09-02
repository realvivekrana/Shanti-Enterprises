// ============================================================
// SHANTI ENTERPRISES
// Password Utility
// Phase 1 - Foundation
// ============================================================

const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 12;

const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

const comparePassword = async (
  password,
  hashedPassword
) => {
  return bcrypt.compare(
    password,
    hashedPassword
  );
};

module.exports = {
  hashPassword,
  comparePassword,
};