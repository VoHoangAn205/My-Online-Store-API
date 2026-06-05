const express = require("express");
const router = express.Router();
const otpContrl = require("../controller/otpContrl");

router.route("/").post(otpContrl.handleRequestOtp);

module.exports = router;
