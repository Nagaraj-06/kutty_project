const Joi = require("joi");

// Create Swap Request
const createSwapSchema = Joi.object({
  request_to: Joi.string().required(),
  offer_skill_id: Joi.string().required(),
  want_skill_id: Joi.string().required(),
  message: Joi.string().optional(),
});

// Update Swap Status
const updateStatusSchema = Joi.object({
  status: Joi.string().valid("ACCEPTED", "REJECTED").required(),
});

// Response schema
const swapResponseSchema = Joi.object({
  id: Joi.string(),
  request_from: Joi.string(),
  request_to: Joi.string(),
  offer_skill_id: Joi.string(),
  want_skill_id: Joi.string(),
  message: Joi.string().allow(null),
  status: Joi.string(),
  is_active: Joi.boolean(),
  created_at: Joi.date(),
  updated_at: Joi.date(),
});


const createSwapResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  message: Joi.string().example("Swap request created successfully"),
});


module.exports = {
  createSwapSchema,
  createSwapResponseSchema,
  updateStatusSchema,
  swapResponseSchema,
};
