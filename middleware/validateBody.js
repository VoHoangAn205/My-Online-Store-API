const { validate } = require("express-joi-validations");

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      console.error(error);
      res.status(400).json({ message: error.details[0].message });
    }
    next();
  };
};

module.exports = validateBody;
