const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const User = require('../models/User');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ======================================================
// GENERATE JWT TOKEN
// ======================================================

const generateToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.JWT_EXPIRE || '7d',
    }
  );
};

// ======================================================
// REMOVE PASSWORD FROM USER OBJECT
// ======================================================

const sanitizeUser = (user) => {
  const userObject = user.toObject
    ? user.toObject()
    : { ...user };

  delete userObject.password;

  return userObject;
};

// ======================================================
// CUSTOMER REGISTER
// POST /api/auth/register
// ======================================================

const registerUser = asyncHandler(
  async (req, res) => {
    const {
      name,
      email,
      password,
      phone,
      businessName,
    } = req.body;

    // ==================================================
    // BASIC VALIDATION
    // ==================================================

    if (
      !name ||
      !email ||
      !password
    ) {
      throw new ApiError(
        400,
        'Name, email and password are required'
      );
    }

    // ==================================================
    // NAME VALIDATION
    // ==================================================

    if (name.trim().length < 2) {
      throw new ApiError(
        400,
        'Name must contain at least 2 characters'
      );
    }

    // ==================================================
    // EMAIL
    // ==================================================

    const normalizedEmail =
      email.trim().toLowerCase();

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        normalizedEmail
      )
    ) {
      throw new ApiError(
        400,
        'Please enter a valid email address'
      );
    }

    // ==================================================
    // PASSWORD
    // ==================================================

    if (password.length < 6) {
      throw new ApiError(
        400,
        'Password must be at least 6 characters'
      );
    }

    // ==================================================
    // CHECK EXISTING USER
    // ==================================================

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      throw new ApiError(
        409,
        'User with this email already exists'
      );
    }

    // ==================================================
    // HASH PASSWORD
    // ==================================================

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // ==================================================
    // CREATE CUSTOMER
    // ==================================================

    const user =
      await User.create({
        name:
          name.trim(),

        email:
          normalizedEmail,

        password:
          hashedPassword,

        // Optional
        phone:
          phone
            ? phone.trim()
            : '',

        // Optional
        businessName:
          businessName
            ? businessName.trim()
            : '',

        // IMPORTANT
        role: 'customer',
      });

    // ==================================================
    // TOKEN
    // ==================================================

    const token =
      generateToken(
        user._id
      );

    // ==================================================
    // RESPONSE
    // ==================================================

    const safeUser =
      sanitizeUser(user);

    res.status(201).json(
      new ApiResponse(
        201,
        {
          user: safeUser,
          token,
        },
        'Registration successful'
      )
    );
  }
);

// ======================================================
// CUSTOMER LOGIN
// POST /api/auth/login
// ======================================================

const loginUser = asyncHandler(
  async (req, res) => {
    const {
      email,
      password,
    } = req.body;

    // ==================================================
    // VALIDATION
    // ==================================================

    if (
      !email ||
      !password
    ) {
      throw new ApiError(
        400,
        'Email and password are required'
      );
    }

    // ==================================================
    // FIND USER
    // ==================================================

    const normalizedEmail =
      email.trim().toLowerCase();

    const user =
      await User.findOne({
        email:
          normalizedEmail,
      }).select(
        '+password'
      );

    if (!user) {
      throw new ApiError(
        401,
        'Invalid email or password'
      );
    }

    // ==================================================
    // CUSTOMER LOGIN ONLY
    // ==================================================

    if (
      user.role === 'admin'
    ) {
      throw new ApiError(
        403,
        'Please use Admin Login for administrator accounts'
      );
    }

    // ==================================================
    // PASSWORD
    // ==================================================

    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordCorrect) {
      throw new ApiError(
        401,
        'Invalid email or password'
      );
    }

    // ==================================================
    // BLOCKED
    // ==================================================

    if (
      user.blocked === true
    ) {
      throw new ApiError(
        403,
        'Your account has been blocked. Please contact support.'
      );
    }

    // ==================================================
    // TOKEN
    // ==================================================

    const token =
      generateToken(
        user._id
      );

    // ==================================================
    // RESPONSE
    // ==================================================

    const safeUser =
      sanitizeUser(user);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          user: safeUser,
          token,
        },
        'Login successful'
      )
    );
  }
);

