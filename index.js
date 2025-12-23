require('dotenv').config();
const express = require ('express')
const port = 3000
const hostname = 'localhost'
const cors = require('cors');
const dotenv = require("dotenv");
const connectDB = require('./src/config/db');
const orderRoutes = require("./src/routes/order.routes");

dotenv.config();
connectDB();

const app = express()

app.use(express.json());

app.use("/api/orders", require("./src/routes/order.routes"));

app.use("/api/products", require("./src/routes/product.routes"));

app.use(cors());

app.get('/home', (req, res) => {
  res.send('Hello World')
})

app.listen(port,hostname , () => {
    console.log(`Server is running on http://${hostname}:${port}`)
})
