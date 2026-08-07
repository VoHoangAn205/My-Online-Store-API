const express = require("express");
const router = express.Router();
const otpContrl = require("../controller/otpContrl");
const validateBody = require("../middleware/validateBody");
const otpValidate = require("../validations/otpValidate");

router
  .route("/")
  .post(validateBody(otpValidate), otpContrl.requestRegistrationOtp);

module.exports = router;
