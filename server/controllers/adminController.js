const Student = require("../models/Student");

// Function to get dashboard statistics
exports.getAdminDashboardStats = async (req, res) => {
  try {
    // Fetch all students
    const totalStudents = await Student.countDocuments();

    // Find students with at least one backlog
    const studentsWithBacklogs = await Student.countDocuments({
      "semester_results.subjects.grade": { $in: ["F", "Fail"] },
    });

    // Count total backlog subjects
    const allStudents = await Student.find({}, "semester_results.subjects.grade");
    let totalBacklogs = 0, totalSubjects = 0, totalPassedSubjects = 0;

    allStudents.forEach(student => {
      student.semester_results.forEach(sem => {
        sem.subjects.forEach(subject => {
          totalSubjects++;
          if (subject.grade === "F" || subject.grade === "Fail") {
            totalBacklogs++;
          } else {
            totalPassedSubjects++;
          }
        });
      });
    });

    // Calculate pass rate
    const averagePassRate = totalSubjects ? ((totalPassedSubjects / totalSubjects) * 100).toFixed(2) : 0;

    res.json({
      totalStudents,
      totalBacklogs,
      studentsWithBacklogs: ((studentsWithBacklogs / totalStudents) * 100).toFixed(2) + "%",
      averagePassRate: averagePassRate + "%",
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.manualUpload = async (req, res) => {
  try {
    const { registerNumber, semesterNumber, subjects } = req.body;

    if (!registerNumber || !semesterNumber || !subjects) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    let student = await Student.findOne({ registerNumber });

    if (!student) {
      // New student entry
      student = new Student({
        registerNumber,
        semester_results: [
          {
            semesterNumber,
            subjects,
          },
        ],
      });
    } else {
      const semesterIndex = student.semester_results.findIndex(
        (s) => s.semesterNumber === semesterNumber
      );

      if (semesterIndex !== -1) {
        // Update existing semester subjects
        student.semester_results[semesterIndex].subjects = subjects;
      } else {
        // Add new semester entry
        student.semester_results.push({ semesterNumber, subjects });
      }
    }

    await student.save();
    res.status(200).json({ message: "Student data uploaded/updated successfully" });
  } catch (error) {
    console.error("Manual upload error:", error);
    res.status(500).json({ message: "Server error during manual upload" });
  }
};
