import React, { useState, useEffect } from "react";
import Ssidebar from "../sidebar/Ssidebar"; // Import the Ssidebar component
import "./Academics.css"; // Import the CSS file for styling
import Header from "../Header/Header";
const semesters = [
  { semester: "Semester 1", subjects: ["Maths", "Physics", "Chemistry"] },
  { semester: "Semester 2", subjects: ["Maths II", "Programming", "Electronics"] },
  { semester: "Semester 3", subjects: ["Data Structures", "DBMS", "OS"] },
  { semester: "Semester 4", subjects: ["Algorithms", "Software Eng.", "Computer Networks"] },
  { semester: "Semester 5", subjects: ["AI", "Web Dev", "Cyber Security"] },
  { semester: "Semester 6", subjects: ["Machine Learning", "Blockchain", "Data Science"] },
  { semester: "Semester 7", subjects: ["Cloud Computing", "Big Data", "IoT"] },
  { semester: "Semester 8", subjects: ["Project", "Internship", "Advanced AI"] },
];

const Academics = () => {
  const [loading, setLoading] = useState(true); // Simulate loading state

  useEffect(() => {
    // Simulate fetching data from the backend
    setTimeout(() => {
      setLoading(false); // Data fetching complete
    }, 1000); // Simulate 1-second delay
  }, []);

  // Generate random course codes for each subject
  const courseCodes = ["MAT203", "CST302", "CST203", "HUN200", "HUT200", "MAT103"];

  return (
    <div className="academics-page">
      <Header/>
      <Ssidebar activeItem="backlogs" /> {/* Pass the activeItem prop */}
      <div className="academics-container">
        <h2>📚 Academic Records</h2>
        {loading ? (
          <div className="loading-message">Loading...</div>
        ) : semesters.length > 0 ? (
          semesters.map((sem, index) => (
            <div key={index} className="semester-card">
              <h3>{sem.semester}</h3>
              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Code</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {sem.subjects.map((subject, i) => (
                    <tr key={i}>
                      <td>{subject}</td>
                      <td>{courseCodes[Math.floor(Math.random() * courseCodes.length)]}</td>
                      <td>{["A", "B", "C", "D"][Math.floor(Math.random() * 4)]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <div className="no-data-message">No academic records found.</div>
        )}
      </div>
    </div>
  );
};

export default Academics;