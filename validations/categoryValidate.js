const { Joi } = require("express-joi-validations");

const createCategory = Joi.object({
  name: Joi.string().trim().min(3).required(),
});

const deleteCategory = Joi.object({
  id: Joi.string().required(),
});

module.exports = { createCategory, deleteCategory };
