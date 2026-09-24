const express = require("express");
const router = express.Router();
const validateBody = require("../../middleware/validateBody");
const cartContrl = require("../../controller/cartContrl");
const { cartValidate } = require("../../validations/cartValidate");

router
  .route("/")
  .get(cartContrl.getCart)
  .put(validateBody(cartValidate), cartContrl.updateCart);

router.delete("/:id", cartContrl.deleteCart);

module.exports = router;
