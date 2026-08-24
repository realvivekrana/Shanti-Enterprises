// ============================================================
// SHANTI ENTERPRISES
// Authentication Controller
// Phase 1 - Foundation
// ============================================================

const jwt = require("jsonwebtoken");

const User = require("../models/User");

const {
  hashPassword,
  comparePassword,
} = require("../utils/password");

// ============================================================
// CREATE JWT
// ============================================================

const createToken = (userId) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// ============================================================
// SET AUTH COOKIE
// ============================================================

const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// ============================================================
// REGISTER
// ============================================================

const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      password,
    } = req.body;

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      const error = new Error(
        "An account with this email already exists"
      );

      error.statusCode = 409;

      return next(error);
    }

    const hashedPassword =
      await hashPassword(password);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone ? phone.trim() : "",
      password: hashedPassword,
    });

    const token = createToken(user._id);

    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// LOGIN
// ============================================================

const login = async (req, res, next) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      const error = new Error(
        "Invalid email or password"
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

    const passwordMatched =
      await comparePassword(
        password,
        user.password
      );

    if (!passwordMatched) {
      const error = new Error(
        "Invalid email or password"
      );

      error.statusCode = 401;

      return next(error);
    }

    const token = createToken(user._id);

    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// LOGOUT
// ============================================================

const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

// ============================================================
// CURRENT USER
// ============================================================

const getCurrentUser = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      const error = new Error(
        "User not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
};