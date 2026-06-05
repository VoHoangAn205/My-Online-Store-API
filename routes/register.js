const express = require("express");
const router = express.Router();
const registerContrl = require("../controller/registerContrl");
const registerValidate = require("../validations/registerValidate");
const validateBody = require("../middleware/validateBody");

router
  .route("/")
  .post(validateBody(registerValidate), registerContrl.handleRegister);

module.exports = router;
