const { Joi } = require("express-joi-validations");

const otpValidate = Joi.object({
  email: Joi.string().email().required(),
});

module.exports = otpValidate;
