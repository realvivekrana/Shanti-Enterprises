// ============================================================
// SHANTI ENTERPRISES
// MongoDB Database Connection
// Phase 1 - Foundation
// ============================================================

const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    if (mongoUri === "your_mongodb_connection_string") {
      throw new Error("Please add your real MongoDB connection string to .env");
    }

    const connection = await mongoose.connect(
      mongoUri,
      {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      }
    );

    console.log("");
    console.log("================================================");
    console.log("        MONGODB DATABASE CONNECTED");
    console.log("================================================");
    console.log(`Database : ${connection.connection.name}`);
    console.log(`Host     : ${connection.connection.host}`);
    console.log("================================================");
    console.log("");

    return connection;
  } catch (error) {
    console.error("");
    console.error("================================================");
    console.error("        MONGODB CONNECTION FAILED");
    console.error("================================================");
    console.error(`Message: ${error.message}`);
    console.error("================================================");
    console.error("");

    throw error;
  }
};

module.exports = connectDatabase;