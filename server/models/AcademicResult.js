const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subject_code: { type: String, required: true },
  subject_name: { type: String, required: true },
  grade: { type: String, required: true },
  credits: { type: Number, required: true },
  attempts: { type: Number, default: 1 },
  status: { type: String, enum: ["Pass", "Fail"], required: true },
});

const semesterResultSchema = new mongoose.Schema({
  semester: { type: Number, required: true },
  subjects: [subjectSchema],
  gpa: { type: Number, required: true },
});

const academicResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to authentication system
  register_number: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  batch: { type: Number, required: true },
  semester_results: {
    type: [semesterResultSchema],
    default: [],
  },
  cgpa: { type: Number, default: 0 },
});

module.exports = mongoose.model("AcademicResult", academicResultSchema);
