const express = require("express");
const router = express.Router();
const productController = require("../controller/productContrl");

router
  .get("/", productController.getAllProductsContrl)
  .post("/", productController.createProductContrl);

module.exports = router;
