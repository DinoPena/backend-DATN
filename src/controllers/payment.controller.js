const Payment = require("../models/payment.model");
const Order = require("../models/order.model");
const { successResponse, errorResponse } = require("../utils/response");

exports.createPayment = async (req, res) => {
  try {
    const { orderId, method, amount } = req.body;
    const paymentMethod = method?.toLowerCase();

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const payment = new Payment({
      order: orderId,
      method: paymentMethod,
      amount
    });
    

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

    if (!["paid", "failed"].includes(status)) {
      return res.status(400).json({
        message: "Invalid payment status"
      });
    }

    const payment = await Payment.findById(req.params.id).populate("order");
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status !== "pending") {
      return res.status(400).json({
        message: "Payment already processed"
      });
    }

    payment.status = status;
    await payment.save();

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


exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("order");
    return successResponse(res, payments);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};




