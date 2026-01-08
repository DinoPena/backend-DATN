const Order = require("../models/order.model");
const OrderItem = require("../models/order-item.model");
const Product = require("../models/product.model");
const { successResponse, errorResponse } = require("../utils/response");

// ================= CREATE ORDER =================
exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return errorResponse(res, "Cart is empty", 400);
    }

    let totalAmount = 0;
    const orderItemIds = [];

    // 1️⃣ CHECK STOCK
    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return errorResponse(res, "Product not found", 404);
      }

      if (product.stock < item.quantity) {
        return errorResponse(
          res,
          `Product "${product.name}" only has ${product.stock} items left`,
          400
        );
      }
    }

    // 2️⃣ SAVE ORDER ITEMS + TRỪ STOCK
    for (const item of items) {
      const orderItem = new OrderItem({
        product: item.product,
        quantity: item.quantity,
        price: item.price
      });

      const savedItem = await orderItem.save();
      orderItemIds.push(savedItem._id);

      totalAmount += item.price * item.quantity;

      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    // 3️⃣ SAVE ORDER
    const order = new Order({
      user: req.user.id,
      items: orderItemIds,
      totalAmount,
      status: "pending"
    });

    const savedOrder = await order.save();
    return successResponse(res, savedOrder, 201);

  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// ================= GET ALL ORDERS (ADMIN) =================
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username email")
      .populate({
        path: "items",
        populate: {
          path: "product",
          model: "Product"
        }
      })
      .sort({ createdAt: -1 });

    return successResponse(res, orders);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// ================= GET ORDER BY ID =================
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: "items",
        populate: {
          path: "product",
          model: "Product"
        }
      });

    if (!order) {
      return errorResponse(res, "Order not found", 404);
    }

    if (
      req.user.role !== "admin" &&
      order.user.toString() !== req.user.id
    ) {
      return errorResponse(res, "Forbidden", 403);
    }

    return successResponse(res, order);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

// ================= GET MY ORDERS =================
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .select(
        "items totalAmount status createdAt cancelledReason cancelledBy cancelledAt"
      )
      .populate({
        path: "items",
        populate: {
          path: "product",
          select: "name price image"
        }
      })
      .sort({ createdAt: -1 });


    return successResponse(res, orders);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// ================= UPDATE ORDER STATUS (ADMIN) =================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "paid", "cancelled"].includes(status)) {
      return errorResponse(res, "Invalid status", 400);
    }

    const order = await Order.findById(req.params.id)
      .populate("items");

    if (!order) {
      return errorResponse(res, "Order not found", 404);
    }

    // ❌ Không cho đổi trạng thái nếu đã xử lý
    if (order.status !== "pending") {
      return errorResponse(res, "Order status cannot be changed", 400);
    }

    // 🔁 Hoàn stock khi huỷ
    if (status === "cancelled") {
      return errorResponse(
        res,
        "Use cancel endpoint to cancel order with reason",
        400
      );
    }

    order.status = status;
    await order.save();

    return successResponse(res, order);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// ================= CANCEL ORDER (ADMIN) =================
exports.cancelOrder = async (req, res) => {
  const { reason } = req.body;

  if (!reason) {
    return res.status(400).json({
      success: false,
      message: "Cancel reason is required"
    });
  }

  const order = await Order.findById(req.params.id).populate("items");
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  if (order.status === "cancelled") {
    return res.status(400).json({ success: false, message: "Order already cancelled" });
  }

  order.status = "cancelled";
  order.cancelledReason = reason;
  order.cancelledBy = req.user.id; // admin
  order.cancelledAt = new Date();

  for (const item of order.items) {
    if (!item.product) continue;

    await Product.findByIdAndUpdate(
      item.product,
      { $inc: { stock: item.quantity } }
    );
  }
  await order.save();

  res.json({
    success: true,
    message: "Order cancelled successfully",
    data: order
  });
};



