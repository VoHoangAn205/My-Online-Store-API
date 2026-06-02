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
    subStatus: {
      type: String,
      require: true,
      default: "pending",
      enum: ["pending", "Processing", "shipped", "delivered", "cancelled"],
    },
    subTotalPrice: { type: Number, require: true },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);
const SubOrder = mongoose.model("SubOrder", subOrderSchema);
module.exports = { Order, SubOrder };
// const orderSchema = new Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     orderItems: [
//       {
//         name: { type: String, require: true },
//         quantity: { type: Number, require: true },
//         price: { type: Number, require: true },
//         product: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Product",
//           require: true,
//         },
//       },
//     ],
//     status: {
//       type: String,
//       require: true,
//       default: "pending",
//       enum: ["pending", "Processing", "shipped", "delivered", "cancelled"],
//     },
//     totalPrice: { type: Number, require: true },
//   },
//   { timestamps: true },
// );
