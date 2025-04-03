import React, { useState, useEffect } from "react";
import Ssidebar from "../sidebar/Ssidebar";
import "./Academics.css";
import Header from "../Header/Header";

const Academics = () => {
  const [loading, setLoading] = useState(true);
  const [academicResults, setAcademicResults] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const registerNumber = localStorage.getItem("userId"); // Get from localStorage
        if (!registerNumber) {
          console.error("⚠️ No register number found in localStorage!");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:3001/api/academic/results/${registerNumber}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setAcademicResults(data);
      } catch (error) {
        console.error("❌ Error fetching academic results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="academics-page">
      <Header />
      <Ssidebar activeItem="backlogs" />
      <div className="academics-container">
        <h2>📚 Academic Records</h2>
        {loading ? (
          <div className="loading-message">Loading...</div>
        ) : academicResults ? (
          academicResults.semester_results.map((sem, index) => (
            <div key={index} className="semester-card">
              <h3>Semester {sem.semester}</h3>
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Grade</th>
                    <th>Attempts</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sem.subjects.map((subject, i) => (
                    <tr key={i}>
                      <td>{subject.subject_code}</td>
                      <td>{subject.grade}</td>
                      <td>{subject.attempts}</td>
                      <td>{subject.status}</td>
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
