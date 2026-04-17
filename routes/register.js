const express = require("express");
const router = express.Router();
const registerContrl = require("../controller/registerContrl");

router.route("/").post(registerContrl.handleRegister);

module.exports = router;
