const express = require("express");
const router = express.Router();
const productController = require("../../controller/productContrl");
const verifyRole = require("../../middleware/verifyRole");
const ROLES_LIST = require("../../config/roles_list");
const validateBody = require("../../middleware/validateBody");
const productValidate = require("../../validations/productValidate");
const verifyJWT = require("../../middleware/verifyJWT");

router
  .route("/")
  .get(productController.getAllProductsContrl)
  .post(
    verifyJWT,
    verifyRole(ROLES_LIST.Salesman),
    validateBody(productValidate.createProduct),
    productController.createProductContrl,
  );

module.exports = router;
