const {
  signupUser,
  loginUser,
  verifyEmailService,
  resendVerificationEmail,
} = require("../../services/auth.service");

// Signup
async function signUp(req, res, next) {
  const { user_name, email, password } = req.body;

  const result = await signupUser({ user_name, email, password });

  res.status(201).json({
    success: true,
    ...result,
  });
}

// sign In
async function signIn(req, res, next) {
  const { email, password } = req.body;

  const { user, token } = await loginUser({ email, password });

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      id: user.id,
      email: user.email,
      user_name: user.user_name,
      profile_pic_url: user.profile_pic_url
    },
    token,
  });
}

async function verifyEmailController(req, res, next) {
  try {
    const { token } = req.query;

    if (!token) {
      const err = new Error("Verification token is required");
      err.statusCode = 400;
      throw err;
    }

    const result = await verifyEmailService(token);

    res.json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
}

async function resendVerification(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      const err = new Error("Email is required");
      err.statusCode = 400;
      throw err;
    }

    const result = await resendVerificationEmail(email);
    res.json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { signUp, signIn, verifyEmailController, resendVerification };
