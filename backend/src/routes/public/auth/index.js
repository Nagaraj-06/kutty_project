const express = require("express");
const router = express.Router();
const {
  signUp,
  signIn,
  verifyEmailController,
  resendVerification,
} = require("../../../controllers/auth");
const { signUpSchema, signInSchema } = require("./schema");
const validate = require("../../../middlewares/validate.middleware");

/**
 * @swagger
 * /public/api/auth/signup:
 *   post:
 *     summary: User signup
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUpUser'
 *     responses:
 *       201:
 *         description: Verification email sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/signUpResponse'
*/
router.post("/signup", validate(signUpSchema), signUp);

/**
 * @swagger
 * /public/api/auth/signin:
 *   post:
 *     summary: User signin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignInUser'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/signInResponse'
*/

router.post("/signin", validate(signInSchema), signIn);


/**
 * @swagger
 * /public/api/auth/verify_email:
 *   get:
 *     summary: Verify user's email via token
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Verification token sent in email
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerifyEmailResponse'
 *       400:
 *         description: Invalid or expired token / already used
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Invalid verification link (Or) Verification link expired (Or) This verification link has already been used - Go to login"
 */

router.get("/verify_email", verifyEmailController);

/**
 * @swagger
 * /public/api/auth/resend-verification:
 *   post:
 *     summary: Resend verification email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification email resent
 */
router.post("/resend-verification", resendVerification);

module.exports = router;
