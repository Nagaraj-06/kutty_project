const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

// Public routes
const authRoutes = require("./public/auth");
const forgetPasswordRoutes = require("./public/forget_password");

// Private routes
const users = require("./private/users");
const skillRoutes = require("./private/skills"); // ./skills/index.js
const swapRoutes = require("./private/swaps"); // ./swaps/index.js
const chatRoutes = require("./private/chat");
// const feedbackRoutes = require("./private/feedback"); // ./feedback/index.js

// Mount routes with prefixes
router.use("/public/api/auth", authRoutes);
router.use("/public/api/forget_password", forgetPasswordRoutes);

router.use("/private/api/swaps", authMiddleware, swapRoutes);
// router.use("/private/api/feedback", feedbackRoutes);
router.use("/private/api/users", authMiddleware, users);

router.use("/private/api/skills", authMiddleware, skillRoutes);
router.use("/private/api/chat", authMiddleware,chatRoutes);

// Uuse the authMiddleware -> to all private-routes

module.exports = router;
