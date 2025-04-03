const Student = require("../models/Student"); // Use Student model instead of AcademicResult

// Get student academic results by register number
exports.getStudentResults = async (req, res) => {
  try {
    const { register_number } = req.params;

    const studentResults = await Student.findOne(
      { register_number }, 
      { _id: 0, register_number: 1, semester_results: 1 } // Select only required fields
    );

    if (!studentResults) {
      return res.status(404).json({ message: "Student results not found" });
    }

    res.json(studentResults);
  } catch (error) {
    console.error("Error fetching student results:", error);
    res.status(500).json({ message: "Server error" });
  }
};
