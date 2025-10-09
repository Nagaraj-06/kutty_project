const Joi = require("joi");

// Add or update skill
const addUserSkillSchema = Joi.object({
  skill_id: Joi.string().required(),
  skill_type: Joi.string().valid("OFFERING", "WANTED").required(),
  status: Joi.string().optional(),
  average_rating: Joi.number().optional(),
});

// Remove skill (soft delete) → params validation
const removeUserSkillSchema = Joi.object({
  skill_id: Joi.string().required(),
});

module.exports = {
  addUserSkillSchema,
  removeUserSkillSchema,
};
