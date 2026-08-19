const mongoose = require('mongoose');

// ======================================================
// USER SCHEMA
// ======================================================

const userSchema = new mongoose.Schema(
  {
    // ====================================================
    // NAME
    // ====================================================

    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    // ====================================================
    // EMAIL
    // ====================================================

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // ====================================================
    // PASSWORD
    // ====================================================

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },

    // ====================================================
    // PHONE
    // OPTIONAL DURING REGISTRATION
    // ====================================================

    phone: {
      type: String,
      default: '',
      trim: true,
    },

    // ====================================================
    // BUSINESS NAME
    // OPTIONAL DURING REGISTRATION
    // ====================================================

    businessName: {
      type: String,
      default: '',
      trim: true,
    },

    // ====================================================
    // ROLE
    // ====================================================

    role: {
      type: String,
      enum: [
        'customer',
        'admin',
      ],
      default: 'customer',
    },

    // ====================================================
    // ACCOUNT STATUS
    // ====================================================

    blocked: {
      type: Boolean,
      default: false,
    },

    // ====================================================
    // PROFILE IMAGE
    // ====================================================

    avatar: {
      type: String,
      default: '',
    },

    // ====================================================
    // BUSINESS DETAILS
    // OPTIONAL
    // ====================================================

    gstNumber: {
      type: String,
      default: '',
      trim: true,
    },

    // ====================================================
    // ADDRESS
    // OPTIONAL
    // ====================================================

    address: {
      street: {
        type: String,
        default: '',
        trim: true,
      },

      city: {
        type: String,
        default: '',
        trim: true,
      },

      state: {
        type: String,
        default: '',
        trim: true,
      },

      pincode: {
        type: String,
        default: '',
        trim: true,
      },

      country: {
        type: String,
        default: 'India',
        trim: true,
      },
    },

    // ====================================================
    // LAST LOGIN
    // ====================================================

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ======================================================
// EMAIL INDEX
// ======================================================

userSchema.index({
  email: 1,
});

// ======================================================
// REMOVE PASSWORD WHEN CONVERTING TO JSON
// ======================================================

userSchema.methods.toJSON = function () {
  const user =
    this.toObject();

  delete user.password;

  return user;
};

// ======================================================
// EXPORT MODEL
// ======================================================

const User =
  mongoose.model(
    'User',
    userSchema
  );

module.exports = User;