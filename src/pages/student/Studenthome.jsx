import React from "react";
import Ssidebar from "../sidebar/Ssidebar"; // Import the Ssidebar component
import "./Studenthome.css"; // Import the CSS file for Studenthome
import Header from "../Header/Header";
function Studenthome() {
  return (
    <div className="student-container">
      <Header/>
      <Ssidebar activeItem="dashboard" /> {/* Sidebar with active dashboard */}

      <div className="main-content">
        {/* Welcome Message */}
        <div className="welcome-message">
          <h2>Welcome back, Student!</h2>
          <p>Here's a quick overview of your academic progress.</p>
        </div>

        {/* Academic Progress Summary */}
        <div className="progress-summary">
          <div className="summary-card">
            <h3>Total Backlogs</h3>
            <p>3</p>
          </div>
          <div className="summary-card">
            <h3>Cleared Backlogs</h3>
            <p>1</p>
          </div>
          <div className="summary-card">
            <h3>Ongoing Courses</h3>
            <p>2</p>
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