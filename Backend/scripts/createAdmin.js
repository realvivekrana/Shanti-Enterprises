// ============================================================
// SHANTI ENTERPRISES
// Create / Reset Admin User
// Development Setup
// ============================================================

require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

// ============================================================
// ADMIN DATA
// ============================================================

const ADMIN_DATA = {
  name: "Shanti Enterprises Admin",

  email: "admin@shantienterprises.test",

  phone: "9999999999",

  password: "Admin@123456",

  role: "admin",

  isActive: true,
};

// ============================================================
// CREATE / RESET ADMIN
// ============================================================

const createAdmin = async () => {
  try {
    // ----------------------------------------------------------
    // CHECK MONGO URI
    // ----------------------------------------------------------

    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is not configured in Backend/.env"
      );
    }

    console.log("");

    console.log(
      "================================================"
    );

    console.log(
      "   SHANTI ENTERPRISES - ADMIN SETUP"
    );

    console.log(
      "================================================"
    );

    console.log(
      "Connecting to MongoDB..."
    );

    // ----------------------------------------------------------
    // CONNECT DATABASE
    // ----------------------------------------------------------

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB connected successfully."
    );

    // ----------------------------------------------------------
    // NORMALIZE EMAIL
    // ----------------------------------------------------------

    const normalizedEmail =
      ADMIN_DATA.email
        .trim()
        .toLowerCase();

    // ----------------------------------------------------------
    // HASH PASSWORD
    // ----------------------------------------------------------

    const hashedPassword =
      await bcrypt.hash(
        ADMIN_DATA.password,
        10
      );

    // ----------------------------------------------------------
    // FIND ADMIN
    // ----------------------------------------------------------

    const existingAdmin =
      await User.findOne({
        email: normalizedEmail,
      });

    // ==========================================================
    // ADMIN EXISTS
    // ==========================================================

    if (existingAdmin) {
      console.log("");

      console.log(
        "Existing admin found."
      );

      console.log(
        "Updating admin account..."
      );

      // --------------------------------------------------------
      // UPDATE ADMIN
      // --------------------------------------------------------

      existingAdmin.name =
        ADMIN_DATA.name;

      existingAdmin.phone =
        ADMIN_DATA.phone;

      existingAdmin.password =
        hashedPassword;

      existingAdmin.role =
        "admin";

      existingAdmin.isActive =
        true;

      await existingAdmin.save();

      console.log("");

      console.log(
        "================================================"
      );

      console.log(
        "       ADMIN UPDATED SUCCESSFULLY"
      );

      console.log(
        "================================================"
      );

      console.log(
        `Name     : ${existingAdmin.name}`
      );

      console.log(
        `Email    : ${existingAdmin.email}`
      );

      console.log(
        `Phone    : ${existingAdmin.phone}`
      );

      console.log(
        `Role     : ${existingAdmin.role}`
      );

      console.log(
        `Active   : ${existingAdmin.isActive}`
      );

      console.log("");

      console.log(
        "Login Credentials"
      );

      console.log(
        `Email    : ${ADMIN_DATA.email}`
      );

      console.log(
        `Password : ${ADMIN_DATA.password}`
      );

      console.log(
        "================================================"
      );

      return;
    }

    // ==========================================================
    // CREATE NEW ADMIN
    // ==========================================================

    const admin =
      await User.create({
        name:
          ADMIN_DATA.name,

        email:
          normalizedEmail,

        phone:
          ADMIN_DATA.phone,

        password:
          hashedPassword,

        role:
          ADMIN_DATA.role,

        isActive:
          ADMIN_DATA.isActive,
      });

    // ==========================================================
    // SUCCESS
    // ==========================================================

    console.log("");

    console.log(
      "================================================"
    );

    console.log(
      "        ADMIN CREATED SUCCESSFULLY"
    );

    console.log(
      "================================================"
    );

    console.log(
      `Name     : ${admin.name}`
    );

    console.log(
      `Email    : ${admin.email}`
    );

    console.log(
      `Phone    : ${admin.phone}`
    );

    console.log(
      `Role     : ${admin.role}`
    );

    console.log(
      `Active   : ${admin.isActive}`
    );

    console.log("");

    console.log(
      "Login Credentials"
    );

    console.log(
      `Email    : ${ADMIN_DATA.email}`
    );

    console.log(
      `Password : ${ADMIN_DATA.password}`
    );

    console.log(
      "================================================"
    );
  } catch (error) {
    console.error("");

    console.error(
      "================================================"
    );

    console.error(
      "           ADMIN SETUP FAILED"
    );

    console.error(
      "================================================"
    );

    console.error(
      error.message
    );

    console.error(
      "================================================"
    );

    process.exitCode = 1;
  } finally {
    // ----------------------------------------------------------
    // CLOSE DATABASE
    // ----------------------------------------------------------

    if (
      mongoose.connection.readyState !==
      0
    ) {
      await mongoose.connection.close();

      console.log("");

      console.log(
        "MongoDB connection closed."
      );
    }
  }
};

// ============================================================
// RUN
// ============================================================

createAdmin();