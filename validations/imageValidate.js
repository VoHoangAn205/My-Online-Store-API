const { Joi } = require("express-joi-validations");

const uploadImage = Joi.object({
  url: Joi.string()
    .required()
    .messages({ "any.required": "your image's file is required or invalid" }),
  public_id: Joi.string().required(),
});

module.exports = { uploadImage };
