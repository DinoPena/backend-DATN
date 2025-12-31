const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

router.get("/", productController.getAllProducts);
router.post("/", authMiddleware, isAdmin, productController.createProduct);

module.exports = router;