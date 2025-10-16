const skillService = require("../../services/skills.service");

async function addOrUpdateSkill(req, res, next) {
  try {
    const user_id = req.user.id;
    const { skill_id, skill_type, status, average_rating } = req.body;

    if (!skill_id || !skill_type) {
      const err = new Error("skill_id and skill_type are required");
      err.statusCode = 400;
      throw err;
    }

    await skillService.addOrUpdateSkill(
      user_id,
      skill_id,
      skill_type,
      status,
      average_rating
    );

    res.json({
      success: true,
      message: "Skill added/updated successfully",
    });
  } catch (err) {
    next(err);
  }
}

async function getUserSkills(req, res, next) {
  try {
    const user_id = req.user.id;
    const skills = await skillService.getUserSkills(user_id);

    res.json({
      success: true,
      data: skills,
    });
  } catch (err) {
    next(err);
  }
}

async function getUsersSkills(req, res, next) {
  try {
    const skills = await skillService.getUsersSkills();

    res.json({
      success: true,
      data: skills,
    });
  } catch (err) {
    next(err);
  }
}

async function getSkills(req, res, next) {
  try {
    const skills = await skillService.getSkills();

    res.json({
      success: true,
      data: skills,
    });
  } catch (err) {
    next(err);
  }
}

async function removeUserSkill(req, res, next) {
  try {
    const user_id = req.user.id;
    const { skill_id } = req.query;

    if (!skill_id) {
      const err = new Error("skill_id is required");
      err.statusCode = 400;
      throw err;
    }

    await skillService.removeUserSkill(user_id, skill_id);

    res.json({
      success: true,
      message: "Skill removed successfully",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  addOrUpdateSkill,
  getSkills,
  getUserSkills,
  getUsersSkills,
  removeUserSkill,
};
