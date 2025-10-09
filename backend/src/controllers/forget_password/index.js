const {
  requestPasswordReset,
  resetPassword,
} = require("../../services/forget_password.service");

// Request password reset link
async function requestReset(req, res, next) {
  const { email } = req.body;

  const result = await requestPasswordReset(email);

  res.status(200).json({
    success: true,
    message: result.message,
    token: result.token, // For testing only → in real apps, don’t send token in response
  });
}

// Reset password with token
async function reset(req, res, next) {
  const { token, newPassword } = req.body;

  const result = await resetPassword(token, newPassword);

  res.status(200).json({
    success: true,
    message: result.message,
  });
}

module.exports = { requestReset, reset };
