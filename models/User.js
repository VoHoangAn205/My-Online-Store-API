const { Schema } = require("mongoose");

const userSchema = new Schema({
  userName: {
    type: String,
    require: true,
  },
  pwd: {
    type: String,
    require: true,
  },
  roles: {
    User: {
      type: Number,
      default: 2001,
    },
    Admin: Number,
    Salesman: Number,
  },
  createTime: {
    type: Date,
    default: Date.now,
  },
  refreshToken: String,
});
