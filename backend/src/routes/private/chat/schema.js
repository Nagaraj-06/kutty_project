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
  data: Joi.array().items(
    Joi.object({
      chat_session_id: Joi.string()
        .uuid()
        .example("8fcddb71-2b42-ecfb-be2d-4c89e7fc6d0d"),

      is_archived: Joi.boolean().example(false),

      oppositeUser: Joi.object({
        user_name: Joi.string().example("John Doe"),
        email: Joi.string().email().example("john@example.com"),
        profile_pic_url: Joi.string()
          .uri()
          .allow(null)
          .example("https://example.com/profile.jpg"),

        last_message: Joi.string().example("Hello!"),
        last_message_sent_by_me: Joi.boolean().example(false),
        updated_at: Joi.date()
          .iso()
          .allow(null)
          .example("2025-10-08T13:18:02.214Z"),
      }),
    })
  ),
});

module.exports = {
  getMessagesSchema,
  getChatResponseSchema,
  getChatListResponseSchema,
};
