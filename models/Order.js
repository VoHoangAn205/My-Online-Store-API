const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subOrders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubOrder",
      },
    ],
    totalPrice: Number,
  },
  { timestamps: true },
);

const subOrderSchema = new Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parentOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    subStatus: {
      type: String,
      required: true,
      default: "pending",
      enum: ["pending", "Processing", "shipped", "delivered", "cancelled"],
    },
    subTotalPrice: { type: Number, required: true },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);
const SubOrder = mongoose.model("SubOrder", subOrderSchema);
module.exports = { Order, SubOrder };
