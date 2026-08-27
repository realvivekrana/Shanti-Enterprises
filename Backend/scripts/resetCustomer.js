// ============================================================
// SHANTI ENTERPRISES
// FINAL CUSTOMER LOGIN RESET
// ============================================================

require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

// ============================================================
// LOGIN CREDENTIALS
// ============================================================

const EMAIL =
  "testcustomer2@example.com";

const PASSWORD =
  "customer@test";

// ============================================================
// RESET CUSTOMER
// ============================================================

async function resetCustomer() {
  try {
    console.log("");
    console.log("================================================");
    console.log("       SHANTI ENTERPRISES");
    console.log("       FINAL CUSTOMER LOGIN RESET");
    console.log("================================================");

    // ----------------------------------------------------------
    // CHECK ENV
    // ----------------------------------------------------------

    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing from Backend/.env"
      );
    }

    if (!process.env.JWT_SECRET) {
      console.warn(
        "WARNING: JWT_SECRET is missing."
      );
    }

    // ----------------------------------------------------------
    // CONNECT
    // ----------------------------------------------------------

    console.log("");
    console.log(
      "Connecting to MongoDB..."
    );

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB connected successfully."
    );

    console.log(
      "Database:",
      mongoose.connection.name
    );

    // ----------------------------------------------------------
    // NORMALIZE EMAIL
    // ----------------------------------------------------------

    const email =
      EMAIL.trim().toLowerCase();

    // ----------------------------------------------------------
    // CREATE PASSWORD HASH
    // ----------------------------------------------------------

    console.log("");
    console.log(
      "Creating password hash..."
    );

    const passwordHash =
      await bcrypt.hash(
        PASSWORD,
        12
      );

    // ----------------------------------------------------------
    // FIND CUSTOMER
    // ----------------------------------------------------------

    let customer =
      await User.findOne({
        email,
      }).select("+password");

    // ==========================================================
    // CUSTOMER EXISTS
    // ==========================================================

    if (customer) {
      console.log("");
      console.log(
        "Existing customer found."
      );

      console.log(
        "Customer ID:",
        customer._id.toString()
      );

      // IMPORTANT:
      // Direct MongoDB update prevents any Mongoose
      // password middleware from hashing the password again.

      const updateResult =
        await User.collection.updateOne(
          {
            _id: customer._id,
          },
          {
            $set: {
              password:
                passwordHash,

              role:
                "customer",

              isActive:
                true,

              blocked:
                false,

              updatedAt:
                new Date(),
            },
          }
        );

      console.log(
        "Database update matched:",
        updateResult.matchedCount
      );

      console.log(
        "Database update modified:",
        updateResult.modifiedCount
      );
    }

    // ==========================================================
    // CUSTOMER DOES NOT EXIST
    // ==========================================================

    else {
      console.log("");
      console.log(
        "Customer does not exist."
      );

      console.log(
        "Creating customer..."
      );

      const result =
        await User.collection.insertOne({
          name:
            "Test Customer",

          email,

          phone:
            "9876543212",

          password:
            passwordHash,

          role:
            "customer",

          isActive:
            true,

          blocked:
            false,

          createdAt:
            new Date(),

          updatedAt:
            new Date(),
        });

      console.log(
        "Customer created:",
        result.insertedId.toString()
      );
    }

    // ==========================================================
    // READ CUSTOMER AGAIN
    // ==========================================================

    customer =
      await User.findOne({
        email,
      }).select("+password");

    // ----------------------------------------------------------
    // CUSTOMER MUST EXIST
    // ----------------------------------------------------------

    if (!customer) {
      throw new Error(
        "Customer could not be found after reset."
      );
    }

    // ==========================================================
    // VERIFY EMAIL
    // ==========================================================

    console.log("");
    console.log(
      "Verifying customer..."
    );

    console.log(
      "Email:",
      customer.email
    );

    console.log(
      "Role:",
      customer.role
    );

    console.log(
      "Active:",
      customer.isActive
    );

    // ==========================================================
    // VERIFY PASSWORD
    // ==========================================================

    const passwordMatches =
      await bcrypt.compare(
        PASSWORD,
        customer.password
      );

    console.log("");

    console.log(
      "Password verification:",
      passwordMatches
        ? "SUCCESS"
        : "FAILED"
    );

    // ==========================================================
    // FINAL CHECK
    // ==========================================================

    if (!passwordMatches) {
      throw new Error(
        "Password verification failed. Customer was not configured correctly."
      );
    }

    if (
      customer.role !==
      "customer"
    ) {
      throw new Error(
        `Customer role is "${customer.role}" instead of "customer".`
      );
    }

    if (
      customer.isActive !== true
    ) {
      throw new Error(
        "Customer is not active."
      );
    }

    // ==========================================================
    // SUCCESS
    // ==========================================================

    console.log("");
    console.log("================================================");
    console.log("       CUSTOMER LOGIN READY");
    console.log("================================================");
    console.log(
      "Email    : testcustomer2@example.com"
    );
    console.log(
      "Password : customer@test"
    );
    console.log(
      "Role     : customer"
    );
    console.log(
      "Active   : true"
    );
    console.log("================================================");
    console.log("");

  } catch (error) {
    console.error("");
    console.error("================================================");
    console.error("       CUSTOMER RESET FAILED");
    console.error("================================================");
    console.error(
      error.message
    );
    console.error("================================================");
    console.error("");
  } finally {
    if (
      mongoose.connection.readyState !==
      0
    ) {
      await mongoose.connection.close();

      console.log(
        "MongoDB connection closed."
      );
    }
  }
}

// ============================================================
// RUN
// ============================================================

resetCustomer();