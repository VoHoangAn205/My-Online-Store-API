const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderItems: [
    {
      name: { type: String, require: true },
      quantity: { type: Number, require: true },
      price: { type: Number, require: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        require: true,
      },
    },
  ],
  status: {
    type: String,
    require: true,
    default: "pending",
    enum: ["pending", "Processing", "shipped", "delivered", "cancelled"],
  },
  totalPrice: { type: Number, require: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.Schema("Order", orderSchema);
