import React, { useState, useEffect } from "react";
import Ssidebar from "../sidebar/Ssidebar"; 
import Header from "../Header/Header";
import "./TrackProgress.css"; 

const TrackProgress = () => {
  const [courses, setCourses] = useState([]);
  const userId = localStorage.getItem("userId"); // Get userId from localStorage

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/track-progress/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch progress");

        const data = await response.json();
        const formattedCourses = Object.keys(data.progress).map((sem) => ({
          name: `Semester ${sem}`,
          progress: data.progress[sem],
        }));

        setCourses(formattedCourses);
      } catch (error) {
        console.error("Error fetching student progress:", error);
      }
    };

    fetchProgress();
  }, [userId]);

  return (
    <div className="track-progress-page">
      <Header />
      <Ssidebar activeItem="track-progress" />
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
              <p>Completed: {course.progress.toFixed(2)}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrackProgress;
