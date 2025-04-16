import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import StudentManagement from './components/StudentManagement/StudentManagement';
import CourseManagement from './components/CourseManagement/CourseManagement';
import ScheduleManagement from './components/ScheduleManagement/ScheduleManagement';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import TeachingAssistants from './components/TA/ta';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className="app-container">
        <Sidebar isOpen={sidebarOpen} />
        <div className={`main-content ${sidebarOpen ? '' : 'expanded'}`}>
          <Header toggleSidebar={toggleSidebar} />
          <div className="page-container">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/students" element={<StudentManagement />} />
              <Route path="/courses" element={<CourseManagement />} />
              <Route path="/schedule" element={<ScheduleManagement />} />
              <Route path="/teaching-assistants" element={<TeachingAssistants />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;

