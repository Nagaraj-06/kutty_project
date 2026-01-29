const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const { nanoid } = require("nanoid");
const sgMail = require("../config/sendgrid");
const { frontendUrl } = require("../config/env");
require("dotenv").config();

// Helper to send verification email
async function sendVerificationEmail(user, token) {
  const verificationLink = `${frontendUrl}/verify-email?token=${token}`;
  const msg = {
    to: user.email,
    from: process.env.FROM_EMAIL,
    subject: "Verify your Email - Skill Swap",
    text: "Email Verification",
    html: `<p>Hello ${user.user_name},</p>
         <p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`
  };

  try {
    await sgMail.send(msg);
    console.log("✅ Verification email sent to:", user.email);
    return true;
  } catch (error) {
    console.error("❌ SendGrid error:", error.response ? error.response.body : error);
    return false;
  }
}

// Signup service
async function signupUser({ user_name, email, password }) {
  // Check if user already exists
  const existingUser = await prisma.users.findUnique({ where: { email } });

  if (existingUser) {
    if (existingUser.verified) {
      const err = new Error("User already exists. Please log in.");
      err.statusCode = 400;
      throw err;
    } else {
      // User exists but not verified - tell them to check email
      const err = new Error("Account exists but not verified. Check your email (including spam).");
      err.statusCode = 409; // Conflict
      throw err;
    }
  }

  return await prisma.$transaction(async (tx) => {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get role
    const userRole = await tx.roles_master.findUnique({
      where: { name: "user" },
    });

    // Create user
    const user = await tx.users.create({
      data: {
        user_name,
        email,
        password_hash: hashedPassword,
        role_id: userRole.id,
        verified: false,
      },
    });

    // Generate verification token
    const token = nanoid(32);
    await tx.reset_tokens.create({
      data: {
        user_id: user.id,
        token,
        token_expiry: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      },
    });

    // Send verification email
    const emailSent = await sendVerificationEmail(user, token);

    if (!emailSent) {
      console.warn("User created but verification email failed to send.");
    }

    return {
      message: "Account created! Check your email (including spam) to verify.",
      email: user.email
    };
  });
}

// Resend Verification Email
async function resendVerificationEmail(email) {
  const user = await prisma.users.findUnique({ where: { email } });

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  if (user.verified) {
    const err = new Error("User is already verified. Please log in.");
    err.statusCode = 400;
    throw err;
  }

  // Find or create a new token
  let tokenRecord = await prisma.reset_tokens.findFirst({
    where: {
      user_id: user.id,
      used: false,
      token_expiry: { gt: new Date() }
    },
    orderBy: { created_at: 'desc' }
  });

  let token;
  if (tokenRecord) {
    token = tokenRecord.token;
  } else {
    token = nanoid(32);
    await prisma.reset_tokens.create({
      data: {
        user_id: user.id,
        token,
        token_expiry: new Date(Date.now() + 1000 * 60 * 60 * 24),
      }
    });
  }

  const emailSent = await sendVerificationEmail(user, token);
  if (!emailSent) {
    const err = new Error("Failed to send verification email. Please try again later.");
    err.statusCode = 500;
    throw err;
  }

  return { message: "Verification email resent! Check inbox or spam." };
}

// Login service
async function loginUser({ email, password }) {
  const user = await prisma.users.findUnique({ where: { email } });

  if (!user) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  if (!user.verified) {
    const err = new Error("Please verify your email address before logging in.");
    err.statusCode = 403;
    throw err;
  }

  const validPassword = await bcrypt.compare(password, user.password_hash);

  if (!validPassword) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  const token = generateToken({ id: user.id, email: user.email });

  return { user, token };
}

async function verifyEmailService(token) {
  const tokenRecord = await prisma.reset_tokens.findUnique({
    where: { token },
  });

  if (!tokenRecord) {
    const err = new Error("Invalid verification link");
    err.statusCode = 400;
    throw err;
  }

  if (tokenRecord.used) {
    const err = new Error(
      "This verification link has already been used - Go to login"
    );
    err.statusCode = 400;
    throw err;
  }

  if (tokenRecord.token_expiry && tokenRecord.token_expiry < new Date()) {
    const err = new Error("Verification link expired");
    err.statusCode = 400;
    throw err;
  }

  // Mark user as verified
  await prisma.users.update({
    where: { id: tokenRecord.user_id },
    data: { verified: true },
  });

  // Mark token as used
  await prisma.reset_tokens.update({
    where: { token },
    data: { used: true },
  });

  return { message: "Email verified successfully!" };
}

module.exports = { signupUser, loginUser, verifyEmailService, resendVerificationEmail };
