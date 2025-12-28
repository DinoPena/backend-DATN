require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/db");

// Routes
const productRoutes = require("./src/routes/product.routes");
const orderRoutes = require("./src/routes/order.routes");
const paymentRoutes = require("./src/routes/payment.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== Database =====
connectDB();

// ===== Routes =====
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/auth", require("./src/routes/auth.routes"));

// ===== Health check =====
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// ===== Start server =====
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});