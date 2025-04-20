import React from 'react';
import './Header.css';

function Header({ toggleSidebar }) {
  return (
    <header className="header">
      <div className="toggle-button" onClick={toggleSidebar}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="header-title">Education Admin Dashboard</div>
      <div className="header-actions">
        <div className="notification-icon">
          <i className="fas fa-bell"></i>
          <span className="badge">3</span>
        </div>
        <div className="profile-dropdown">
          <img src="./profile.jpeg" alt="Admin" className="profile-img" />
          <span>Admin User</span>
        </div>
      </div>
    </header>
  );
}




export default Header;