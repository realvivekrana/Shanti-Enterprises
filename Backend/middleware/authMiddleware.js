// ============================================================
// SHANTI ENTERPRISES
// Authentication Middleware
// Phase 1 - Foundation
// ============================================================

const jwt = require("jsonwebtoken");

const User = require("../models/User");

// ============================================================
// PROTECT ROUTES
// ============================================================

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      const error = new Error(
        "Authentication required"
      );

      error.statusCode = 401;

      return next(error);
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.userId);

    if (!user) {
      const error = new Error(
        "User account not found"
      );

      error.statusCode = 401;

      return next(error);
    }

    if (!user.isActive) {
      const error = new Error(
        "Your account has been deactivated"
      );

      error.statusCode = 403;

      return next(error);
    }

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      error.statusCode = 401;
      error.message = "Invalid authentication token";
    }

    if (error.name === "TokenExpiredError") {
      error.statusCode = 401;
      error.message = "Authentication token has expired";
    }

    next(error);
  }
};

// ============================================================
// ADMIN ONLY
// ============================================================

const adminOnly = (req, res, next) => {
  if (!req.user) {
    const error = new Error(
      "Authentication required"
    );

    error.statusCode = 401;

    return next(error);
  }

  if (req.user.role !== "admin") {
    const error = new Error(
      "Admin access required"
    );

    error.statusCode = 403;

    return next(error);
  }

  next();
};

module.exports = {
  protect,
  adminOnly,
};