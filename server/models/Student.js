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

const studentSchema = new mongoose.Schema({
 // _id: mongoose.Schema.Types.ObjectId,  // MongoDB's unique ID
  register_number: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  batch: { type: Number, required: true },
  semester_results: [semesterResultSchema],
});

module.exports = mongoose.model("Student", studentSchema);