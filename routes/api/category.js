const express = require("express");
const router = express.Router();
const categoryContrl = require("../../controller/categoryContrl");
const validateBody = require("../../middleware/validateBody");
const categoryValidate = require("../../validations/categoryValidate");

router
  .route("/")
  .get(categoryContrl.getAllCategory)
  .post(
    validateBody(categoryValidate.createCategory),
    categoryContrl.createCategory,
  )
  .delete(
    validateBody(categoryValidate.deleteCategory),
    categoryContrl.deleteCategory,
  );

module.exports = router;
