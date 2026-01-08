const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem"
      }
    ],
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending"
    },
    cancelledReason: {
      type: String,
      default: ""
    },

    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    cancelledAt: {
      type: Date
    }
  }, { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
