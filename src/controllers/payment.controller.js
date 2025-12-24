const Payment = require("../models/payment.model");
const Order = require("../models/order.model");

exports.createPayment = async (req, res) => {
  try {
    const { orderId, method, amount } = req.body;

    // 1. Kiểm tra order tồn tại
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 2. Tạo payment
    const payment = new Payment({
      order: orderId,
      method: method || "COD",
      amount
    });

    // 3. Giả lập COD → thanh toán thành công
    if (method === "COD") {
      payment.status = "paid";
      order.status = "paid";
      await order.save();
    }

    const savedPayment = await payment.save();

    res.status(201).json(savedPayment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
