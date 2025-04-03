const mongoose = require("mongoose");

const studentfetchSchema = new mongoose.Schema({
  register_number: String,
  department: String,
  batch: String,
  semester_results: [
    {
      semester: Number,
      subjects: [
        {
          name: String,
          status: String, // "Pass" or "Fail"
          attempts: Number, // Number of attempts taken
        },
      ],
    },
  ],
});

// Prevent OverwriteModelError
const Student = mongoose.models.Student || mongoose.model("Student", studentfetchSchema);

module.exports = Student;