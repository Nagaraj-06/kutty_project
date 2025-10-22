require("dotenv").config(); // Load .env

module.exports = {
  port: process.env.PORT || 8080,
  dbUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  host: process.env.HOST,
};
