const express = require("express");
const router = express.Router();
const productController = require("../../controller/productContrl");
const verifyRole = require("../../middleware/verifyRole");
const ROLES_LIST = require("../../config/roles_list");

router
  .route("/")
  .get(productController.getAllProductsContrl)
  .post(verifyRole(ROLES_LIST.Salesman), productController.createProductContrl);

module.exports = router;
