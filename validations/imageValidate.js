const { Joi } = require("express-joi-validations");

const uploadImage = Joi.object({
  url: Joi.string()
    .required()
    .messages({ "any.required": "your image's file is required or invalid" }),
  public_id: Joi.string().required(),
});

const uploadGallery = Joi.array().items(
  Joi.object({
    url: Joi.string().required(),
    public_id: Joi.string().required(),
  })
    .min(1)
    .max(5)
    .messages({
      "array.base": "your image's file is invalid",
      "any.required": "Images are required",
    }),
);

module.exports = { uploadImage, uploadGallery };
