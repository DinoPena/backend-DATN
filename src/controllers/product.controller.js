const Product = require("../models/product.model");
const { successResponse, errorResponse } = require("../utils/response");

// GET /api/products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return successResponse(res, products);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};