const Joi = require("joi");

const giveFeedbackRequestSchema = Joi.object({
  skill_swap_id: Joi.string()
    .required()
    .example("d3c4f7aa-2b42-4c89-b019-fbcceed48b06"),
  given_by: Joi.string()
    .required()
    .example("510218c5-f81f-4697-be2d-4c89297c7b31"),
  user_skill_id: Joi.string()
    .required()
    .example("a24f92a5-1d33-47a2-a93a-88a8b40fd881"),
  received_by: Joi.string()
    .required()
    .example("6123fca9-1f72-4e93-9d3d-08b8e4a3b1f2"),
  feedback_text: Joi.string()
    .required()
    .example("Great communication and knowledge sharing!"),
  rating: Joi.number().min(1).max(5).required().example(5),
});

const giveFeedbackResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.string().example("feedback provided successfully...!"),
});

const feedbackUserSchema = Joi.object({
  id: Joi.string().example("510218c5-f81f-4697-be2d-4c89297c7b31"),
  email: Joi.string().email().example("john@example.com"),
  profile_pic_url: Joi.string()
    .uri()
    .allow(null)
    .example("https://example.com/profile.jpg"),
});

const feedbackItemSchema = Joi.object({
  id: Joi.string().example("b72cf2c1-f6d5-4e12-9d6e-df5e4978a3ef"),
  skill_swap_id: Joi.string().example("d3c4f7aa-2b42-4c89-b019-fbcceed48b06"),
  feedback_text: Joi.string().example(
    "Great communication and knowledge sharing!"
  ),
  rating: Joi.number().example(5),
  created_at: Joi.string().isoDate().example("2025-10-18T11:26:00.849Z"),
  givenBy: feedbackUserSchema,
});

const getFeedbacksResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.array().items(feedbackItemSchema),
});

module.exports = {
  giveFeedbackRequestSchema,
  giveFeedbackResponseSchema,
  getFeedbacksResponseSchema,
};
