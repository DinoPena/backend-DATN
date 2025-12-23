const Order = require("../models/order.model");
const OrderItem = require("../models/order-item.model");

exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
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
      items: orderItemIds,
      totalAmount
    });

    const savedOrder = await order.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items")
      .populate("items.product");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
