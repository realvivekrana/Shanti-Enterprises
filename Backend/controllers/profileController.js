// ============================================================
// SHANTI ENTERPRISES
// Profile Controller
// Phase 3 - Customer Portal
// ============================================================

const User = require("../models/User");

// ============================================================
// GET MY PROFILE
// ============================================================

const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password"
    );

    if (!user) {
      const error = new Error("User not found");

      error.statusCode = 404;

      return next(error);
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// UPDATE MY PROFILE
// ============================================================

const updateMyProfile = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      phone,
    } = req.body;

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

    if (name !== undefined) {
      const trimmedName =
        String(name).trim();

      if (
        trimmedName.length < 2
      ) {
        const error = new Error(
          "Name must be at least 2 characters"
        );

        error.statusCode = 400;

        return next(error);
      }

      user.name = trimmedName;
    }

    if (phone !== undefined) {
      const trimmedPhone =
        String(phone).trim();

      if (
        trimmedPhone.length > 0 &&
        (trimmedPhone.length < 10 ||
          trimmedPhone.length > 15)
      ) {
        const error = new Error(
          "Phone number must be between 10 and 15 characters"
        );

        error.statusCode = 400;

        return next(error);
      }

      user.phone = trimmedPhone;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};