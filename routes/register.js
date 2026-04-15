const express = require("express");
const router = express.Router();

router.post("/", require("../controller/registerContrl"));

module.exports = router;
