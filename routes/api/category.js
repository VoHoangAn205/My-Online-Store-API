const express = require("express");
const router = express.Router();
const categoryContrl = require("../../controller/categoryContrl");
const validateBody = require("../../middleware/validateBody");
const categoryValidate = require("../../validations/categoryValidate");
const verifyJWT = require("../../middleware/verifyJWT");

router
  .route("/")
  .get(categoryContrl.getAllCategory)
  .post(
    verifyJWT,
    validateBody(categoryValidate.createCategory),
    categoryContrl.createCategory,
  )
  .delete(
    verifyJWT,
    validateBody(categoryValidate.deleteCategory),
    categoryContrl.deleteCategory,
  );

module.exports = router;
