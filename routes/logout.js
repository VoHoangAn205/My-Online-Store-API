const express = require("express");
const logoutContrl = require("../controller/logoutControl");
const router = express.Router();

router.route("/").get(logoutContrl.handleLogout);

module.exports = router;
