const express = require("express");
const router = express.Router();
const { getStudentResults } = require("../controllers/academicController");

// Route to fetch student results using register number
router.get("/results/:register_number", getStudentResults);

module.exports = router;
