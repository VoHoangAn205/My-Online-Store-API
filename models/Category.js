const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Category", categorySchema);
