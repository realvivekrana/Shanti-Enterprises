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

const setAuthCookie = (
  res,
  token
) => {
  res.cookie(
    "token",
    token,
    {
      httpOnly: true,

      secure:
        process.env.NODE_ENV ===
        "production",

      sameSite:
        process.env.NODE_ENV ===
        "production"
          ? "none"
          : "lax",

      maxAge:
        7 *
        24 *
        60 *
        60 *
        1000,

      path: "/",
    }
  );
};

// ============================================================
// REGISTER
// ============================================================

const register = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      email,
      phone,
      password,
    } = req.body;

    // --------------------------------------------------------
    // BASIC VALIDATION
    // --------------------------------------------------------

    if (
      !name ||
      !email ||
      !password
    ) {
      const error =
        new Error(
          "Name, email and password are required"
        );

      error.statusCode = 400;

      return next(error);
    }

    // --------------------------------------------------------
    // NORMALIZE EMAIL
    // --------------------------------------------------------

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

    // --------------------------------------------------------
    // CHECK EXISTING USER
    // --------------------------------------------------------

    const existingUser =
      await User.findOne({
        email:
          normalizedEmail,
      });

    if (existingUser) {
      const error =
        new Error(
          "An account with this email already exists"
        );

      error.statusCode = 409;

      return next(error);
    }

    // --------------------------------------------------------
    // HASH PASSWORD
    // --------------------------------------------------------

    const hashedPassword =
      await hashPassword(
        password
      );

    // --------------------------------------------------------
    // CREATE USER
    // --------------------------------------------------------

    const user =
      await User.create({
        name:
          name.trim(),

        email:
          normalizedEmail,

        phone:
          phone
            ? phone.trim()
            : "",

        password:
          hashedPassword,

        role:
          "customer",

        isActive:
          true,
      });

    // --------------------------------------------------------
    // CREATE TOKEN
    // --------------------------------------------------------

    const token =
      createToken(
        user._id
      );

    setAuthCookie(
      res,
      token
    );

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return res
      .status(201)
      .json({
        success: true,

        message:
          "Account created successfully",

        user: {
          id:
            user._id,

          name:
            user.name,

          email:
            user.email,

          phone:
            user.phone,

          role:
            user.role,
        },
      });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// LOGIN
// ============================================================

const login = async (
  req,
  res,
  next
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (
      !email ||
      !password
    ) {
      const error =
        new Error(
          "Email and password are required"
        );

      error.statusCode = 400;

      return next(error);
    }

    // --------------------------------------------------------
    // NORMALIZE EMAIL
    // --------------------------------------------------------

    const normalizedEmail =
      String(email)
        .trim()
        .toLowerCase();

    // --------------------------------------------------------
    // FIND USER
    // --------------------------------------------------------
    // Password is select:false in User model,
    // therefore +password is required.
    // --------------------------------------------------------

    const user =
      await User.findOne({
        email:
          normalizedEmail,
      }).select(
        "+password"
      );

    // --------------------------------------------------------
    // USER NOT FOUND
    // --------------------------------------------------------

    if (!user) {
      console.log("");
      console.log(
        "LOGIN DEBUG"
      );
      console.log(
        "Email:",
        normalizedEmail
      );
      console.log(
        "User found: NO"
      );
      console.log("");

      const error =
        new Error(
          "Invalid email or password"
        );

      error.statusCode = 401;

      return next(error);
    }

    // --------------------------------------------------------
    // DEBUG
    // --------------------------------------------------------

    console.log("");
    console.log(
      "LOGIN DEBUG"
    );
    console.log(
      "Email:",
      normalizedEmail
    );
    console.log(
      "User found: YES"
    );
    console.log(
      "User ID:",
      user._id.toString()
    );
    console.log(
      "Role:",
      user.role
    );
    console.log(
      "Active:",
      user.isActive
    );
    console.log(
      "Password hash exists:",
      Boolean(user.password)
    );

    // --------------------------------------------------------
    // ACTIVE CHECK
    // --------------------------------------------------------

    if (
      user.isActive ===
      false
    ) {
      const error =
        new Error(
          "Your account has been deactivated"
        );

      error.statusCode = 403;

      return next(error);
    }

    // --------------------------------------------------------
    // PASSWORD CHECK
    // --------------------------------------------------------

    const passwordMatched =
      await comparePassword(
        password,
        user.password
      );

    console.log(
      "Password matched:",
      passwordMatched
    );

    console.log("");

    if (!passwordMatched) {
      const error =
        new Error(
          "Invalid email or password"
        );

      error.statusCode = 401;

      return next(error);
    }

    // --------------------------------------------------------
    // CREATE TOKEN
    // --------------------------------------------------------

    const token =
      createToken(
        user._id
      );

    // --------------------------------------------------------
    // SET COOKIE
    // --------------------------------------------------------

    setAuthCookie(
      res,
      token
    );

    // --------------------------------------------------------
    // SUCCESS RESPONSE
    // --------------------------------------------------------

    return res
      .status(200)
      .json({
        success: true,

        message:
          "Login successful",

        user: {
          id:
            user._id,

          name:
            user.name,

          email:
            user.email,

          phone:
            user.phone,

          role:
            user.role,

          isActive:
            user.isActive,
        },
      });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// LOGOUT
// ============================================================

const logout = (
  req,
  res
) => {
  res.cookie(
    "token",
    "",
    {
      httpOnly: true,

      secure:
        process.env.NODE_ENV ===
        "production",

      sameSite:
        process.env.NODE_ENV ===
        "production"
          ? "none"
          : "lax",

      expires:
        new Date(0),

      path: "/",
    }
  );

  return res
    .status(200)
    .json({
      success: true,

      message:
        "Logout successful",
    });
};

// ============================================================
// CURRENT USER
// ============================================================

const getCurrentUser =
  async (
    req,
    res,
    next
  ) => {
    try {
      const user =
        await User.findById(
          req.user.id
        );

      if (!user) {
        const error =
          new Error(
            "User not found"
          );

        error.statusCode = 404;

        return next(error);
      }

      return res
        .status(200)
        .json({
          success: true,

          user: {
            id:
              user._id,

            name:
              user.name,

            email:
              user.email,

            phone:
              user.phone,

            role:
              user.role,

            isActive:
              user.isActive,

            createdAt:
              user.createdAt,
          },
        });
    } catch (error) {
      next(error);
    }
  };

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
};