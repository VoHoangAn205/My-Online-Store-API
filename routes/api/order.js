const express = require("express");
const router = express.Router();
const validateBody = require("../../middleware/validateBody");
const { createOrder } = require("../../validations/orderValidate");
const orderContrl = require("../../controller/orderContrl");
const ROLES_LIST = require("../../config/roles_list");
const verifyRole = require("../../middleware/verifyRole");
const { Order } = require("../../models/Order");

router.post("/", validateBody(createOrder), orderContrl.createOrder);

router.get("/getAllParents", orderContrl.getAllParentOrder);

router.get(
  "/getShopOrders",
  verifyRole(ROLES_LIST.Salesman, ROLES_LIST.Admin),
  orderContrl.getSubOrder,
);

module.exports = router;
