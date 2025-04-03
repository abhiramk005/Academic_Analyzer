const express = require("express");
const router = express.Router();
const { getStudentProgress } = require("../controllers/trackProgressController");

// Route to fetch student's progress
router.get("/:userId", getStudentProgress);

module.exports = router;
