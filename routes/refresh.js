const express = require("express");
const refreshTokenContrl = require("../controller/refreshTokenContrl");
const router = express.Router();

router.route("/").get(refreshTokenContrl.handleRefreshToken);

module.exports = router;
