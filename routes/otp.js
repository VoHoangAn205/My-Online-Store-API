const express = require("express");
const router = express.Router();
const otpContrl = require("../controller/otpContrl");

router.route("/").post(otpContrl.requestRegistrationOtp);

module.exports = router;
