const express = require("express");
const router = express.Router();

const messageController = require("../controllers/message.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

// user gửi message
router.post("/", messageController.createMessage);

// admin xem message
router.get("/", authMiddleware, isAdmin, messageController.getAllMessages);

module.exports = router;
