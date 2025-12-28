const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, orderController.getAllOrders);

router.post("/", orderController.createOrder);

router.get("/:id", orderController.getOrderById);


module.exports = router;