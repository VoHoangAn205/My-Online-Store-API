const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  imageUrl: { type: String },
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
