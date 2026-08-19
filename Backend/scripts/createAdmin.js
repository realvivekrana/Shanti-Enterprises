const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

const ADMIN_EMAIL = 'Admin@test.com';
const ADMIN_PASSWORD = '123456';

const createAdmin = async () => {
  try {
    // ================================================
    // CHECK MONGO URI
    // ================================================

    if (!process.env.MONGO_URI) {
      throw new Error(
        'MONGO_URI is missing from Backend/.env'
      );
    }

    console.log('Connecting to MongoDB...');

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      'MongoDB connected successfully'
    );

    // ================================================
    // FIND EXISTING USER
    // ================================================

    let admin = await User.findOne({
      email: ADMIN_EMAIL.toLowerCase(),
    }).select('+password');

    // ================================================
    // HASH PASSWORD
    // ================================================

    const hashedPassword =
      await bcrypt.hash(
        ADMIN_PASSWORD,
        10
      );

    // ================================================
    // EXISTING USER
    // ================================================

    if (admin) {
      console.log(
        'Existing user found.'
      );

      admin.name =
        'Administrator';

      admin.email =
        ADMIN_EMAIL.toLowerCase();

      admin.password =
        hashedPassword;

      admin.role =
        'admin';

      admin.blocked =
        false;

      admin.businessName =
        admin.businessName ||
        'Shanti Enterprises';

      await admin.save();

      console.log(
        'Existing user converted to admin.'
      );
    }

    // ================================================
    // CREATE NEW ADMIN
    // ================================================

    else {
      admin = await User.create({
        name: 'Administrator',

        email:
          ADMIN_EMAIL.toLowerCase(),

        password:
          hashedPassword,

        phone: '',

        businessName:
          'Shanti Enterprises',

        role: 'admin',

        blocked: false,
      });

      console.log(
        'New admin created successfully.'
      );
    }

    // ================================================
    // SUCCESS
    // ================================================

    console.log('');
    console.log(
      '======================================'
    );
    console.log(
      '       ADMIN ACCOUNT READY'
    );
    console.log(
      '======================================'
    );
    console.log(
      'Email    : Admin@test.com'
    );
    console.log(
      'Password : 123456'
    );
    console.log(
      'Role     : admin'
    );
    console.log(
      '======================================'
    );
    console.log('');

  } catch (error) {
    console.error('');
    console.error(
      'Failed to create/update admin:'
    );
    console.error(
      error.message
    );
    console.error('');

    process.exitCode = 1;

  } finally {
    if (
      mongoose.connection.readyState !== 0
    ) {
      await mongoose.connection.close();
    }

    console.log(
      'MongoDB connection closed.'
    );
  }
};

createAdmin();