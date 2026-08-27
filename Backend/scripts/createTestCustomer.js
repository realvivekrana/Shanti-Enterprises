// ============================================================
// SHANTI ENTERPRISES
// CREATE / RESET TEST CUSTOMER
// ============================================================

require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

// ============================================================
// CUSTOMER DETAILS
// ============================================================

const CUSTOMER_EMAIL =
  "testcustomer2@example.com";

const CUSTOMER_PASSWORD =
  "customer@test";

const CUSTOMER_NAME =
  "Test Customer";

const CUSTOMER_PHONE =
  "9876543212";

// ============================================================
// MAIN
// ============================================================

const createOrResetCustomer = async () => {
  try {
    console.log("");
    console.log("================================================");
    console.log("   SHANTI ENTERPRISES - TEST CUSTOMER RESET");
    console.log("================================================");
    console.log("");

    // ----------------------------------------------------------
    // CHECK MONGO URI
    // ----------------------------------------------------------

    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing from Backend/.env"
      );
    }

    // ----------------------------------------------------------
    // CONNECT MONGODB
    // ----------------------------------------------------------

    console.log("Connecting to MongoDB...");

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB connected successfully."
    );

    console.log("");

    // ----------------------------------------------------------
    // NORMALIZE EMAIL
    // ----------------------------------------------------------

    const email =
      CUSTOMER_EMAIL
        .trim()
        .toLowerCase();

    // ----------------------------------------------------------
    // HASH PASSWORD ONCE
    // ----------------------------------------------------------

    console.log(
      "Creating password hash..."
    );

    const hashedPassword =
      await bcrypt.hash(
        CUSTOMER_PASSWORD,
        10
      );

    // ----------------------------------------------------------
    // FIND CUSTOMER
    // ----------------------------------------------------------

    const existingCustomer =
      await User.findOne({
        email,
      }).select("+password");

    // ==========================================================
    // EXISTING CUSTOMER
    // ==========================================================

    if (existingCustomer) {
      console.log(
        "Existing customer found."
      );

      console.log(
        "Updating password directly..."
      );

      // IMPORTANT:
      // updateOne() bypasses mongoose save middleware.
      // Therefore the bcrypt hash below is stored exactly once.
      await User.updateOne(
        {
          _id: existingCustomer._id,
        },
        {
          $set: {
            name: CUSTOMER_NAME,

            phone: CUSTOMER_PHONE,

            email,

            password:
              hashedPassword,

            role: "customer",

            blocked: false,

            isActive: true,
          },
        }
      );

      console.log("");
      console.log(
        "================================================"
      );
      console.log(
        "       CUSTOMER PASSWORD RESET SUCCESS"
      );
      console.log(
        "================================================"
      );
    }

    // ==========================================================
    // NEW CUSTOMER
    // ==========================================================

    else {
      console.log(
        "Customer does not exist."
      );

      console.log(
        "Creating new customer..."
      );

      // --------------------------------------------------------
      // IMPORTANT:
      // Use the already hashed password.
      // We use insertOne so mongoose pre-save middleware
      // does NOT hash it again.
      // --------------------------------------------------------

      const result =
        await User.collection.insertOne({
          name: CUSTOMER_NAME,

          email,

          phone: CUSTOMER_PHONE,

          password:
            hashedPassword,

          role: "customer",

          blocked: false,

          isActive: true,

          createdAt: new Date(),

          updatedAt: new Date(),
        });

      console.log("");
      console.log(
        "================================================"
      );
      console.log(
        "        CUSTOMER CREATED SUCCESS"
      );
      console.log(
        "================================================"
      );

      console.log(
        "Customer ID:",
        result.insertedId.toString()
      );
    }

    // ==========================================================
    // VERIFY PASSWORD
    // ==========================================================

    console.log("");
    console.log(
      "Verifying password..."
    );

    const customer =
      await User.findOne({
        email,
      }).select("+password");

    if (!customer) {
      throw new Error(
        "Customer could not be found after reset."
      );
    }

    const passwordWorks =
      await bcrypt.compare(
        CUSTOMER_PASSWORD,
        customer.password
      );

    console.log("");

    if (!passwordWorks) {
      throw new Error(
        "PASSWORD VERIFICATION FAILED. Hash is not correct."
      );
    }

    console.log(
      "Password verification: SUCCESS"
    );

    // ==========================================================
    // VERIFY ACCOUNT
    // ==========================================================

    console.log("");
    console.log(
      "Customer information:"
    );

    console.log(
      "Name     :",
      customer.name
    );

    console.log(
      "Email    :",
      customer.email
    );

    console.log(
      "Role     :",
      customer.role
    );

    console.log(
      "Blocked  :",
      customer.blocked
    );

    console.log(
      "Active   :",
      customer.isActive
    );

    // ==========================================================
    // LOGIN CREDENTIALS
    // ==========================================================

    console.log("");

    console.log(
      "================================================"
    );

    console.log(
      "             LOGIN CREDENTIALS"
    );

    console.log(
      "================================================"
    );

    console.log(
      "Email    : testcustomer2@example.com"
    );

    console.log(
      "Password : customer@test"
    );

    console.log(
      "================================================"
    );

    console.log("");
    console.log(
      "CUSTOMER LOGIN SHOULD NOW WORK."
    );
    console.log("");
  } catch (error) {
    console.error("");
    console.error(
      "================================================"
    );
    console.error(
      "        CUSTOMER RESET FAILED"
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
    console.error("");
  } finally {
    if (
      mongoose.connection.readyState !== 0
    ) {
      await mongoose.connection.close();

      console.log(
        "MongoDB connection closed."
      );
    }
  }
};

// ============================================================
// RUN
// ============================================================

createOrResetCustomer();