const Joi = require("joi");

const getMessagesSchema = Joi.object({
  chat_session_id: Joi.string().uuid().required(),
});

module.exports = { getMessagesSchema };
