const express = require("express");
const router = express.Router();
const validate = require("../../../middlewares/validate.middleware");

const { giveFeedback, getFeedbacks } = require("../../../controllers/feedback");
const { getFeedbacksResponseSchema,giveFeedbackRequestSchema } = require("./schema");

/**
 * @swagger
 * /private/api/feedback:
 *   post:
 *     summary: Give feedback for a completed skill swap
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GiveFeedbackRequest'
 *     responses:
 *       200:
 *         description: Feedback submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GiveFeedbackResponse'
 */

router.post("/", validate(giveFeedbackRequestSchema), giveFeedback);

/**
 * @swagger
 * /private/api/feedback:
 *   get:
 *     summary: Get all feedbacks for logged user
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of feedbacks
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetFeedbacksResponse'
 */

router.get("/", validate(getFeedbacksResponseSchema), getFeedbacks);

module.exports = router;
