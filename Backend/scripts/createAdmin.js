// ============================================================
// SHANTI ENTERPRISES
// CREATE / RESET ADMIN
// ============================================================
//
// Usage (Backend folder se):
//
//   ADMIN_EMAIL=owner@yourdomain.com ADMIN_PASSWORD='StrongPass#123' \
//     node scripts/createAdmin.js
//
// Windows PowerShell:
//
//   $env:ADMIN_EMAIL="owner@yourdomain.com"
//   $env:ADMIN_PASSWORD="StrongPass#123"
//   node scripts/createAdmin.js
//
// Ya Backend/.env mein ADMIN_EMAIL aur ADMIN_PASSWORD likh do.
//
// - Email pehle se hai  => role "admin" set hota hai + password reset.
// - Email nahi hai      => naya admin ban jaata hai.
//
// NOTE: Admin ka email customer wale email se ALAG hona chahiye
// (email unique hota hai, ek email ek hi role ka ho sakta hai).
// ============================================================

require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

const ADMIN_NAME =
  process.env.ADMIN_NAME || "Shanti Admin";

const ADMIN_PHONE =
  process.env.ADMIN_PHONE || "";

const run = async () => {
  try {
    const email = String(
      process.env.ADMIN_EMAIL || ""
    )
      .trim()
      .toLowerCase();

    const password =
      process.env.ADMIN_PASSWORD || "";

    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing from Backend/.env"
      );
    }

    if (!email || !password) {
      throw new Error(
        "ADMIN_EMAIL and ADMIN_PASSWORD are required."
      );
    }

    if (password.length < 8) {
      throw new Error(
        "ADMIN_PASSWORD must be at least 8 characters."
      );
    }

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB connected:",
      mongoose.connection.name
    );

    const passwordHash =
      await bcrypt.hash(password, 12);

    const existing =
      await User.findOne({ email });

    if (existing) {
      await User.collection.updateOne(
        { _id: existing._id },
        {
          $set: {
            password: passwordHash,
            role: "admin",
            isActive: true,
            updatedAt: new Date(),
          },
        }
      );

      console.log(
        `Existing user promoted / reset as ADMIN: ${email}`
      );
    } else {
      await User.collection.insertOne({
        name: ADMIN_NAME,
        email,
        phone: ADMIN_PHONE,
        password: passwordHash,
        role: "admin",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(
        `New ADMIN created: ${email}`
      );
    }

    const check = await User.findOne({
      email,
    }).select("+password");

    const ok = await bcrypt.compare(
      password,
      check.password
    );

    console.log("Role     :", check.role);
    console.log("Active   :", check.isActive);
    console.log(
      "Password :",
      ok ? "verified" : "VERIFY FAILED"
    );

    process.exitCode = ok ? 0 : 1;
  } catch (error) {
    console.error(
      "createAdmin failed:",
      error.message
    );

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();