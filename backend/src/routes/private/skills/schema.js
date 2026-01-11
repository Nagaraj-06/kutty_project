const Joi = require("joi");

const SKILL_TYPE = ["WANTED", "OFFERING"];

// // Add or update skill
// const addUserSkillSchema = Joi.object({
//   skill_id: Joi.string().required(),
//   skill_type: Joi.string()
//     .valid(...SKILL_TYPE)
//     .required(),
//   status: Joi.string().optional(),
//   average_rating: Joi.number().optional().allow(null),
// });

// Remove skill (soft delete) → params validation
const removeUserSkillSchema = Joi.object({
  skill_id: Joi.string().required(),
});

const removeUserSkillResponseSchema = Joi.object({
  success: Joi.boolean().required(),
  message: Joi.string().required(),
});

const addUserSkillResponseSchema = Joi.object({
  success: Joi.boolean().required(),
  message: Joi.string().required(),
});

const getSkillsResponseSchema = Joi.object({
  success: Joi.boolean().required(),
  data: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      name: Joi.string().required(),
      is_active: Joi.boolean().required(),
      created_at: Joi.date().iso().required(),
    })
  ),
});

const getUserSkillsResponseSchema = Joi.object({
  success: Joi.boolean().required(),
  data: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      skill_type: Joi.string()
        .valid(...SKILL_TYPE)
        .required(),
      skill: Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
      }).required(),
      average_rating: Joi.number().allow(null),
    })
  ),
});

const getUsersSkillsResponseSchema = Joi.object({
  success: Joi.boolean().required(),
  data: Joi.array().items(
    Joi.object({
      id: Joi.string().required(), // user id
      email: Joi.string().email().required(),
      user_name: Joi.string().required(),
      profile_pic_url: Joi.string().allow(null),

      skills_offered: Joi.array().items(
        Joi.string().required()
      ).required(),

      skills_wanted: Joi.array().items(
        Joi.string().required()
      ).required(),
    })
  ),
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
