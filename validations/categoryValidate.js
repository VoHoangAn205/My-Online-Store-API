const { Joi } = require("express-joi-validations");

const createCategoryForm = Joi.object({
  name: Joi.string().required(),
});

const deleteCategoryForm = Joi.object({
  id: Joi.string().required(),
});

module.exports = { createCategoryForm, deleteCategoryForm };
