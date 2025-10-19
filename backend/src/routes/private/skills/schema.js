const Joi = require("joi");

// Add or update skill
// const addUserSkillSchema = Joi.object({
//   skill_id: Joi.string().required(),
//   skill_type: "OFFERING (Or) WANTED",
//   status: Joi.string().optional(),
//   average_rating: Joi.number().optional(),
// });

// Remove skill (soft delete) → params validation
const removeUserSkillSchema = Joi.object({
  skill_id: Joi.string().required(),
});

const removeUserSkillResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  message: Joi.string().example("Skill removed successfully"),
});

const addUserSkillResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  message: Joi.string().example("Skill added/updated successfully"),
});

const getSkillsResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.array().example([
    {
      id: "aef27bb0ba-ae79-495843--1c98ca7aaeb4",
      name: "Networking",
      is_active: true,
      created_at: "2025-09-06T11:26:00.849Z",
    },
  ]),
});

const getUserSkillsResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.array().example([
    {
      id: "068-f535f585-bf41-e-4aa3f570c7a3631c",
      skill_type: "WANTED (Or) OFFERING",
      skill: {
        id: "95847bb0-ae79-4ba3-aef2-1c98ca7aaeb4",
        name: "Networking",
      },
      average_rating: "null (Or) int",
    },
  ]),
});

const getUsersSkillsResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.array().example([
    {
      id: "068-f535f585-bf41-e-4aa3f570c7a3631c",
      user_id: "7f61e-a1a8-2376212f-2-4bb36fd30910f0",
      average_rating: 0,
      skill_type: "WANTED (or) OFFERING",
      skill: {
        id: "95847bb0-ae79-4ba3-aef2-1c98ca7aaeb4",
        name: "skill_name",
      },
      user: {
        id: "7376212f-f622-4b1e-a1a8-b36fd30910f0",
        email: "sample@gmail.com",
        user_name: "username",
        profile_pic_url: "profile_url",
      },
    },
  ]),
});

module.exports = {
  // addUserSkillSchema,
  removeUserSkillSchema,
  addUserSkillResponseSchema,
  getSkillsResponseSchema,
  getUserSkillsResponseSchema,
  getUsersSkillsResponseSchema,
  removeUserSkillResponseSchema,
};
