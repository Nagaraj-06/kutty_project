const Joi = require("joi");

// Create Swap Request
const createSwapSchema = Joi.object({
  request_to: Joi.string().required().example("user2_id"),
  offer_user_skill_id: Joi.string()
    .required()
    .example("user1_offered_skill_id"),
  want_user_skill_id: Joi.string().required().example("user1_wanted_skill_id"),
  message: Joi.string().optional().example("Let's swap skills!"),
});

// Update Swap Status
const updateStatusSchema = Joi.object({
  status: "ACCEPTED (Or) REJECTED",
});

// Response schema
const swapResponseSchema = Joi.object({
  id: Joi.string().example("068-f535f585-bf41-e-4aa3f570c7a3631c"),
  status: "ACCEPTED (Or) PENDING (Or) REJECTED (Or) COMPLETED",
  requestFrom: Joi.object({
    id: Joi.string().example("user123"),
    email: Joi.string().email().example("from@example.com"),
  }).required(),

  requestTo: Joi.object({
    id: Joi.string().example("user456"),
    email: Joi.string().email().example("to@example.com"),
  }).required(),

  offerSkill: Joi.object({
    id: Joi.string(),
    user: {
      id: "user123",
      email: "user@example.com",
      name: "user_name",
    },
    skill_type: "WANTED (Or) OFFERING",
    skill: Joi.object({
      id: Joi.string(),
      name: Joi.string().example("skill_name"),
    }).required(),
  }).required(),

  wantSkill: Joi.object({
    id: Joi.string(),
    user: {
      id: "user456",
      email: "user@example.com",
      name: "user_name",
    },
    skill_type: "WANTED (Or) OFFERING",
    skill: Joi.object({
      id: Joi.string(),
      name: Joi.string().example("skill_name"),
    }).required(),
  }).required(),
});

const createSwapResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  message: Joi.string().example("Swap request created successfully"),
});

const markCompleteRequestSchema = Joi.object({
  skill_swap_id: Joi.string().uuid().required().messages({}),
});

const markCompleteResponseSchema = Joi.object({
  success: Joi.boolean().required().example(true),
  message: Joi.string()
    .required()
    .example("Skill swap completed successfully!"),
  data: Joi.object({
    id: Joi.string()
      .uuid()
      .required()
      .example("9b12e4a7-5c3f-4a11-8f0d-2f994f8889e5"),
    status: Joi.string().valid("COMPLETED").required().example("COMPLETED"),
    completed_by_from: Joi.boolean().required().example(true),
    completed_by_to: Joi.boolean().required().example(true),
  }).required(),
});

module.exports = {
  createSwapSchema,
  createSwapResponseSchema,
  updateStatusSchema,
  swapResponseSchema,
  markCompleteRequestSchema,
  markCompleteResponseSchema,
};
