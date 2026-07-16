const { Joi } = require("express-joi-validations");

const createProduct = Joi.object({
  name: Joi.string().required(),
  category: Joi.array().items(Joi.string()).min(1).required(),
  gallery: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().min(1).required(),
  status: Joi.string().valid("Available", "Sold out", "Discontinued"),
  stock: Joi.number().integer().min(0).required(),
});

// const updateProduct = createProduct.fork(
//   ["name", "price", "stock", "description", "category"],
//   (schema) => schema.optional(),
// );

const updateProduct = Joi.object({
  name: Joi.string(),
  category: Joi.array().items(Joi.string()).min(1),
  description: Joi.string(),
  price: Joi.number().min(1),
  stock: Joi.number().integer().min(0),
});

module.exports = { createProduct, updateProduct };
