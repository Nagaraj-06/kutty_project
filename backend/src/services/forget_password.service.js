const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const sgMail = require("../config/sendgrid");
require("dotenv").config(); // Load .env

const prisma = new PrismaClient();

// 🔹 Request password reset (store reset token in DB)
async function requestPasswordReset(email) {
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  const token = uuidv4();

  // 3️⃣ Save token in DB
  await prisma.reset_tokens.create({
    data: {
      token,
      user_id: user.id,
      token_expiry: new Date(Date.now() + 3600 * 1000), // 1 hour expiration
      used: false,
    },
  });

  // 4️⃣ Create reset link
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  // 5️⃣ Send email via SendGrid
  const msg = {
    to: email,
    from: process.env.FROM_EMAIL, // verified sender in SendGrid
    subject: "Password Reset Request",
    text: "Password Reset Confirmation",
    html: `<p>Hello ${user.user_name},</p>
           <p>Click the link below to reset your password:</p>
           <a href="${resetLink}">Reset Password</a>
           <p>This link will expire in 1 hour.</p>`,
  };

  await sgMail.send(msg);

  return { message: "Reset link sent to email" };
}

// Reset password using token
async function resetPassword(token, newPassword) {
  // Find the reset token
  const resetToken = await prisma.reset_tokens.findFirst({
    where: { token, used: false, token_expiry: { gt: new Date() } },
  });

  if (!resetToken) throw new Error("Invalid or expired token");

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update user's password
  await prisma.users.update({
    where: { id: resetToken.user_id },
    data: { password_hash: hashedPassword },
  });

  // Mark token as used
  await prisma.reset_tokens.update({
    where: { id: resetToken.id },
    data: { used: true },
  });

  return { message: "Password reset successful" };
}

module.exports = { requestPasswordReset, resetPassword };
