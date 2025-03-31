import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // If using React Router
import "./Home.css";
import Studenthome from "../student/Studenthome";
import Adminhome from "../admin/Adminhome"; // Import Admin Sidebar

const Home = () => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the role from localStorage, API, or context
    const userRole = localStorage.getItem("role"); // Example: 'student' or 'admin'
    if (!userRole) {
      navigate("/login"); // Redirect to login if no role found
    } else {
      setRole(userRole);
    }
  }, [navigate]);

  return (
    <div className="home-container">
      {role === "student" ? <Studenthome /> : role === "admin" ? <Adminhome /> : <p>Loading...</p>}
    </div>
  );
};

export default Home;
