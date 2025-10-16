const express = require("express");
const router = express.Router();
const validate = require("../../../middlewares/validate.middleware");
const chatController = require("../../../controllers/chat");
const { getMessagesSchema } = require("./schema");

/**
 * @swagger
 * /private/api/chat:
 *   get:
 *     summary: Get all messages of a chat session
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: chat_session_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Chat session ID
 *     responses:
 *       200:
 *         description: List of messages for chat-session
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetChatResponse'
 */

router.get(
  "/get_chat",
  validate(getMessagesSchema, "query"),
  chatController.getMessages
);

module.exports = router;
