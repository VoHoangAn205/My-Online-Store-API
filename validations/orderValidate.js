const { Joi } = require("express-joi-validations");

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const createOrder = Joi.object({
  cartItems: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().regex(objectIdPattern).required().messages({
          "string.pattern.base":
            '"productId" must be a valid 24-character hex MongoDB ObjectId',
        }),
        quantity: Joi.number().integer().min(1).required(),
      }),
    )
    .min(1),
});

module.exports = { createOrder };
