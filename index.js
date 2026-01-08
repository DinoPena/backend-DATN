require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/db");

// Routes
const productRoutes = require("./src/routes/product.routes");
const orderRoutes = require("./src/routes/order.routes");
const paymentRoutes = require("./src/routes/payment.routes");
const overviewRoutes = require("./src/routes/overview.routes");
const chatRoute = require('./src/routes/chat.routes');

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
app.use("/api/admin", overviewRoutes);
app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api/users", require("./src/routes/user.routes"));
app.use("/api/account", require("./src/routes/account.routes"));
app.use("/api/messages", require("./src/routes/message.routes"));
app.use('/api/chatbot', chatRoute);

// ===== Health check =====
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// ===== Start server =====
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});