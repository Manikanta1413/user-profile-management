const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload");
const {
  registerSchema,
  updateUserSchema,
  validateBody,
} = require("../validations/userValidation");

// Get all users (Admin only)
router.get("/", protect, authorize("admin"), userController.getAllUsers);

// Get single user (Admin & self)
router.get(
  "/:id",
  protect,
  authorize("admin", "user"),
  userController.getUserById
);

// Create new user (Admin only) with validation
router.post(
  "/",
  protect,
  authorize("admin"),
  validateBody(registerSchema),
  userController.createUser
);

// Update user (Admin & self) with validation
router.put(
  "/:id",
  protect,
  authorize("admin", "user"),
  validateBody(updateUserSchema),
  userController.updateUser
);

// Upload profile picture (Admin or self)
router.put(
  "/:id/profile-picture",
  protect,
  authorize("admin", "user"),
  upload.single("profilePicture"),
  userController.updateProfilePicture
);

// Delete user (Admin only)
router.delete("/:id", protect, authorize("admin"), userController.deleteUser);

module.exports = router;
