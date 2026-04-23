const express = require("express");
const router = express.Router();
const categoryContrl = require("../../controller/categoryContrl");

router.route("/").post(categoryContrl.createCategory);

module.exports = router;
