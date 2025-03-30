import React from "react";
import "./Header.css"; // Import the CSS file for styling

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="website-name">Academic Analyzer</h1>
        {/* You can add a logo here if you have one */}
        {/* <img src="logo.png" alt="Academic Analyzer Logo" className="logo" /> */}
      </div>
    </header>
  );
}

export default Header;