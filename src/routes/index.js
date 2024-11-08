const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const adminRoutes = require("./adminRoutes");
const rateLimiter = require("../config/rateLimiterConfig");

const router = express.Router();

// Auth Route
router.use("/auth", authRoutes);

// User Route
router.use("/", userRoutes);

// Admin Route
router.use("/admin", adminRoutes);

module.exports = router;
