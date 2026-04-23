const express = require("express");
const router = express.Router();
const categoryContrl = require("../../controller/categoryContrl");

router
  .route("/")
  .get(categoryContrl.getAllCategory)
  .post(categoryContrl.createCategory)
  .delete(categoryContrl.deleteCategory);

module.exports = router;
