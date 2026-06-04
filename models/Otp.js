const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createAt: { type: Date, default: Date.now, expires: 300 },
});

module.exports = mongoose.model("Otp", otpSchema);
