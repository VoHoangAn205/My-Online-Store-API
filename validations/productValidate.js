const { Joi } = require("express-joi-validations");

const createProduct = Joi.object({
  name: Joi.string().required(),
  category: Joi.array().items(Joi.string()).min(1).required(),
  gallery: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().min(1).required(),
  stock: Joi.number().integer().min(0).required(),
});

const updateProduct = createProduct.fork(
  ["name", "price", "stock", "description", "category", "gallery"],
  (schema) => schema.optional(),
);

module.exports = { createProduct, updateProduct };
