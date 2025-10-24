const express = require("express");
const { requestReset, reset } = require("../../../controllers/forget_password");
const router = express.Router();

const { requestResetSchema, resetSchema } = require("./schema");
const validate = require("../../../middlewares/validate.middleware");

/**
 * @swagger
 * /public/api/forget_password/request:
 *   post:
 *     summary: check your mail and vefiy within - 1 hour expiration
 *     tags: [ForgetPassword]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RequestReset'
 *     responses:
 *       200:
 *         description: Token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForgetPasswordRequestResponse'
 */

router.post("/request", validate(requestResetSchema), requestReset);

/**
 * @swagger
 * /public/api/forget_password/reset:
 *   post:
 *     summary: Reset password
 *     tags: [ForgetPassword]
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResetPassword'
 */
router.post("/reset", validate(resetSchema), reset);

module.exports = router;
