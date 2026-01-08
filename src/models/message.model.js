const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    }
  },
  { timestamps: true } // createdAt = received time
);

module.exports = mongoose.model("Message", messageSchema);