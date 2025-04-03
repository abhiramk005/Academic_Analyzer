const Student = require("../models/Student");

exports.getStudentProgress = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from request params

    // Fetch student data from MongoDB
    const student = await Student.findOne({ register_number: userId });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Initialize progress tracking
    const semesters = {};
    const totalSemesters = 8;

    // Iterate over each semester's results
    student.semester_results.forEach((semester) => {
      const totalSubjects = semester.subjects.length;
      const passedSubjects = semester.subjects.filter(sub => sub.grade !== "F").length;

      // Calculate progress percentage
      semesters[semester.semester] = (passedSubjects / totalSubjects) * 100;
    });

    // Fill missing semesters with 0% progress
    for (let i = 1; i <= totalSemesters; i++) {
      if (!semesters[i]) semesters[i] = 0;
    }

    res.json({ progress: semesters });
  } catch (error) {
    console.error("Error fetching student progress:", error);
    res.status(500).json({ message: "Server error" });
  }
};
