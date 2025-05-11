const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().trim().min(3).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(8).required(),
  phoneNumber: Joi.string()
    .pattern(/^\+?(\d.*){3,}$/)
    .optional()
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
    }),
  address: Joi.string().optional(),
  role: Joi.string().valid("admin", "user").optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(8).required(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(3).optional(),
  email: Joi.string().trim().email().optional(),
  password: Joi.string().min(8).optional(),
  phoneNumber: Joi.string()
    .pattern(/^\+?(\d.*){3,}$/)
    .optional()
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
    }),
  address: Joi.string().optional(),
  role: Joi.string().valid("admin", "user").optional(),
});

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map((err) => ({
        parameter: err.context.label || err.context.key,
        error: err.message,
      }));
      return res.status(400).json({ message: messages });
    }
    next();
  };
};

module.exports = {
  registerSchema,
  loginSchema,
  updateUserSchema,
  validateBody,
};
