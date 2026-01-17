const express = require("express");
const {
    getUsersSkills,
    getSkills,
} = require("../../../controllers/skills");

const router = express.Router();

/**
 * @swagger
 * /public/api/skills:
 *   get:
 *     summary: Get all master skills (Public)
 *     tags: [Skills]
 *     responses:
 *       200:
 *         description: List of skills
 */
router.get("/", getSkills);

/**
 * @swagger
 * /public/api/skills/users_skills:
 *   get:
 *     summary: Get all Users Skills (Public)
 *     tags: [Skills]
 *     responses:
 *       200:
 *         description: List of user skills
 */
router.get("/users_skills", getUsersSkills);

module.exports = router;
