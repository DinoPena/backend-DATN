const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

router.get("/", authMiddleware, isAdmin, orderController.getAllOrders);

router.get("/my-orders", authMiddleware, orderController.getMyOrders);

router.post("/", authMiddleware, orderController.createOrder);

router.get("/:id", authMiddleware, orderController.getOrderById);



module.exports = router;