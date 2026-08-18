const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// ==============================
// REGISTER USER
// ==============================
const registerUser = async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    businessName,
    gstNumber,
    addresses,
  } = req.body;

  try {
    // Required fields validation
    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !businessName
    ) {
      return res.status(400).json({
        message:
          'Name, email, password, phone and business name are required',
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long',
      });
    }

    // Check existing user
    const userExists = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (userExists) {
      return res.status(400).json({
        message: 'User already exists with this email',
      });
    }

    // Create customer
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone.trim(),
      businessName: businessName.trim(),
      gstNumber: gstNumber ? gstNumber.trim().toUpperCase() : '',
      addresses: {
        business: addresses?.business || {},
        billing: addresses?.billing || {},
        shipping: addresses?.shipping || {},
      },

      // Public registration can create customer only
      role: 'customer',
      status: 'active',
      isActive: true,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      businessName: user.businessName,
      gstNumber: user.gstNumber,
      addresses: user.addresses,
      role: user.role,
      status: user.status,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Register Error:', error);

    // MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Email is already registered',
      });
    }

    res.status(500).json({
      message: error.message || 'Registration failed',
    });
  }
};

// ==============================
// LOGIN USER
// ==============================
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // Check account status
    if (
      user.status === 'inactive' ||
      user.status === 'suspended'
    ) {
      return res.status(403).json({
        message: `Your account is ${user.status}. Please contact support.`,
      });
    }

    // Check old isActive field also
    if (user.isActive === false) {
      return res.status(403).json({
        message: 'Your account is inactive. Please contact support.',
      });
    }

    // Check password
    const passwordMatched = await user.matchPassword(password);

    if (!passwordMatched) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      businessName: user.businessName,
      gstNumber: user.gstNumber,
      addresses: user.addresses,
      role: user.role,
      status: user.status,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login Error:', error);

    res.status(500).json({
      message: error.message || 'Login failed',
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};