const express = require("express");
const router = express.Router();
const productContrl = require("../../controller/productContrl");
const verifyRole = require("../../middleware/verifyRole");
const ROLES_LIST = require("../../config/roles_list");
const validateBody = require("../../middleware/validateBody");
const productValidate = require("../../validations/productValidate");
const verifyJWT = require("../../middleware/verifyJWT");

router
  .route("/")
  .get(productContrl.getAllProductsContrl)
  .post(
    verifyJWT,
    verifyRole(ROLES_LIST.Salesman),
    validateBody(productValidate.createProduct),
    productContrl.createProductContrl,
  );

router.route("/detail/:id").get(productContrl.getOneProductContrl);

module.exports = router;
