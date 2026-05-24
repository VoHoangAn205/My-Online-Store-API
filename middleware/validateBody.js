const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      console.error("Validation Error: ", error.message);
      //map all errors to give full reports
      const errorMessages = error.details.map((detail) => detail.message);

      res.status(400).json({ message: errorMessages });
    } else {
      // replace with the cleaned value!!!
      req.body = value;
      next();
    }
  };
};

module.exports = validateBody;
