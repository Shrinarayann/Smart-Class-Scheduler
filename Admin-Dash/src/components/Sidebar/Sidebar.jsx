import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ isOpen }) {
  const location = useLocation();
  
  const menuItems = [
    { path: '/dashboard', icon: 'fa-tachometer-alt', label: 'Dashboard' },
    { path: '/students', icon: 'fa-user-graduate', label: 'Students' },
    { path: '/courses', icon: 'fa-book', label: 'Courses' },
    { path: '/schedule', icon: 'fa-calendar-alt', label: 'Schedule' },
  ];

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
      </nav>
    </div>
  );
}

export default Sidebar;