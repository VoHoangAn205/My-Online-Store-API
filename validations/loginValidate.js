const { Joi } = require("express-joi-validations");

const loginValidate = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = loginValidate;
