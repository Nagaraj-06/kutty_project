const express = require("express");
const {
  addOrUpdateSkill,
  getUserSkills,
  getUsersSkills,
  removeUserSkill,
  getSkills,
} = require("../../../controllers/skills");

const router = express.Router();
const validate = require("../../../middlewares/validate.middleware");
const { addUserSkillSchema, removeUserSkillSchema } = require("./schema");

/**
 * @swagger
 * /private/api/skills/add_user_skill:
 *   post:
 *     summary: Add or update a skill for the user
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/addOrUpdateSkill'
 *     responses:
 *       201:
 *         description: Skill added/updated successfully
 */

// add or update - user skills
router.post("/add_user_skill", validate(addUserSkillSchema), addOrUpdateSkill);

/**
 * @swagger
 * /private/api/skills:
 *   get:
 *     summary: Get all Skills
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all Skills
 */
router.get("/", getSkills);

/**
 * @swagger
 * /private/api/skills/user_skills:
 *   get:
 *     summary: Get specific user Skills
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user skills
 */
router.get("/user_skills", getUserSkills); // Get user skills

/**
 * @swagger
 * /private/api/skills/users_skills:
 *   get:
 *     summary: Get all Users Skills
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users skills
 */
router.get("/users_skills", getUsersSkills); // Get users skills

/**
 * @swagger
 * /private/api/skills/{skill_id}:
 *   delete:
 *     summary: Remove a skill (soft delete)
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: skill_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Skill removed successfully
 */
router.delete("/:skill_id", validate(removeUserSkillSchema), removeUserSkill);

module.exports = router;
