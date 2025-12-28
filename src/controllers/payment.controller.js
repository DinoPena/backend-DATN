const Payment = require("../models/payment.model");
const Order = require("../models/order.model");

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
    const paymentId = req.params.id;

    // 1. Validate status
    if (!["paid", "failed"].includes(status)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    // 2. Find payment
    const payment = await Payment.findById(paymentId).populate("order");
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // 3. Update payment
    payment.status = status;
    await payment.save();

    // 4. Sync order status
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

exports.confirmPaypalPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const payment = await Payment.findById(paymentId).populate("order");
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.method !== "paypal") {
      return res.status(400).json({ message: "Not a PayPal payment" });
    }

    // giả lập paypal success
    payment.status = "paid";
    await payment.save();

    payment.order.status = "paid";
    await payment.order.save();

    res.status(200).json({
      message: "PayPal payment successful",
      payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};