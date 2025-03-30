const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "http://localhost:5173", methods: "GET,POST", credentials: true }));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

const upload = multer({ dest: "uploads/" });

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/Academic-analyzer", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("✅ Connected to MongoDB"));

// Define Student schema
const studentSchema = new mongoose.Schema({
  register_number: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  batch: { type: Number, required: true },
  semester_results: [
    {
      semester: { type: Number, required: true },
      subjects: [
        {
          subject_code: { type: String, required: true },
          subject_name: { type: String, required: true },
          grade: { type: String, required: true },
          credits: { type: Number, required: true },
          attempts: { type: Number, default: 1 },
          status: { type: String, enum: ["Pass", "Fail"], required: true },
        },
      ],
      gpa: { type: Number, required: true },
    },
  ],
});
const Student = mongoose.model("Student", studentSchema);

// Function to extract department and batch from register number
function getDepartmentAndBatch(registerNumber) {
  const departmentMapping = {
    CS: "Computer Science",
    EC: "Electronics and Communication",
    ME: "Mechanical",
    EE: "Electrical",
    CEE: "Civil and Environment",
  };

  const match = registerNumber.match(/WYD(\d{2})([A-Z]+)/);
  if (match) {
    const batch = parseInt(match[1]) + 2000;
    const deptCode = match[2].substring(0, 3);
    return {
      department: departmentMapping[deptCode] || "Unknown",
      batch: batch
    };
  }
  return { department: "Unknown", batch: 0 };
}

// Extract data from PDF
async function extractAndConvertToJson(pdfBuffer) {
  const data = await pdfParse(pdfBuffer);
  let text = data.text.replace(/\n/g, " ");

  const registerPattern = /(L?WYD\d{2}[A-Z]{2,3}\d{3}).*?(?=L?WYD\d{2}[A-Z]{2,3}\d{3}|$)/g;
  const matches = text.match(registerPattern);

  if (!matches) throw new Error("No matching register numbers found.");

  return matches.map((line) => {
    line = line.trim();
    const registerNumberMatch = line.match(/L?WYD\d{2}[A-Z]{2,3}\d{3}/);
    if (!registerNumberMatch) throw new Error("Invalid register number format.");

    const registerNumber = registerNumberMatch[0];
    const restPart = line.slice(registerNumber.length).trim();

    const subjects = {};
    restPart.split(/\s+/).forEach((subjectInfo) => {
      const match = subjectInfo.match(/([A-Z0-9]+)\((.*?)\)/);
      if (match) {
        const [subject, grade] = match.slice(1, 3);
        subjects[subject] = grade;
      }
    });

    return { id: registerNumber, ...subjects };
  });
}

// Calculate GPA
function calculateGPA(subjects) {
  let totalCredits = 0, totalPoints = 0;
  const gradePoints = { A: 10, B: 8, C: 6, D: 4, E: 2, F: 0 };

  subjects.forEach(subject => {
    totalCredits += subject.credits;
    totalPoints += (gradePoints[subject.grade] || 0) * subject.credits;
  });

  return totalCredits ? (totalPoints / totalCredits).toFixed(2) : 0;
}

// New Preview Endpoint
app.post("/preview", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });
    if (!req.body.batch) return res.status(400).json({ error: "Batch year is required." });

    const selectedBatch = parseInt(req.body.batch);
    const pdfBuffer = fs.readFileSync(req.file.path);
    const extractedData = await extractAndConvertToJson(pdfBuffer);

    const selectedSemester = parseInt(req.body.semester.replace("Semester ", ""));
    const resultType = req.body.resultType;

    // Process data for preview (without saving to DB)
    const previewData = extractedData.map(data => {
      const regBatchMatch = data.id.match(/WYD(\d{2})/);
      const regBatch = regBatchMatch ? parseInt(regBatchMatch[1]) + 2000 : 0;
      const isRegularStudent = regBatch === selectedBatch;
      
      return {
        register_number: data.id,
        batch: regBatch,
        isRegularStudent,
        subjects: Object.entries(data)
          .filter(([key]) => key !== "id")
          .map(([code, grade]) => ({ code, grade }))
      };
    });

    fs.unlinkSync(req.file.path); // Clean up the file
    res.json({ 
      previewData, 
      semester: selectedSemester, 
      resultType,
      message: "Preview generated successfully"
    });

  } catch (error) {
    console.error(error);
    if (req.file) fs.unlinkSync(req.file.path); // Clean up if error occurs
    res.status(500).json({ error: "Error processing preview" });
  }
});

// Updated Upload Endpoint (now expects processed data)
// Updated Upload Endpoint (now expects processed data)
app.post("/upload", async (req, res) => {
  try {
    const { studentsData, semester, batch, resultType } = req.body;
    
    if (!studentsData || !semester || !batch || !resultType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const selectedBatch = parseInt(batch);
    const selectedSemester = parseInt(semester);

    for (const data of studentsData) {
      const isRegularStudent = data.batch === selectedBatch;
      let student = await Student.findOne({ register_number: data.register_number });

      if (!student) {
        // Create new student record for both regular and supplementary students
        const { department, batch: regBatch } = getDepartmentAndBatch(data.register_number);
        
        // For supplementary students, set attempts to 2 for all subjects
        const initialAttempts = isRegularStudent ? 1 : 2;
        
        const subjects = data.subjects.map(({ code, grade }) => ({
          subject_code: code,
          subject_name: code,
          grade: grade,
          credits: 4,
          attempts: initialAttempts,
          status: grade === "F" || grade.toLowerCase() === "withheld"? "Fail" : "Pass",
        }));

        student = new Student({
          register_number: data.register_number,
          name: "Unknown", // You might want to collect names in the frontend
          department: department,
          batch: regBatch,
          semester_results: [{
            semester: selectedSemester,
            subjects: subjects,
            gpa: calculateGPA(subjects),
          }],
        });

        await student.save();
        continue;
      }

      const semesterIndex = student.semester_results.findIndex(result => result.semester === selectedSemester);

      if (!isRegularStudent) {
        // Supplementary student logic
        if (semesterIndex === -1) {
          // If semester doesn't exist, create it with attempts=2
          const subjects = data.subjects.map(({ code, grade }) => ({
            subject_code: code,
            subject_name: code,
            grade: grade,
            credits: 4,
            attempts: 2,
            status: grade === "F" ? "Fail" : "Pass",
          }));

          student.semester_results.push({
            semester: selectedSemester,
            subjects: subjects,
            gpa: calculateGPA(subjects),
          });
        } else {
          // Update existing semester results
          const semesterData = student.semester_results[semesterIndex];

          semesterData.subjects.forEach(subject => {
            const subjectResult = data.subjects.find(s => s.code === subject.subject_code);
            if (subjectResult && subjectResult.grade !== "No change") {
              subject.grade = subjectResult.grade;
              subject.status = subjectResult.grade === "F" ? "Fail" : "Pass";
              subject.attempts += 1;
            }
          });

          semesterData.gpa = calculateGPA(semesterData.subjects);
        }
      } else {
        // Regular student logic
        if (semesterIndex !== -1) continue; // Skip if semester already exists

        const subjects = data.subjects.map(({ code, grade }) => ({
          subject_code: code,
          subject_name: code,
          grade: grade,
          credits: 4,
          attempts: 1,
          status: grade === "F" ? "Fail" : "Pass",
        }));

        student.semester_results.push({
          semester: selectedSemester,
          subjects: subjects,
          gpa: calculateGPA(subjects),
        });
      }

      await student.save();
    }

    res.status(201).json({ message: "Results saved successfully!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 Server running on port ${PORT}"));