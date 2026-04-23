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
    require: true,
  },
  price: { type: Number, required: true },
  stock: { type: Number, require: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
