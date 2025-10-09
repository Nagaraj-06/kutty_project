const {
  updateUserProfile,
  updateUserAvailability,
  getUserAvailability,
} = require("../../services/users.service");

async function updateProfile(req, res, next) {
  try {
    const user_id = req.user.id; // from auth middleware
    const updatedUser = await updateUserProfile(user_id, req.body);

    res.json({
      success: true,
      message: "Profile updated successfully",
      // user: {
      //   id: updatedUser.id,
      //   bio: updatedUser.bio,
      //   profile_pic_url: updatedUser.profile_pic_url,
      //   profile_visibility: updatedUser.profile_visibility,
      //   is_active: updatedUser.is_active,
      // },
    });
  } catch (err) {
    next(err);
  }
}

async function updateAvailability(req, res, next) {
  try {
    const user_id = req.user.id;
    const slots = req.body;

    if (!Array.isArray(slots) || slots.length === 0) {
      const err = new Error("Slots must be a non-empty array");
      err.statusCode = 400;
      throw err;
    }

    await updateUserAvailability(user_id, slots);

    res.json({
      success: true,
      message: "Availability updated successfully",
    });
  } catch (err) {
    next(err);
  }
}

async function getUserAvailabilityController(req, res, next) {
  try {
    const userId = req.user.id;
    const slots = await getUserAvailability(userId);

    res.json({
      success: true,
      data: slots,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  updateAvailability,
  getUserAvailabilityController,
  updateProfile,
};
