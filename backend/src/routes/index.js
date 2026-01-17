const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

// Public routes
const authRoutes = require("./public/auth");
const forgetPasswordRoutes = require("./public/forget_password");
const publicSkillRoutes = require("./public/skills");
const publicUserRoutes = require("./public/users");
const publicFeedbackRoutes = require("./public/feedback");

// Private routes
const users = require("./private/users");
const skillRoutes = require("./private/skills"); // ./skills/index.js
const swapRoutes = require("./private/swaps"); // ./swaps/index.js
const chatRoutes = require("./private/chat");
const feedbackRoutes = require("./private/feedback"); // ./feedback/index.js

// Mount routes with prefixes
router.use("/public/api/auth", authRoutes);
router.use("/public/api/forget_password", forgetPasswordRoutes);
router.use("/public/api/skills", publicSkillRoutes);
router.use("/public/api/users", publicUserRoutes);
router.use("/public/api/feedback", publicFeedbackRoutes);

router.use("/private/api/swaps", authMiddleware, swapRoutes);
router.use("/private/api/users", authMiddleware, users);

router.use("/private/api/skills", authMiddleware, skillRoutes);
router.use("/private/api/chat", authMiddleware, chatRoutes);
router.use("/private/api/feedback", authMiddleware, feedbackRoutes);

// Uuse the authMiddleware -> to all private-routes

module.exports = router;
