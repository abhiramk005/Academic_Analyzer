import React from "react";
import Ssidebar from "../sidebar/Ssidebar"; // Import the Ssidebar component
import "./TrackProgress.css"; // Create a CSS file for styling
import Header from "../Header/Header";
const TrackProgress = () => {
    // Dummy data for course progress
    const courses = [
      { name: "Semester 1", progress: 100 },
      { name: "Semester 2", progress: 100 },
      { name: "Semester 3", progress: 100 },
      { name: "Semester 4", progress: 100 },
      { name: "Semester 5", progress: 100 },
      { name: "Semester 6", progress: 0 },
      { name: "Semester 7", progress: 0 },
      { name: "Semester 8", progress: 0 }
    ];
  
    return (
      <div className="track-progress-page">
        <Header/>
        <Ssidebar activeItem="track-progress" /> {/* Pass the activeItem prop */}
        <div className="track-progress-container">
          <h2>📊 Track Progress</h2>
          <div className="progress-cards">
            {courses.map((course, index) => (
              <div key={index} className="progress-card">
                <h3>{course.name}</h3>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <p>Completed: {course.progress}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default TrackProgress;