// ======================================================
// ADMIN REGISTER
// POST /api/auth/admin/register
// ======================================================

const registerAdmin = asyncHandler(
  async (req, res) => {
    const {
      name,
      email,
      password,
      adminCode,
    } = req.body;

    // ==================================================
    // BASIC VALIDATION
    // ==================================================

    if (
      !name ||
      !email ||
      !password ||
      !adminCode
    ) {
      throw new ApiError(
        400,
        'Name, email, password and admin code are required'
      );
    }

    // ==================================================
    // ADMIN REGISTRATION CODE
    // ==================================================

    if (
      !process.env.ADMIN_REGISTER_CODE
    ) {
      throw new ApiError(
        500,
        'Admin registration is not configured'
      );
    }

    if (
      adminCode !==
      process.env.ADMIN_REGISTER_CODE
    ) {
      throw new ApiError(
        403,
        'Invalid admin registration code'
      );
    }

    // ==================================================
    // NAME
    // ==================================================

    if (
      name.trim().length < 2
    ) {
      throw new ApiError(
        400,
        'Name must contain at least 2 characters'
      );
    }

    // ==================================================
    // EMAIL
    // ==================================================

    const normalizedEmail =
      email.trim().toLowerCase();

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        normalizedEmail
      )
    ) {
      throw new ApiError(
        400,
        'Please enter a valid email address'
      );
    }

    // ==================================================
    // PASSWORD
    // ==================================================

    if (
      password.length < 6
    ) {
      throw new ApiError(
        400,
        'Password must be at least 6 characters'
      );
    }

    // ==================================================
    // CHECK EXISTING ACCOUNT
    // ==================================================

    const existingUser =
      await User.findOne({
        email:
          normalizedEmail,
      });

    if (existingUser) {
      throw new ApiError(
        409,
        'An account with this email already exists'
      );
    }

    // ==================================================
    // HASH PASSWORD
    // ==================================================

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // ==================================================
    // CREATE ADMIN
    // ==================================================

    const admin =
      await User.create({
        name:
          name.trim(),

        email:
          normalizedEmail,

        password:
          hashedPassword,

        phone: '',

        businessName:
          'Shanti Enterprises',

        // IMPORTANT
        role: 'admin',

        blocked: false,
      });

    // ==================================================
    // TOKEN
    // ==================================================

    const token =
      generateToken(
        admin._id
      );

    // ==================================================
    // RESPONSE
    // ==================================================

    const safeAdmin =
      sanitizeUser(admin);

    res.status(201).json(
      new ApiResponse(
        201,
        {
          user: safeAdmin,
          token,
        },
        'Admin account created successfully'
      )
    );
  }
);

// ======================================================
// ADMIN LOGIN
// POST /api/auth/admin/login
// ======================================================

const loginAdmin = asyncHandler(
  async (req, res) => {
    const {
      email,
      password,
    } = req.body;

    // ==================================================
    // VALIDATION
    // ==================================================

    if (
      !email ||
      !password
    ) {
      throw new ApiError(
        400,
        'Email and password are required'
      );
    }

    // ==================================================
    // FIND ADMIN
    // ==================================================

    const normalizedEmail =
      email.trim().toLowerCase();

    const admin =
      await User.findOne({
        email:
          normalizedEmail,
        role: 'admin',
      }).select(
        '+password'
      );

    if (!admin) {
      throw new ApiError(
        401,
        'Invalid admin email or password'
      );
    }

    // ==================================================
    // BLOCKED
    // ==================================================

    if (
      admin.blocked === true
    ) {
      throw new ApiError(
        403,
        'This admin account has been blocked'
      );
    }

    // ==================================================
    // PASSWORD
    // ==================================================

    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        admin.password
      );

    if (!isPasswordCorrect) {
      throw new ApiError(
        401,
        'Invalid admin email or password'
      );
    }

    // ==================================================
    // TOKEN
    // ==================================================

    const token =
      generateToken(
        admin._id
      );

    // ==================================================
    // RESPONSE
    // ==================================================

    const safeAdmin =
      sanitizeUser(admin);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          user: safeAdmin,
          token,
        },
        'Admin login successful'
      )
    );
  }
);

