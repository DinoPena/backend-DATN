const Message = require("../models/message.model");
const { successResponse, errorResponse } = require("../utils/response");

// USER gửi message
exports.createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return errorResponse(res, "All fields are required", 400);
    }

    const newMessage = await Message.create({
      name,
      email,
      message
    });

    return successResponse(res, newMessage, 201);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// ADMIN xem tất cả message
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: -1 });

    return successResponse(res, messages);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};
