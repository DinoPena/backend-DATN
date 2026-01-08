const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

router.get("/", authMiddleware, isAdmin, userController.getAllUsers);

router.patch("/:id/role", authMiddleware, isAdmin, userController.updateUserRole);

router.patch("/:id/reset-password", authMiddleware, isAdmin, userController.adminResetPassword);

router.delete("/:id", authMiddleware, isAdmin, userController.deleteUser);

router.patch("/:id/toggle-status", authMiddleware, isAdmin, userController.toggleUserStatus);

module.exports = router;
