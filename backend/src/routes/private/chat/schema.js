const Joi = require("joi");

const getMessagesSchema = Joi.object({
  chat_session_id: Joi.string().uuid().required(),
});

const getChatResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.array().example([
    {
      id: "86842ecf-be2d-4c84-b019-fbcceed48b06",
      message: "Hi Prasanth",
      file_url: null,
      send_at: "2025-10-08T13:18:02.214Z",
      sender: {
        id: "510218c5-f81f-4697-42ecf-be2d-4c89297c7b31388",
        email: "sample@gmail.com",
        user_name: "user_name",
        profile_pic_url: "https://example.com/profile.jpg",
      },
    },
  ]),
});

const getChatListResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  message: Joi.string().example("Chat list fetched successfully"),
  data: Joi.array().example([
    {
      chat_session_id: "8fcddb71-2b42ecf-be2d-4c89-e7fc6d0de359",
      oppositeUser: {
        name: "John Doe",
        email: "john@example.com",
        profile_pic_url: "https://example.com/profile.jpg",
      },
      last_message: "Hello!",
      last_message_sent_by_me: false,
      updated_at: "2025-10-08T13:18:02.214Z",
    },
  ]),
});

module.exports = {
  getMessagesSchema,
  getChatResponseSchema,
  getChatListResponseSchema,
};
