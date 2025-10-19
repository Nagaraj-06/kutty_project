const {
  requestPasswordReset,
  resetPassword,
} = require("../../services/forget_password.service");

// Request password reset link
async function requestReset(req, res, next) {
  const { email } = req.body;

  try {
    const { email } = req.body;
    const result = await requestPasswordReset(email);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

// Reset password with token
async function reset(req, res, next) {
  try {
    const { token, newPassword } = req.body;
    const result = await resetPassword(token, newPassword);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

module.exports = { requestReset, reset };
