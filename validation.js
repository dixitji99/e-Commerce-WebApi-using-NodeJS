const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),
  isAuthor: Joi.boolean(),
});

const loginSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().min(2).required(),
});
const registerAuthorSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().min(2).required(),
  books: Joi.array().items(Joi.string()),
  image_url: Joi.string(),
  description: Joi.string(),
});

const loginAuthorSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().min(2).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  registerAuthorSchema,
  loginAuthorSchema,
};
