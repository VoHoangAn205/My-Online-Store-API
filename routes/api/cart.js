const express = require("express");
const router = express.Router();
const validateBody = require("../../middleware/validateBody");
const verifyJWT = require("../../middleware/verifyJWT");
const cartContrl = require("../../controller/cartContrl");
const { cartValidate } = require("../../validations/cartValidate");
const verifyRole = require("../../middleware/verifyRole");
const ROLE_LIST = require("../../config/roles_list");

router
  .route("/")
  .get(cartContrl.getCart)
  .put(
    verifyRole(ROLE_LIST.Salesman, ROLE_LIST.Admin),
    validateBody(cartValidate),
    cartContrl.updateCart,
  );

module.exports = router;
