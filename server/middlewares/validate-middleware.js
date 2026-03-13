const validate = (schema) => async (req, res, next) => {
  try {
    const parsedBody = await schema.parseAsync(req.body);
    req.body = parsedBody;
    return next();
  } catch (error) {
    error.status = 400;
    error.details = error?.issues?.map((issue) => issue.message) || [];
    error.message = error.details[0] || "Validation failed";
    return next(error);
  }
};

module.exports = validate;
