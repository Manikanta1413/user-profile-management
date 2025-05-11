const mongoose = require("mongoose");
const logger = require("../utils/logger");
const User = require("../models/user.model");
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    if (process.env.NODE_ENV !== "test") {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    const existingAdmin = await User.findOne({
      email: process.env.ROOT_USER_EMAIL,
    });

    if (!existingAdmin) {
      await User.create({
        name: process.env.ROOT_USER,
        email: process.env.ROOT_USER_EMAIL,
        password: process.env.ROOT_USER_PASSWORD,
        role: "admin",
      });
      console.log("User Data is ", existingAdmin);
      console.log(" ✅  Admin user created successfully.");
    } else {
      console.log(" ℹ️  Admin user already exists.");
    }
  } catch (error) {
    logger.error("MongoDB connection failed:", error);
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

