const express = require("express");
const router = express.Router();
const swapController = require("../../../controllers/swaps/index");
const validate = require("../../../middlewares/validate.middleware");
const {
  createSwapSchema,
  updateStatusSchema,
  swapResponseSchema,
  markCompleteRequestSchema,
} = require("./schema");

/**
 * @swagger
 * /private/api/swaps:
 *   post:
 *     summary: Create a new skill swap request
 *     tags: [Swaps]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createSwapSwagger'
 *     responses:
 *       201:
 *         description: Swap request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/createSwapResponseSwagger'
 */
router.post("/", validate(createSwapSchema), swapController.createSwap);

/**
 * @swagger
 * /private/api/swaps/update_status:
 *   patch:
 *     summary: Update swap request status (accept/reject)
 *     description: Updates the status of a skill swap by its ID (sent as a query parameter).
 *     tags: [Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Swap Id from query params
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/updateStatusSwagger'
 *     responses:
 *       200:
 *         description: Swap status updated successfully
 *       403:
 *         description: Not authorized to update this swap
 */
router.patch(
  "/update_status",
  validate(updateStatusSchema, "query"),
  swapController.updateStatus
);

/**
 * @swagger
 * /private/api/swaps/get_user_swaps:
 *   get:
 *     summary: Get all swap requests for the current user
 *     tags: [Swaps]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of swap requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/swapResponseSwagger'
 */
router.get(
  "/get_user_swaps",
  validate(swapResponseSchema),
  swapController.getRequests
);

/**
 * @swagger
 * /private/api/swaps/mark_complete:
 *   patch:
 *     summary: Mark a skill swap as completed
 *     description: Marks the skill swap as completed if the user is one of the participants and the swap is active.
 *     tags: [Swaps]
 *     parameters:
 *       - in: query
 *         name: skill_swap_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the skill swap to be marked complete
 *     responses:
 *       200:
 *         description: Skill swap marked as completed successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Skill swap completed successfully!"
 *               data:
 *                 id: "skill_swap_id"
 *                 status: "COMPLETED"
 *                 completed_by_from: true
 *                 completed_by_to: true
 *       400:
 *         description: Skill swap not in active state
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Skill swap is not in an active state"
 *       403:
 *         description: User is not a participant in this swap
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "You are not a participant in this swap"
 *       404:
 *         description: Skill swap not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Skill swap not found"
 */

router.patch(
  "/mark_complete",
  validate(markCompleteRequestSchema),
  swapController.markSkillSwapComplete
);

module.exports = router;
