const express = require("express");
const router = express.Router();
const {
  updateProfile,
  updateAvailability,
  getUserAvailabilityController,
} = require("../../../controllers/users");
const { updateProfileSchema, updateAvailabilitySchema } = require("./schema");
const validate = require("../../../middlewares/validate.middleware");

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
router.patch("/update_profile", validate(updateProfileSchema), updateProfile);

/**
 * @swagger
 * /private/api/users/update_user_availability:
 *   patch:
 *     summary: Update user availability slots
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAvailability'
 *     responses:
 *       200:
 *         description: Availability updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserAvailabilityResponse'
 */
router.patch(
  "/update_user_availability",
  validate(updateAvailabilitySchema),
  updateAvailability
);

/**
 * @swagger
 * /private/api/users/get_user_availability:
 *   get:
 *     summary: Get user availability time slots
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Availability fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetUserAvailabilityResponse'
 */
router.get("/get_user_availability", getUserAvailabilityController);

module.exports = router;
