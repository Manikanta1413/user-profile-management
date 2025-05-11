const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { registerSchema } = require("../validations/userValidation");
const logger = require("../utils/logger");

// GET /api/users
exports.getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit = Math.max(1, parseInt(req.query.limit)) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;
    const role = req.query.role;
    const search = req.query.search;

    const query = { role: role || "user" };
    if (search) query.name = { $regex: search, $options: "i" };

    const users = await User.find(query)
      .select("-password")
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    logger.info(`📄 Fetched ${users.length} users - Page ${page}`);

    res
      .status(200)
      .json({ success: true, page, totalPages, totalUsers, users });
  } catch (err) {
    logger.error(`❌ Error fetching users: ${err.message}`);
    next(err);
  }
};

// GET /api/users/:id
exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      logger.warn(`❗ Invalid user ID: ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      logger.warn(`🚫 User not found: ID ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    if (
      req.user.role !== "admin" &&
      req.user.id.toString() !== userId.toString()
    ) {
      logger.warn(`🔐 Unauthorized user access attempt by ${req.user.email}`);
      return res.status(403).json({ message: "Unauthorized access" });
    }

    logger.info(`👁️ User fetched: ${user.email}`);
    res.json(user);
  } catch (err) {
    logger.error(`❌ Error fetching user by ID: ${err.message}`);
    next(err);
  }
};

// POST /api/users
exports.createUser = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      logger.warn("📨 Empty payload received on /createUser");
      return res.status(400).json({ message: "Payload is required" });
    }

    const { name, email, password, phoneNumber, address, role } = req.body;

    if (!name || !email || !password) {
      logger.warn("❗ Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`🚫 Attempt to create user with existing email: ${email}`);
      return res.status(400).json({ message: "Email already in use" });
    }

    let finalRole = "user";
    if (role === "admin") {
      if (req.user?.role === "admin") {
        finalRole = "admin";
      } else {
        logger.warn(
          `🚫 Unauthorized admin role assignment attempt by ${req.user.email}`
        );
        return res
          .status(403)
          .json({ message: "Not authorized to assign admin role" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
      role: finalRole,
    });

    logger.info(`✅ User created: ${email}`);
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (err) {
    logger.error(`❌ Error creating user: ${err.message}`);
    next(err);
  }
};

// PUT /api/users/:id
exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      logger.warn(`❗ Invalid user ID for update: ${userId}`);
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (req.user.role !== "admin" && req.user._id.toString() !== userId) {
      logger.warn(`🔐 Unauthorized update attempt by ${req.user.email}`);
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    const updateData = { ...req.body };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      logger.warn(`🚫 User not found during update: ID ${userId}`);
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    logger.info(`📝 User updated: ${updatedUser.email}`);
    res.json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    logger.error(`❌ Error updating user: ${err.message}`);
    next(err);
  }
};

// DELETE /api/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      logger.warn(`❗ Invalid user ID for deletion: ${userId}`);
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (req.user.role !== "admin" && req.user._id.toString() !== userId) {
      logger.warn(`🔐 Unauthorized delete attempt by ${req.user.email}`);
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized to delete this user" });
    }

    const user = await User.findById(userId);
    if (!user) {
      logger.warn(`🚫 Delete failed. User not found: ID ${userId}`);
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await User.findByIdAndDelete(userId);

    logger.info(`🗑️ User deleted: ${user.email}`);
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    logger.error(`❌ Error deleting user: ${err.message}`);
    next(err);
  }
};

// PUT /api/users/:id/profile-picture
exports.updateProfilePicture = async (req, res, next) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      logger.warn(`❗ Invalid user ID for profile update: ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.role !== "admin" && req.user._id.toString() !== userId) {
      logger.warn(
        `🔐 Unauthorized profile picture update by ${req.user.email}`
      );
      return res
        .status(403)
        .json({ message: "Unauthorized to update this profile picture" });
    }

    if (!req.file) {
      logger.warn("🚫 No file uploaded for profile picture update");
      return res
        .status(400)
        .json({ message: "No file uploaded or invalid file type" });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: imagePath },
      { new: true }
    );

    if (!updatedUser) {
      fs.unlinkSync(path.join(__dirname, "..", imagePath));
      logger.warn(
        `🚫 User not found during profile picture update: ID ${userId}`
      );
      return res.status(404).json({ message: "User not found" });
    }

    logger.info(`🖼️ Profile picture updated for user: ${updatedUser.email}`);
    res
      .status(200)
      .json({ message: "Profile picture updated", data: updatedUser });
  } catch (err) {
    logger.error(`❌ Error updating profile picture: ${err.message}`);
    next(err);
  }
};
