import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ isOpen, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const menuItems = [
    { path: '/dashboard', icon: 'fa-tachometer-alt', label: 'Dashboard' },
    { path: '/students', icon: 'fa-user-graduate', label: 'Students' },
    { path: '/courses', icon: 'fa-book', label: 'Courses' },
    { path: '/schedule', icon: 'fa-calendar-alt', label: 'Schedule' },
    { path: '/teaching-assistants', icon: 'fa-chalkboard-teacher', label: 'Teaching Assistants' }
  ];

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('authToken');
    
    // Call the onLogout function if provided
    if (onLogout) {
      onLogout();
    }
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className={`sidebar ${isOpen ? '' : 'collapsed'}`}>
      <div className="logo">
        {isOpen ? 'EduAdmin' : 'EA'}
      </div>
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <i className={`fas ${item.icon}`}></i>
            {isOpen && <span>{item.label}</span>}
          </Link>
        ))}
        
        {/* Logout Button */}
        <button 
          className="menu-item logout-button" 
          onClick={handleLogout}
        >
          <i className="fas fa-sign-out-alt"></i>
          {isOpen && <span>Logout</span>}
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;