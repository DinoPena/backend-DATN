const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

// POST /api/payments
router.post("/", paymentController.createPayment);

// GET payment theo order
router.get("/order/:orderId", paymentController.getPaymentsByOrder);

// ADMIN – get all payments
router.get("/", authMiddleware, isAdmin, paymentController.getAllPayments);

// PUT /api/payments/:id/status
router.put("/:id/status", authMiddleware, isAdmin, paymentController.updatePaymentStatus);

module.exports = router;
