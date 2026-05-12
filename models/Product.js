const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    Gallery: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gallery",
      },
    ],
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
