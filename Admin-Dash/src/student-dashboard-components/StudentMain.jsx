import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomeDashboard from './components/HomeDashboard';
import CourseCatalog from './components/CourseCatalog';
import ScheduleView from './components/ScheduleView';
import ProfileView from './components/Profile';
import { mockStudentInfo, mockCourses, mockEnrolledCourses } from './data/mockData';

// Import CSS
import './StudentPage.css'
import './styles/sidebar.css';
import './styles/header.css';
import './styles/home-dashboard.css';
import './styles/course-catalog.css';
import './styles/schedule-view.css';
import './styles/profile.css';

export default function StudentMain({ onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [courses] = useState(mockCourses);
  const [enrolledCourses, setEnrolledCourses] = useState(mockEnrolledCourses);
  const [studentInfo] = useState(mockStudentInfo);

  const handleEnroll = (course) => {
    if (!enrolledCourses.some(c => c.id === course.id)) {
      setEnrolledCourses([...enrolledCourses, course]);
    }
  };

  const handleUnenroll = (courseId) => {
    setEnrolledCourses(enrolledCourses.filter(course => course.id !== courseId));
  };

  return (
    <div className="SD-flex SD-h-screen SD-bg-gray-100">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        studentInfo={studentInfo} 
        onLogout={onLogout}
      />
  
      {/* Main Content */}
      <div className="SD-flex-1 SD-overflow-y-auto">
        <Header 
          activeTab={activeTab} 
          studentInfo={studentInfo} 
          onLogout={onLogout}
        />
  
        <main className="SD-page-container">
        {activeTab === 'home' && <HomeDashboard studentInfo={studentInfo} enrolledCourses={enrolledCourses} />}
        {activeTab === 'courses' && <CourseCatalog courses={courses} enrolledCourses={enrolledCourses} onEnroll={handleEnroll} />}
        {activeTab === 'schedule' && <ScheduleView enrolledCourses={enrolledCourses} onUnenroll={handleUnenroll} />}
        {activeTab === 'profile' && <ProfileView studentInfo={studentInfo} />}
        {activeTab === 'settings' && <div className="SD-text-center SD-text-gray-600">Settings would appear here</div>}
      </main>
      </div>
    </div>
  );
}