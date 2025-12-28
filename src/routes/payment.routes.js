const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const { createPayment, getPaymentsByOrder, updatePaymentStatus, confirmPaypalPayment} = require("../controllers/payment.controller");

// POST /api/payments
router.post("/", paymentController.createPayment);

// GET payment theo order
router.get("/order/:orderId", paymentController.getPaymentsByOrder);

// PUT /api/payments/:id/status
router.put("/:id/status", updatePaymentStatus);

// Fake PayPal confirm
router.post("/paypal/confirm", confirmPaypalPayment);

module.exports = router;
