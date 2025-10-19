const { addOrUpdateSkill } = require("../../services/skills.service");
const {
  updateUserProfile,
  updateUserAvailability,
  getUserProfileDetails,
} = require("../../services/users.service");

async function updateProfile(req, res, next) {
  try {
    const user_id = req.user.id;

    const { bio, profile_visibility, is_active, slots, skills } = req.body;

    // handle profile pic upload
    let profile_pic_url = null;
    if (req.file) {
      profile_pic_url = `/assets/${req.file.filename}`;
    }

    // build update data
    const updateData = {
      bio,
      profile_visibility,
      is_active,
      ...(profile_pic_url && { profile_pic_url }),
    };

    // update profile fields
    await updateUserProfile(user_id, updateData);

    // update availability slots
    if (Array.isArray(slots) && slots.length > 0) {
      await updateUserAvailability(user_id, slots);
    }

    // update user skills
    if (Array.isArray(skills) && skills.length > 0) {
      for (const skill of skills) {
        const { skill_id, skill_type, status, average_rating } = skill;
        await addOrUpdateSkill(
          user_id,
          skill_id,
          skill_type,
          status,
          average_rating
        );
      }
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (err) {
    next(err);
  }
}

async function user_profile_details(req, res, next) {
  try {
    const user_id = req.user.id;

    const profileDetails = await getUserProfileDetails(user_id);

    res.json({
      success: true,
      data: profileDetails,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  user_profile_details,
  updateProfile,
};
