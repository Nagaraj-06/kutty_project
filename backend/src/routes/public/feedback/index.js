const express = require("express");
const router = express.Router();
const { getFeedbacks } = require("../../../controllers/feedback");

/**
 * @swagger
 * /public/api/feedback:
 *   get:
 *     summary: Get all feedbacks for a user (Public)
 *     tags: [Feedback]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of feedbacks
 */
router.get("/", getFeedbacks);

module.exports = router;