// ======================================================
// GET CURRENT USER
// GET /api/auth/me
// ======================================================

const getCurrentUser =
  asyncHandler(
    async (req, res) => {
      const user =
        await User.findById(
          req.user._id
        ).select(
          '-password'
        );

      if (!user) {
        throw new ApiError(
          404,
          'User not found'
        );
      }

      res.status(200).json(
        new ApiResponse(
          200,
          user,
          'User profile fetched'
        )
      );
    }
  );

// ======================================================
// UPDATE PROFILE
// PUT /api/auth/profile
// ======================================================

const updateProfile =
  asyncHandler(
    async (req, res) => {
      const {
        name,
        phone,
        businessName,
        email,
      } = req.body;

      const user =
        await User.findById(
          req.user._id
        );

      if (!user) {
        throw new ApiError(
          404,
          'User not found'
        );
      }

      // ==================================================
      // NAME
      // ==================================================

      if (
        name !== undefined
      ) {
        if (
          !name.trim() ||
          name.trim().length < 2
        ) {
          throw new ApiError(
            400,
            'Name must contain at least 2 characters'
          );
        }

        user.name =
          name.trim();
      }

      // ==================================================
      // PHONE
      // ==================================================

      if (
        phone !== undefined
      ) {
        user.phone =
          phone.trim();
      }

      // ==================================================
      // BUSINESS NAME
      // ==================================================

      if (
        businessName !==
        undefined
      ) {
        user.businessName =
          businessName.trim();
      }

      // ==================================================
      // EMAIL
      // ==================================================

      if (
        email !== undefined
      ) {
        const normalizedEmail =
          email
            .trim()
            .toLowerCase();

        const emailRegex =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
          !emailRegex.test(
            normalizedEmail
          )
        ) {
          throw new ApiError(
            400,
            'Please enter a valid email address'
          );
        }

        const emailExists =
          await User.findOne({
            email:
              normalizedEmail,
            _id: {
              $ne:
                user._id,
            },
          });

        if (
          emailExists
        ) {
          throw new ApiError(
            409,
            'Email is already in use'
          );
        }

        user.email =
          normalizedEmail;
      }

      // ==================================================
      // SAVE
      // ==================================================

      const updatedUser =
        await user.save();

      // ==================================================
      // RESPONSE
      // ==================================================

      res.status(200).json(
        new ApiResponse(
          200,
          sanitizeUser(
            updatedUser
          ),
          'Profile updated successfully'
        )
      );
    }
  );

// ======================================================
// CHANGE PASSWORD
// PUT /api/auth/change-password
// ======================================================

const changePassword =
  asyncHandler(
    async (req, res) => {
      const {
        currentPassword,
        newPassword,
      } = req.body;

      if (
        !currentPassword ||
        !newPassword
      ) {
        throw new ApiError(
          400,
          'Current password and new password are required'
        );
      }

      if (
        newPassword.length < 6
      ) {
        throw new ApiError(
          400,
          'New password must be at least 6 characters'
        );
      }

      const user =
        await User.findById(
          req.user._id
        ).select(
          '+password'
        );

      if (!user) {
        throw new ApiError(
          404,
          'User not found'
        );
      }

      const passwordMatched =
        await bcrypt.compare(
          currentPassword,
          user.password
        );

      if (
        !passwordMatched
      ) {
        throw new ApiError(
          401,
          'Current password is incorrect'
        );
      }

      user.password =
        await bcrypt.hash(
          newPassword,
          10
        );

      await user.save();

      res.status(200).json(
        new ApiResponse(
          200,
          null,
          'Password changed successfully'
        )
      );
    }
  );

// ======================================================
// LOGOUT
// POST /api/auth/logout
// ======================================================

const logoutUser =
  asyncHandler(
    async (req, res) => {
      res.status(200).json(
        new ApiResponse(
          200,
          null,
          'Logout successful'
        )
      );
    }
  );

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  registerUser,
  loginUser,

  registerAdmin,
  loginAdmin,

  getCurrentUser,
  updateProfile,
  changePassword,
  logoutUser,
};