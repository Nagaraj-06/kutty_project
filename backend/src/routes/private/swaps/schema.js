const Joi = require("joi");

/* ===========================
   ENUM DEFINITIONS
=========================== */

const SWAP_STATUS = ["PENDING", "ACCEPTED", "REJECTED", "COMPLETED"];
const SKILL_TYPE = ["WANTED", "OFFERING"];

/* ===========================
   CREATE SWAP REQUEST
=========================== */

const createSwapSchema = Joi.object({
  request_to: Joi.string().required().example("user2_id"),

  offer_user_skill_id: Joi.string()
    .required()
    .example("user1_offered_skill_id"),

  want_user_skill_id: Joi.string().required().example("user1_wanted_skill_id"),

  message: Joi.string()
    .allow(null, "")
    .optional()
    .example("Let's swap skills!"),
});

/* ===========================
   UPDATE SWAP STATUS
=========================== */

const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid("ACCEPTED", "REJECTED")
    .required()
    .example("ACCEPTED"),
});

/* ===========================
   SWAP RESPONSE (DETAIL)
=========================== */

const swapResponseSchema = Joi.object({
  id: Joi.string().uuid().example("068f535f-585b-41e4-aa3f-570c7a3631c"),

  status: Joi.string()
    .valid(...SWAP_STATUS)
    .example("PENDING"),

  requestFrom: Joi.object({
    id: Joi.string().required().example("user123"),
    email: Joi.string().email().required().example("from@example.com"),
  }).required(),

  requestTo: Joi.object({
    id: Joi.string().required().example("user456"),
    email: Joi.string().email().required().example("to@example.com"),
  }).required(),

  offerSkill: Joi.object({
    id: Joi.string().required(),

    user: Joi.object({
      id: Joi.string().required().example("user123"),
      email: Joi.string().email().required().example("user@example.com"),
      name: Joi.string().required().example("user_name"),
    }).required(),

    skill_type: Joi.string()
      .valid(...SKILL_TYPE)
      .required()
      .example("OFFERING"),

    skill: Joi.object({
      id: Joi.string().required(),
      name: Joi.string().required().example("skill_name"),
    }).required(),
  }).required(),

  wantSkill: Joi.object({
    id: Joi.string().required(),

    user: Joi.object({
      id: Joi.string().required().example("user456"),
      email: Joi.string().email().required().example("user@example.com"),
      name: Joi.string().required().example("user_name"),
    }).required(),

    skill_type: Joi.string()
      .valid(...SKILL_TYPE)
      .required()
      .example("WANTED"),

    skill: Joi.object({
      id: Joi.string().required(),
      name: Joi.string().required().example("skill_name"),
    }).required(),
  }).required(),
});

/* ===========================
   CREATE SWAP RESPONSE
=========================== */

const createSwapResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  message: Joi.string().example("Swap request created successfully"),
});

/* ===========================
   MARK COMPLETE REQUEST
=========================== */

const markCompleteRequestSchema = Joi.object({
  skill_swap_id: Joi.string()
    .uuid()
    .required()
    .example("9b12e4a7-5c3f-4a11-8f0d-2f994f8889e5"),
});

/* ===========================
   MARK COMPLETE RESPONSE
=========================== */

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

/* ===========================
   EXPORTS
=========================== */

module.exports = {
  createSwapSchema,
  createSwapResponseSchema,
  updateStatusSchema,
  swapResponseSchema,
  markCompleteRequestSchema,
  markCompleteResponseSchema,
};
