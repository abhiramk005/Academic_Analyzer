import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Asidebar.css";

function Asidebar({ activeItem }) {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  // Automatically open the Dashboard dropdown if the active item is "upload"
  useEffect(() => {
    if (activeItem === "upload") {
      setOpen(1); // 1 corresponds to the Dashboard section
    }
  }, [activeItem]);

  const handleOpen = (value) => {
    setOpen(open === value ? null : value);
  };

  // Logout function
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("role"); // Clear role from localStorage
      localStorage.removeItem("token"); // Clear token (if applicable)
      navigate("/"); // Redirect to login page
    }
  };
  const handleHomeClick = () => {
    navigate("/adminlogin"); // Navigate to /adminlogin
  };
  

  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
      <li onClick={handleHomeClick}>🏠 Home</li> {/* Home button */}
        <li>
          <button className="accordion-header" onClick={() => handleOpen(1)}>
            📊Dashboard
            <span className={`arrow ${open === 1 ? "open" : ""}`}>&#9660;</span>
          </button>
          {open === 1 && (
            <ul className="submenu">
              <li
  className={activeItem === "analytics" ? "active" : ""}
  onClick={() => navigate("/admin/analytics")}
>
  📈 Analytics
</li>
              <li
                className={activeItem === "upload" ? "active" : ""}
                onClick={() => navigate("/admin/upload")}
              >
                📤 Upload Results
              </li>
              <li
              className={activeItem === "reporting"?"active":""}
              onClick={() => navigate("/admin/reporting")}>📑 Reporting</li>
            </ul>
          )}
        </li>
        <li>
          <button className="accordion-header" onClick={() => handleOpen(2)}>
            ☎️ Contact
            <span className={`arrow ${open === 2 ? "open" : ""}`}>&#9660;</span>
          </button>
          {open === 2 && (
            <ul className="submenu">
              <li>ℹ️ About</li>
              <li>⚠️ Report Bugs</li>
            </ul>
          )}
        </li>
        <hr className="divider" />
        <li>👤 Profile</li>
        <li>🔔 Notifications</li>
        <li>⚙️ Settings</li>
        <li onClick={handleLogout}>🚪 Log Out</li> {/* Add logout functionality */}
      </ul>
    </div>
  );
}

export default Asidebar;