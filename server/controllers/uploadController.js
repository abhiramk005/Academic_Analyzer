const Student = require("../models/Student");
const { processStudentData, createNewStudent } = require("../services/studentService");
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require("../utils/constants");

async function uploadResults(req, res) {
  try {
    const { studentsData, semester, batch, resultType } = req.body;

    if (!studentsData || !semester || !batch || !resultType) {
      return res.status(400).json({ error: ERROR_MESSAGES.MISSING_FIELDS });
    }

    const selectedBatch = parseInt(batch);
    const selectedSemester = parseInt(semester);

    for (const data of studentsData) {
      const isRegularStudent = data.batch === selectedBatch;
      let student = await Student.findOne({ register_number: data.register_number });

      if (!student) {
        const newStudentData = await createNewStudent(data, selectedSemester, isRegularStudent);
        student = new Student(newStudentData);
      } else {
        await processStudentData(student, data, selectedSemester, isRegularStudent,resultType);
      }

      await student.save();
    }

    res.status(201).json({ message: SUCCESS_MESSAGES.UPLOAD_SUCCESS });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: ERROR_MESSAGES.SERVER_ERROR });
  }
}

module.exports = {
  uploadResults,
};