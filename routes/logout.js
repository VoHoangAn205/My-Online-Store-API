const express = require("express");
const logoutContrl = require("../controller/logoutContrl");
const router = express.Router();

router.route("/").post(logoutContrl.handleLogout);

module.exports = router;
