import React from "react";
import { useState, useEffect } from "react";
import Ssidebar from "../sidebar/Ssidebar"; // Import the Ssidebar component
import "./Studenthome.css"; // Import the CSS file for Studenthome
import Header from "../Header/Header";

const userId = localStorage.getItem("userId");
function Studenthome() {
  const [backlogs, setBacklogs] = useState(0);
  const [clearedBacklogs, setClearedBacklogs] = useState(0);
  
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/reporting/student/${userId}/backlogs`);
        if (!response.ok) {
          throw new Error("Failed to fetch student data");
        }
        const data = await response.json();
        console.log(data)

        setBacklogs(data.totalBacklogs || 0);
        setClearedBacklogs(data.clearedBacklogs || 0);
        //setOngoingCourses(data.ongoingCourses || 0);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    if (userId) {
      fetchStudentData();
    }
  }, [userId]);
  
  return (
    <div className="student-container">
      <Header/>
      <Ssidebar activeItem="dashboard" /> {/* Sidebar with active dashboard */}

      <div className="main-content">
        {/* Welcome Message */}
        <div className="welcome-message">
          <h2>Welcome back, {userId}!</h2>
          <p>Here's a quick overview of your academic progress.</p>
        </div>

        {/* Academic Progress Summary */}
        <div className="progress-summary">
          <div className="summary-card">
            <h3>Total Backlogs</h3>
            <p>{backlogs}</p>
          </div>
          <div className="summary-card">
            <h3>Cleared Backlogs</h3>
            <p>{clearedBacklogs}</p>
          </div>
          
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          
          <button className="action-button">View Academics</button>
          <button className="action-button">Report Issue</button>
          <button className="action-button">Access Resources</button>
        </div>

        {/* Visual Progress Tracker */}
        <div className="progress-tracker">
          <h3>Your Progress</h3>
          <div className="progress-bar">
            <div className="progress" style={{ width: "33%" }}></div>
          </div>
          <p>75% of courses cleared</p>
        </div>
      </div>
    </div>
  );
}

export default Studenthome;