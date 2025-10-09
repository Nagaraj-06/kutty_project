const Joi = require("joi");

// Request password reset
const requestResetSchema = Joi.object({
  email: Joi.string().email().required(),
});

const forgetPasswordRequestResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  message: Joi.string().example("Password reset link generated successfully"),
  token: Joi.string().example("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."), // For testing only
});

// Reset password using token
const resetSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});

const forgetPasswordResetResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  message: Joi.string().example("Password has been reset successfully"),
});

module.exports = {
  requestResetSchema,
  resetSchema,
  forgetPasswordRequestResponseSchema,
  forgetPasswordResetResponseSchema,
};
