const { signupUser, loginUser } = require("../../services/auth.service");

// Signup
async function signUp(req, res, next) {
  const { user_name, email, password } = req.body;

  // Service handles validation + throws error if invalid
  const { user } = await signupUser({ user_name, email, password });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: { id: user.id, email: user.email },
  });
}

// sign In
async function signIn(req, res, next) {
  const { email, password } = req.body;

  const { user, token } = await loginUser({ email, password });

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: { id: user.id, email: user.email },
    token,
  });
}

module.exports = { signUp, signIn };
