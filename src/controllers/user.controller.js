const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { successResponse, errorResponse } = require("../utils/response");


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return successResponse(res, users);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return errorResponse(res, "Invalid role", 400);
    }

    if (req.user.id === req.params.id) {
      return errorResponse(res, "Cannot change your own role", 400);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    return successResponse(res, user);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return errorResponse(res, "Cannot delete your own account", 400);
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    return successResponse(res, "User deleted");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

exports.adminResetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return errorResponse(res, "Password too short", 400);
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { password: hashed },
      { new: true }
    );

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    return successResponse(res, "Password reset success");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return errorResponse(res, "Cannot change your own status", 400);
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    user.isActive = !user.isActive;
    await user.save();

    return successResponse(res, {
      id: user._id,
      isActive: user.isActive
    });
  } catch (err) {
    return errorResponse(res, err.message);
  }
};


