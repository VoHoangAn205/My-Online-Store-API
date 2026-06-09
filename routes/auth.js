const express = require("express");
const router = express.Router();
const authContrl = require("../controller/authContrl");
const loginValidate = require("../validations/loginValidate");
const validateBody = require("../middleware/validateBody");

router.route("/").post(validateBody(loginValidate), authContrl.handleLogin);

module.exports = router;
``;
