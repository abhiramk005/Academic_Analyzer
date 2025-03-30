import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Ssidebar.css";

function Ssidebar({ activeItem }) {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();

  // Automatically open the Dashboard dropdown if the activeItem is "backlogs" or "track-progress"
  useEffect(() => {
    if (activeItem === "backlogs" || activeItem === "track-progress") {
      setOpen(1); // Keep Dashboard section open
    }
  }, [activeItem]);

  const handleOpen = (value) => {
    setOpen(open === value ? null : value);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("role"); // Clear role from localStorage
      localStorage.removeItem("token"); // Clear token (if applicable)
      navigate("/"); // Redirect to login page
    }
  };

  const handleHomeClick = () => {
    navigate("/studlogin"); // Navigate to /adminlogin
  };

  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
      <li onClick={handleHomeClick}>🏠 Home</li> {/* Home button */}
        <li>
          <button className="accordion-header" onClick={() => handleOpen(1)}>
            📊 Dashboard
            <span className={`arrow ${open === 1 ? "open" : ""}`}>&#9660;</span>
          </button>
          {open === 1 && (
            <ul className="submenu">
              <li
                className={activeItem === "backlogs" ? "active" : ""}
                onClick={() => navigate("/studlogin/backlogs")}
              >
                📝 View Academics
              </li>
              <li
                className={activeItem === "track-progress" ? "active" : ""}
                onClick={() => navigate("/studlogin/track-progress")}
              >
                📈 Track Progress
              </li>
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
        <li onClick={handleLogout}>🚪 Log Out</li> {/* Logout with confirmation */}
      </ul>
    </div>
  );
}

export default Ssidebar;