const express = require("express");
const router = express.Router();
const { getAdminDashboardStats } = require("../controllers/adminController");

// Route to fetch admin dashboard statistics
router.get("/dashboard/stats", getAdminDashboardStats);

module.exports = router;
