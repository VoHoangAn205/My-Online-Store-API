const express = require("express");
const router = express.Router();
const categoryContrl = require("../../controller/categoryContrl");
const validateBody = require("../../middleware/validateBody");
const categoryValidate = require("../../validations/categoryValidate");
const verifyJWT = require("../../middleware/verifyJWT");
const verifyRole = require("../../middleware/verifyRole");
const ROLES_LIST = require("../../config/roles_list");

router
  .route("/")
  .get(categoryContrl.getAllCategory)
  .post(
    verifyJWT,
    verifyRole(ROLES_LIST.Admin),
    validateBody(categoryValidate.createCategory),
    categoryContrl.createCategory,
  );

router
  .route("/:id")
  .delete(
    verifyJWT,
    verifyRole(ROLES_LIST.Admin),
    categoryContrl.deleteCategory,
  );

module.exports = router;
