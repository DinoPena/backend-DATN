const Payment = require("../models/payment.model");
const Order = require("../models/order.model");
const { successResponse, errorResponse } = require("../utils/response");

exports.createPayment = async (req, res) => {
  try {
    const { orderId, method, amount } = req.body;
    const paymentMethod = method?.toLowerCase();


    // 1. Kiểm tra order tồn tại
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 2. Tạo payment
    const payment = new Payment({
      order: orderId,
      method: paymentMethod,
      amount
    });
    

    // 3. Giả lập COD → thanh toán thành công
    if (paymentMethod === "cod") {
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

exports.getPaymentsByOrder = async (req, res) => {
  try {
    const payments = await Payment.find({
      order: req.params.orderId
    }).populate("order");

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // 1. validate
    if (!["paid", "failed"].includes(status)) {
      return res.status(400).json({
        message: "Invalid payment status"
      });
    }

    // 2. find payment
    const payment = await Payment.findById(req.params.id).populate("order");
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // 3. chỉ cho update nếu đang pending
    if (payment.status !== "pending") {
      return res.status(400).json({
        message: "Payment already processed"
      });
    }

    // 4. update payment
    payment.status = status;
    await payment.save();

    // 5. sync order
    if (status === "paid") {
      payment.order.status = "paid";
    } else {
      payment.order.status = "cancelled";
    }
    await payment.order.save();

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ADMIN – GET all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("order");
    return successResponse(res, payments);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// ADMIN – update payment status


