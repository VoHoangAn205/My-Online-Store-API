const express = require("express");
const refreshTokenContrl = require("../controller/refreshTokenContrl");
const router = express.Router();

router.route("/").post(refreshTokenContrl.handleRefreshToken);

module.exports = router;
