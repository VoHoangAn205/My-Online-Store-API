const { Joi } = require("express-joi-validations");

const passwordRegex = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
);

const registerValidate = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().lowercase().required(),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(passwordRegex)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      "string.min": "Password must be at least 8 characters long.",
      "string.max": "Password cannot exceed 30 characters.",
    }),
  otp: Joi.string().length(6).required(),
});

module.exports = registerValidate;
