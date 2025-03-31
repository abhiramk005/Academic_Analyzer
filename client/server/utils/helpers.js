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
        batch: batch,
      };
    }
    return { department: "Unknown", batch: 0 };
  }
  
  function calculateGPA(subjects) {
    let totalCredits = 0,
      totalPoints = 0;
    const gradePoints = { A: 10, B: 8, C: 6, D: 4, E: 2, F: 0 };
  
    subjects.forEach((subject) => {
      totalCredits += subject.credits;
      totalPoints += (gradePoints[subject.grade] || 0) * subject.credits;
    });
  
    return totalCredits ? (totalPoints / totalCredits).toFixed(2) : 0;
  }
  
  module.exports = {
    getDepartmentAndBatch,
    calculateGPA,
  };