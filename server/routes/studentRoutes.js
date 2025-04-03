const express = require("express");
const { getAllStudents, filterStudents, getStudentBacklogs } = require("../controllers/studentController");

const router = express.Router();

router.get("/students", getAllStudents); // Accessible via `/api/students`
router.get("/students/filter", filterStudents); // Accessible via `/api/students/filter`
router.get("/student/:userId/backlogs", getStudentBacklogs);

module.exports = router;
