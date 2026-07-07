const express = require("express");
const router = express.Router();
const userContrl = require("../../controller/userContrl");

router.route("/").get(userContrl.getUserInfo);

module.exports = router;
