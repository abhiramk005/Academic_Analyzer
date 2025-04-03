const { calculateGPA, getDepartmentAndBatch } = require("../utils/helpers");

async function processStudentData(student, data, selectedSemester, isRegularStudent,resultType) {
  const semesterIndex = student.semester_results.findIndex(
    (result) => result.semester === selectedSemester
  );
  if(resultType === "revaluation"){
    // Revaluation logic - update grades without changing attempts
    if (semesterIndex === -1) {
      throw new Error("Cannot process revaluation for non-existent semester");
    }

    const semesterData = student.semester_results[semesterIndex];
    
    semesterData.subjects.forEach((subject) => {
      const subjectResult = data.subjects.find(
        (s) => s.code === subject.subject_code
      );
      if (subjectResult && subjectResult.grade !== "No change") {
        // Only update grade and status, don't increment attempts
        subject.grade = subjectResult.grade;
        subject.status = subjectResult.grade === "F" ? "Fail" : "Pass";
      }
    });

    semesterData.gpa = calculateGPA(semesterData.subjects);
  }
  else if (!isRegularStudent) {
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

      semesterData.subjects.forEach((subject) => {
        const subjectResult = data.subjects.find(
          (s) => s.code === subject.subject_code
        );
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
    if (semesterIndex !== -1) return; // Skip if semester already exists

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
}

async function createNewStudent(data, selectedSemester, isRegularStudent) {
  const { department, batch: regBatch } = getDepartmentAndBatch(data.register_number);
  const initialAttempts = isRegularStudent ? 1 : 2;

  const subjects = data.subjects.map(({ code, grade }) => ({
    subject_code: code,
    subject_name: code,
    grade: grade,
    credits: 4,
    attempts: initialAttempts,
    status: grade === "F" || grade.toLowerCase() === "withheld" ? "Fail" : "Pass",
  }));

  return {
    register_number: data.register_number,
    name: "Unknown",
    department: department,
    batch: regBatch,
    semester_results: [
      {
        semester: selectedSemester,
        subjects: subjects,
        gpa: calculateGPA(subjects),
      },
    ],
  };
}

module.exports = {
  processStudentData,
  createNewStudent,
};