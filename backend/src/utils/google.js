// utils/google.js
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config(); // Load .env

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Verify if the provided Google ID token is valid
 */
async function verifyGoogleEmail(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  if (!payload.email_verified) {
    throw new Error("Google account not verified");
  }

  return payload.email; // returns the verified Google email
}

module.exports = { verifyGoogleEmail };
