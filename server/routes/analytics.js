const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Get all students with all semester results
router.get('/students', async (req, res) => {
  try {
    const students = await Student.aggregate([
      { $unwind: "$semester_results" },
      {
        $project: {
          _id: 0,
          register_number: 1,
          name: 1,
          department: 1,
          batch: 1,
          semester: "$semester_results.semester",
          semester_gpa: "$semester_results.gpa",
          subjects: "$semester_results.subjects",
          failed_subjects: {
            $filter: {
              input: "$semester_results.subjects",
              as: "subject",
              cond: { $eq: ["$$subject.status", "Fail"] }
            }
          }
        }
      }
    ]);

    // Transform to frontend format
    const result = students.map(student => ({
      id: student.register_number,
      name: student.name,
      semester: `S${student.semester}`,
      backlogs: student.failed_subjects.length,
      cgpa: student.semester_gpa.toFixed(2),
      batch: student.batch,
      subjects: student.subjects.map(sub => sub.subject_code)
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get filtered students
router.get('/students/filter', async (req, res) => {
  try {
    const { semester, batch, search } = req.query;
    
    let matchStage = {};
    
    if (semester && semester !== 'all') {
      matchStage['semester_results.semester'] = parseInt(semester.replace('S', ''));
    }
    
    if (batch && batch !== 'all') {
      const batchCode = batch.slice(2);
      matchStage['register_number'] = { $regex: `WYD${batchCode}` };
    }
    
    if (search && search.trim() !== '') {
      matchStage['$or'] = [
        { register_number: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    let aggregationPipeline = [
      { $match: matchStage },
      { $unwind: "$semester_results" }
    ];

    // Add semester filter if specified
    if (semester && semester !== 'all') {
      aggregationPipeline.push({
        $match: { "semester_results.semester": parseInt(semester.replace('S', '')) }
      });
    }

    aggregationPipeline.push({
      $project: {
        _id: 0,
        register_number: 1,
        name: 1,
        department: 1,
        batch: 1,
        semester: "$semester_results.semester",
        semester_gpa: "$semester_results.gpa",
        subjects: "$semester_results.subjects",
        failed_subjects: {
          $filter: {
            input: "$semester_results.subjects",
            as: "subject",
            cond: { $eq: ["$$subject.status", "Fail"] }
          }
        }
      }
    });

    const students = await Student.aggregate(aggregationPipeline);

    // Transform to frontend format
    const result = students.map(student => ({
      id: student.register_number,
      name: student.name,
      semester: `S${student.semester}`,
      backlogs: student.failed_subjects.length,
      cgpa: student.semester_gpa.toFixed(2),
      batch: student.batch,
      subjects: student.subjects.map(sub => sub.subject_code)
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
