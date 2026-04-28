const { Joi } = require("express-joi-validations");

const createProductForm = Joi.object({
  name: Joi.string().required(),
  category: Joi.array().required(),
  price: Joi.number().required(),
  stock: Joi.number().required(),
});
