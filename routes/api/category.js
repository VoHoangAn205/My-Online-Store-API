const express = require("express");
const router = express.Router();
const categoryContrl = require("../../controller/categoryContrl");
const validateBody = require("../../middleware/validateBody");
const categoryJoiSchema = require("../../validations/categoryValidate");

router
  .route("/")
  .get(categoryContrl.getAllCategory)
  .post(
    validateBody(categoryJoiSchema.createCategoryForm),
    categoryContrl.createCategory,
  )
  .delete(
    validateBody(categoryJoiSchema.deleteCategoryForm),
    categoryContrl.deleteCategory,
  );

module.exports = router;
