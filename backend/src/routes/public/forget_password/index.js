const express = require("express");
const { requestReset, reset } = require("../../../controllers/forget_password");
const router = express.Router();

const { requestResetSchema, resetSchema } = require("./schema");
const validate = require("../../../middlewares/validate.middleware");

/**
 * @swagger
 * /public/api/forget_password/request:
 *   post:
 *     summary: Request password reset token. use this token to Reset the Password (for testing purpose). Later we are implement the email-link feature 
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
 *     summary: Reset password using token
 *     tags: [ForgetPassword]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPassword'
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForgetPasswordResetResponse'
 */
router.post("/reset", validate(resetSchema), reset);

module.exports = router;
