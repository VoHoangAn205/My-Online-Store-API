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
  .put(validateBody(cartValidate), cartContrl.updateCart);

router.delete("/:id", cartContrl.deleteCart);

module.exports = router;
