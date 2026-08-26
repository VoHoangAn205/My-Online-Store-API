const { Joi } = require("express-joi-validations");

const createCategory = Joi.object({
  name: Joi.string().trim().min(3).required(),
  emoji: Joi.string().trim().min(2).required(),
});

module.exports = { createCategory };
