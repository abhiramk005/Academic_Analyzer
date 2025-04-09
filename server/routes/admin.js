const express = require("express");
const router = express.Router();

const { getAdminDashboardStats, manualUpload } = require("../controllers/adminController");
// Route to fetch admin dashboard statistics
router.get("/dashboard/stats", getAdminDashboardStats);
router.post("/manual-upload", manualUpload);

module.exports = router;
