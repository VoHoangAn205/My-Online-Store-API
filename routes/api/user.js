const express = require("express");
const router = express.Router();
const userContrl = require("../../controller/userContrl");

router.route("/").get(userContrl.getUserInfo);

router.route("/upgradeToVendor").post(userContrl.upgradeToVendor);

module.exports = router;
