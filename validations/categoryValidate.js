const { Joi } = require("express-joi-validations");

const createCategory = Joi.object({
  name: Joi.string().required(),
});

const deleteCategory = Joi.object({
  id: Joi.string().required(),
});

module.exports = { createCategory, deleteCategory };
