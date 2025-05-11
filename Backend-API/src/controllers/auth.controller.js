// src/controllers/auth.controller.js
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const logger = require("../utils/logger");

// JWT generator
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      logger.warn("📨 Empty payload received on /register");
      res.status(400);
      throw new Error("Payload is required");
    }

    const { name, email, password, phoneNumber, address } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      logger.warn(`🚫 Registration attempt with existing email: ${email}`);
      res.status(400);
      throw new Error("User already exists");
    }

    const newUser = await User.create({
      name,
      email,
      password,
      phoneNumber,
      address,
    });

    logger.info(`✅ New user registered: ${email}`);

    const token = generateToken(newUser);

    res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        message: "User registered successfully",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
  } catch (error) {
    logger.error(`❌ Register failed: ${error.message}`);
    next(error);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      logger.warn("📨 Empty payload received on /login");
      res.status(400);
      throw new Error("Payload is required");
    }

    const email = req.body.email?.trim();
    const password = req.body.password?.trim();

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      logger.warn(`🚫 Login failed for non-existent user: ${email}`);
      res.status(401);
      throw new Error("Invalid credentials");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn(`🚫 Password mismatch for user: ${email}`);
      res.status(401);
      throw new Error("Invalid credentials");
    }

    const token = generateToken(user);

    logger.info(`✅ User logged in: ${email}`);

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        message: "Login successful",
        user: {
          token,
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    logger.error(
      `❌ Login error for ${req.body.email || "unknown user"}: ${error.message}`
    );
    next(error);
  }
};

// POST /api/auth/logout
exports.logout = (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ message: "Logged out successfully" });
  logger.info("👋 User logged out");
};
