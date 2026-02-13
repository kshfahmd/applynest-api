const { formatZodError } = require("../validators/formatZodError");

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: formatZodError(result.error),
    });
  }

  // Replace req.body with sanitized data
  req.body = result.data;

  next();
};

module.exports = validate;
