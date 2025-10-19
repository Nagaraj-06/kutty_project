const express = require("express");
const router = express.Router();
const {
  updateProfile,
  user_profile_details,
} = require("../../../controllers/users");
const { updateProfileSchema, updateAvailabilitySchema } = require("./schema");
const validate = require("../../../middlewares/validate.middleware");
const upload = require("../../../middlewares/uploadMiddleware");

/**
 * @swagger
 * /private/api/users/update_profile:
 *   patch:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfile'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateProfileResponse'
 */
router.patch(
  "/update_profile",
  validate(updateProfileSchema),
  upload.single("profile_pic"),
  updateProfile
);

/**
 * @swagger
 * /private/api/users/user_profile_details:
 *   get:
 *     summary: Get user_profile_details
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: profile details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetUserProfileResponse'
 */
router.get("/user_profile_details", user_profile_details);

module.exports = router;
