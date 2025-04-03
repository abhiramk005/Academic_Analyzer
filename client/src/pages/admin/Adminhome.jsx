import React, { useState, useEffect } from "react";
import Asidebar from "../sidebar/Asidebar"; // Import the Asidebar component
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Adminhome.css"; // Import the CSS file for Adminhome
import Header from "../Header/Header";
function Adminhome() {
  const [adminName, setAdminName] = useState("");
  const [systemOverview, setSystemOverview] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate
  
  const [studentProgress, setStudentProgress] = useState({
    studentsWithBacklogs: "0%",
    averagePassRate: "0%",
  });


  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/admin/dashboard/stats");
        if (!response.ok) throw new Error("Failed to fetch dashboard stats");
  
        const data = await response.json();
        setSystemOverview({
          totalStudents: data.totalStudents,
          totalBacklogs: data.totalBacklogs,
          resolvedIssues: 0, // You can update this if tracking issue resolution
        });
        setStudentProgress({
          studentsWithBacklogs: data.studentsWithBacklogs,
          averagePassRate: data.averagePassRate,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };
  
    fetchDashboardStats();
  }, []);

  return (
    <div className="admin-container">
      <Header/>
      <Asidebar /> {/* Sidebar */}
      <div className="main-content">
        {/* Welcome Message */}
        <div className="welcome-message">
          <h2>Welcome, {adminName}!</h2>
          <p>Here's a quick overview of the system's performance.</p>
        </div>

        {/* System Overview */}
        <div className="system-overview">
          <div className="overview-card">
            <h3>Total Students</h3>
            <p>{systemOverview.totalStudents}</p>
          </div>
          <div className="overview-card">
            <h3>Total Backlogs</h3>
            <p>{systemOverview.totalBacklogs}</p>
          </div>
          <div className="overview-card">
            <h3>Resolved Issues</h3>
            <p>{systemOverview.resolvedIssues}</p>
          </div>
        </div>

        {/* Student Progress Summary */}
        <div className="student-progress">
          <h3>Student Progress</h3>
          <div className="progress-card">
            <h4>Students with Backlogs</h4>
            <p>{studentProgress.studentsWithBacklogs}</p>
          </div>
          <div className="progress-card">
            <h4>Average Pass Rate</h4>
            <p>{studentProgress.averagePassRate}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <button onClick={() => navigate("/admin/upload")}>Upload Results</button> {/* Navigate to Upload page */}
          <button onClick={() => navigate("/admin/reporting")}>Generate Reports</button>
          <button onClick={() => console.log("Manage Issues")}>Manage Issues</button>
        </div>

        
       
        <br />
        {/* Visual Analytics */}
        {/*<div className="visual-analytics">
          <h3>Backlog Trends</h3>
          {/* Add a chart component here (e.g., BarChart) }
          <p>charts</p>
        </div>*/}
      </div>
    </div>
  );
}

export default Adminhome;