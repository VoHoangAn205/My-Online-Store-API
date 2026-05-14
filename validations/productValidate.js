const { Joi } = require("express-joi-validations");

const createProduct = Joi.object({
  name: Joi.string().required(),
  category: Joi.array().items(Joi.string()).min(1).required(),
  gallery: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  stock: Joi.number().required(),
});

module.exports = { createProduct };
