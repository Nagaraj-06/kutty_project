const express = require("express");
const router = express.Router();
const { signUp, signIn } = require("../../../controllers/auth");
const { signUpSchema, signInSchema } = require("./schema");
const validate = require("../../../middlewares/validate.middleware");

/**
 * @swagger
 * /public/api/users/signup:
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
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/signUpResponse'
 */
    
router.post("/signup", validate(signUpSchema), signUp);
/**
 * @swagger
 * /public/api/users/signin:
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

module.exports = router;
