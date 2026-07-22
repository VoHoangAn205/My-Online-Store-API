const { Joi } = require("express-joi-validations");

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const cartValidate = Joi.object({
  productId: Joi.string().regex(objectIdPattern).required().messages({
    "string.pattern.base":
      '"productId" must be a valid 24-character hex MongoDB ObjectId',
  }),
});

module.exports = { cartValidate };
