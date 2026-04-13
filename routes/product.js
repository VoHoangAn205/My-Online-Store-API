const express = require("express");
const router = express.Router();
const productController = require("../controller/productContrl");

router.get("/").get(productController.getAllProductsContrl);
