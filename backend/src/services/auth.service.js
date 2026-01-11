const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const { nanoid } = require("nanoid");
const sgMail = require("../config/sendgrid");
const { frontendUrl } = require("../config/env");
require("dotenv").config();

// Signup service
async function signupUser({ user_name, email, password }) {
  return await prisma.$transaction(async (tx) => {
    // Check if user already exists
    const existingUser = await tx.users.findUnique({ where: { email } });
    if (existingUser) {
      const err = new Error("User already exists");
      err.statusCode = 400;
      throw err;
    }

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

    // Generate token
    const token = nanoid(32);
    await tx.reset_tokens.create({
      data: {
        user_id: user.id,
        token,
        token_expiry: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      },
    });

    // Send verification email
    const verificationLink = `${frontendUrl}/verify-email?token=${token}`;

    try {
      const msg = {
        to: user.email,
        from: process.env.FROM_EMAIL, // verified sender in SendGrid
        subject: "Verify your Email",
        text: "Email Verification",
        html: `<p>Hello ${user.user_name},</p>
         <p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
      };

      await sgMail.send(msg);
      console.log("✅ SendGrid API is working! Email sent successfully.");
    } catch (error) {
      console.error(
        "❌ SendGrid test failed:",
        error.response ? error.response.body : error
      );

      return { message: "SendGrid test failed" };
    }

    // Success
    return { message: "Account created! Please check your email for verification (check your spam folder as well).", email: user.email };
  });
}

// Login service
async function loginUser({ email, password }) {
  const user = await prisma.users.findUnique({ where: { email } });

  if (!user) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
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

module.exports = { signupUser, loginUser, verifyEmailService };
