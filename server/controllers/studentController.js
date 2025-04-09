const Student = require("../models/reportfetchmodel");

// Fetch all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Error fetching students" });
  }
};

// Get student backlogs
const getStudentBacklogs = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Fetching backlogs for student:", userId);

    // Find student to retrieve the register number
    const student = await Student.findOne({ register_number: userId });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const registerNumber = student.register_number;

    // Aggregation pipeline for total backlogs (failed subjects)
    const totalBacklogsResult = await Student.aggregate([
      { $unwind: "$semester_results" },
      { $unwind: "$semester_results.subjects" },
      {
        $match: {
          "register_number": registerNumber,
          "semester_results.subjects.status": "Fail",
        },
      },
      {
        $group: {
          _id: "$register_number",
          totalBacklogs: { $sum: 1 },
        },
      },
    ]);

    // Aggregation pipeline for cleared backlogs (passed subjects with multiple attempts)
    const clearedBacklogsResult = await Student.aggregate([
      { $unwind: "$semester_results" },
      { $unwind: "$semester_results.subjects" },
      {
        $match: {
          "register_number": registerNumber,
          "semester_results.subjects.status": "Pass",
          "semester_results.subjects.attempts": { $gt: 1 },
        },
      },
      {
        $group: {
          _id: "$register_number",
          clearedBacklogs: { $sum: 1 },
        },
      },
    ]);

    res.json({
      totalBacklogs: totalBacklogsResult.length > 0 ? totalBacklogsResult[0].totalBacklogs : 0,
      clearedBacklogs: clearedBacklogsResult.length > 0 ? clearedBacklogsResult[0].clearedBacklogs : 0,
    });

  } catch (error) {
    console.error("Error fetching student backlogs:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Filter students based on WOB or WB criteria
// Filter students based on WOB or WB criteria
const filterStudents = async (req, res) => {
  try {
    const { semester, batch, department, status } = req.query;
    console.log("Filtering students with criteria:", req.query);

    let matchStage = {};

    // Semester filter
    if (semester && semester !== "all") {
      matchStage["semester_results.semester"] = { $lte: parseInt(semester.replace("S", "")) };
    }

    // Batch filter (based on register number prefix)
    if (batch && batch !== "all") {
      const batchCode = batch.slice(2); // e.g., "2020" -> "20"
      matchStage["register_number"] = { $regex: `^WYD${batchCode}` };
    }

    if (department && department !== "all") {
      matchStage["department"] = department;
    }

    let aggregationPipeline = [
      { $match: matchStage },
      { $unwind: "$semester_results" },
      { $unwind: "$semester_results.subjects" },
      {
        $group: {
          _id: "$register_number",
          totalSubjects: { $sum: 1 },
          passedOnFirstAttempt: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$semester_results.subjects.status", "Pass"] },
                    { $eq: ["$semester_results.subjects.attempts", 1] }
                  ]
                },
                1,
                0
              ]
            }
          },
          passedWithMultipleAttempts: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$semester_results.subjects.status", "Pass"] },
                    { $gt: ["$semester_results.subjects.attempts", 1] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ];

    // Apply WOB and WB filters
    if (status === "wob_success") {
      aggregationPipeline.push({
        $match: { $expr: { $eq: ["$totalSubjects", "$passedOnFirstAttempt"] } }
      });
    } else if (status === "wb_success") {
      aggregationPipeline.push({
        $match: { $expr: { $eq: ["$totalSubjects", "$passedWithMultipleAttempts"] } }
      });
    }

    // Get filtered register numbers
    const filteredResult = await Student.aggregate(aggregationPipeline);
    const registerNumbers = filteredResult.map(r => r._id);

    // Fetch full student documents based on filtered register numbers
    const fullStudents = await Student.find({
      register_number: { $in: registerNumbers }
    });

    res.json(fullStudents);
  } catch (error) {
    console.error("Error filtering students:", error);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = { getAllStudents, getStudentBacklogs, filterStudents };
