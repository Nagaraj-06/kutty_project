const express = require("express");
const router = express.Router();
const swapController = require("../../../controllers/swaps/index");
const validate = require("../../../middlewares/validate.middleware");
const {
  createSwapSchema,
  updateStatusSchema,
  swapResponseSchema,
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
 *       400:
 *         description: Bad request
 */
router.post("/", validate(createSwapSchema), swapController.createSwap);

/**
 * @swagger
 * /private/api/swaps/update_status
 *   patch:
 *     summary: Update swap request status (accept/reject)
 *     description: Updates the status of a skill swap by its ID (sent as a query parameter).
 *     tags: [Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
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
  validate(updateStatusSchema),
  swapController.updateStatus
);

/**
 * @swagger
 * /private/api/swaps:
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

module.exports = router;
