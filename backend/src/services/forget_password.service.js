const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const prisma = new PrismaClient();

// 🔹 Request password reset (store reset token in DB)
async function requestPasswordReset(email) {
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  const resetToken = uuidv4();

  await prisma.reset_tokens.create({
    data: {
      user_id: user.id,
      token: resetToken,
      token_expiry: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
  });

  // In real-world → send email with link
  return { message: "Password reset link sent", token: resetToken };
}

// 🔹 Reset password using token
async function resetPassword(token, newPassword) {
  const resetRequest = await prisma.reset_tokens.findUnique({
    where: { token },
  });

  if (!resetRequest || resetRequest.expiresAt < new Date()) {
    const err = new Error("Invalid or expired token");
    err.statusCode = 400;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.users.update({
    where: { id: resetRequest.user_id },
    data: { password_hash: hashedPassword },
  });

  await prisma.reset_tokens.delete({ where: { token } });

  return { message: "Password reset successfully" };
}

module.exports = { requestPasswordReset, resetPassword };
