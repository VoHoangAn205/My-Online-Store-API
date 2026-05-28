const express = require("express");
const router = express.Router();
const validateBody = require("../../middleware/validateBody");
const { createOrder } = require("../../validations/orderValidate");
const orderContrl = require("../../controller/orderContrl");
const ROLES_LIST = require("../../config/roles_list");
const verifyRole = require("../../middleware/verifyRole");

router.post(
  "/",
  // verifyRole(ROLES_LIST.User),
  validateBody(createOrder),
  orderContrl.createOrder,
);

module.exports = router;
