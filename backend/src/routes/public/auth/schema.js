const Joi = require("joi");

const signUpSchema = Joi.object({
  user_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const signUpResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  message: Joi.string().example("User registered successfully"),
  user: Joi.object({
    id: Joi.string().example("e3a1f93c-5d8f-4c4b-a7c9-8c12dca29a0e"),
    email: Joi.string().email().example("user@example.com"),
  }),
});

const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const signInResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  message: Joi.string().example("Login successful"),
  user: Joi.object({
    id: Joi.string().example("e3a1f93c-5d8f-4c4b-a7c9-8c12dca29a0e"),
    email: Joi.string().email().example("user@example.com"),
  }),
  token: Joi.string().example("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."),
});

module.exports = {
  signUpSchema,
  signInSchema,
  signUpResponseSchema,
  signInResponseSchema,
};
