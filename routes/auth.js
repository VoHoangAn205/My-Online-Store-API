const express = require("express");
const router = express.Router();
const authContrl = require("../controller/authContrl");

router.route("/").post(authContrl.handleLogin);

module.exports = router;
``;
