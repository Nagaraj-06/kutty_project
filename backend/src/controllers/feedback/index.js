const feedbackService = require("../../services/feedback.service");

// Give feedback
async function giveFeedback(req, res, next) {
  try {
    const given_by = req.user.id;
    const data = { ...req.body, given_by };

    await feedbackService.createFeedback(data);
    res.status(201).json({ success: true, data: "feedback provided successfully...!" });
  } catch (err) {
    next(err);
  }
}

// Get feedbacks for logged-in user
async function getFeedbacks(req, res, next) {
  try {
    const user_id = req.user.id;

    const feedbacks = await feedbackService.getFeedbacksForUser(user_id);

    res.json({
      success: true,
      data: feedbacks,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { giveFeedback, getFeedbacks };
