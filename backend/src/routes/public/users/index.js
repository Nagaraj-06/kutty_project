const express = require("express");
const router = express.Router();
const {
    getUserPublicProfile,
} = require("../../../controllers/users");

/**
 * @swagger
 * /public/api/users/profile/{userId}:
 *   get:
 *     summary: Get user public profile (Public)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile details fetched successfully
 */
router.get("/profile/:userId", getUserPublicProfile);

module.exports = router;
