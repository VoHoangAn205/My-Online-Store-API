const { Joi } = require("express-joi-validations");

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const cartValidate = Joi.object({
  product: Joi.string().regex(objectIdPattern).required().messages({
    "string.pattern.base":
      '"product id" must be a valid 24-character hex MongoDB ObjectId',
  }),
  quantity: Joi.number().integer(),
});

module.exports = { cartValidate };
