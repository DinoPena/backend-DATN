const Order = require("../models/order.model");
const OrderItem = require("../models/order-item.model");
const { successResponse, errorResponse } = require("../utils/response");

exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return errorResponse(res, "Cart is empty", 400);
    }

    let totalAmount = 0;
    const orderItemIds = [];

    for (const item of items) {
      const orderItem = new OrderItem({
        product: item.product,
        quantity: item.quantity,
        price: item.price
      });

      const savedItem = await orderItem.save();
      orderItemIds.push(savedItem._id);

      totalAmount += item.price * item.quantity;
    }

    const order = new Order({
      user: req.user.id,
      items: orderItemIds,
      totalAmount
    });

    const savedOrder = await order.save();
    return successResponse(res, savedOrder, 201);    
  } catch (error) {
    return errorResponse(res, error.message);
  }
};


// GET /api/orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "items",
        populate: {
          path: "product",
          model: "Product"
        }
      });

    return successResponse(res, orders);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// GET /api/orders/:id
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

    // Nếu không phải admin → chỉ xem order của mình
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

// GET /api/orders/my-orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate({
        path: "items",
        populate: {
          path: "product",
          model: "Product"
        }
      });

    return successResponse(res, orders);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

