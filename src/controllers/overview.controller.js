const Product = require("../models/product.model");
const Order = require("../models/order.model");
const User = require("../models/user.model");

exports.getOverviewStats = async (req, res) => {
  try {
    const [productCount, orderCount, userCount] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments()
    ]);

    res.json({
      success: true,
      data: {
        products: productCount,
        orders: orderCount,
        users: userCount
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};
