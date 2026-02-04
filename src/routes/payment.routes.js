const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

router.post("/", paymentController.createPayment);

router.get("/order/:orderId", paymentController.getPaymentsByOrder);

router.get("/", authMiddleware, isAdmin, paymentController.getAllPayments);

router.put("/:id/status", authMiddleware, isAdmin, paymentController.updatePaymentStatus);

module.exports = router;
