const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

// Pehle yahan email/password directly code mein
// hardcoded the ("Admin@test.com" / "123456") — koi bhi
// jo iss repo/code ko dekh sakta tha, admin password jaanta tha.
// Ab dono .env se aayenge, taaki real/production admin
// credentials kabhi code mein na dikhein.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

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

    // ================================================
    // CHECK ADMIN CREDENTIALS
    // ================================================

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error(
        'ADMIN_EMAIL and ADMIN_PASSWORD are missing from Backend/.env. ' +
        'Add these before running this script, e.g.\n' +
        'ADMIN_EMAIL=admin@yourdomain.com\n' +
        'ADMIN_PASSWORD=SomeStrongPassword123'
      );
    }

    if (ADMIN_PASSWORD.length < 8) {
      throw new Error(
        'ADMIN_PASSWORD is too weak. Use at least 8 characters.'
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
      `Email    : ${ADMIN_EMAIL}`
    );
    console.log(
      'Password : (jo .env mein set kiya tha)'
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