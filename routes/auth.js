const express = require("express");
const router = express.Router();

router.post("/", require("../controller/authContrl"));

module.exports = router;
