import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import './Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // perform logout logic here (e.g., clearing auth)
    navigate("/login");
  };

  return (
    <nav>
      <div className="nav-container">
        <div className="nav-logo">Student Dashboard</div>

        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>

        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <NavLink to="/" className="nav-link">Dashboard</NavLink>
          <NavLink to="/catalog" className="nav-link">Courses</NavLink>
          <NavLink to="/schedule" className="nav-link">Schedule</NavLink>
        </div>

        {/* Profile Section */}
        <div className="nav-profile">
          <div
            className="profile-icon"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            👤
          </div>
          {isDropdownOpen && (
            <div className="profile-dropdown">
              <NavLink to="/profile" className="dropdown-item">Profile</NavLink>
              <NavLink to="/settings" className="dropdown-item">Settings</NavLink>
              <button onClick={handleLogout} className="dropdown-item button-item">Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
