const { Joi } = require("express-joi-validations");

const uploadImage = Joi.object({
  url: Joi.string().required().message("your image file is required"),
  public_id: Joi.string().required(),
});

module.exports = { uploadImage };
