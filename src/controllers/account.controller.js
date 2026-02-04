const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { successResponse, errorResponse } = require("../utils/response");

exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return errorResponse(res, "User not found", 404);
    return successResponse(res, user);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

exports.updateMyProfile = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true }
    ).select("-password");

    return successResponse(res, user);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

exports.changeMyPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return errorResponse(res, "Password too short", 400);
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.user.id, { password: hashed });

    return successResponse(res, "Password changed");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};
