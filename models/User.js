const mongoose = require("mongoose");
const ROLE_LIST = require("../config/roles_list");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [Number],
      default: [ROLE_LIST.User],
    },
    invalidLoginCount: {
      type: Number,
      default: 0,
    },
    refreshToken: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
