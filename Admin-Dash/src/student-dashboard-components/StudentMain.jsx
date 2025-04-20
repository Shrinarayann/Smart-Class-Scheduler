import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomeDashboard from './components/HomeDashboard';
import CourseCatalog from './components/CourseCatalog';
import ScheduleView from './components/ScheduleView';
import ProfileView from './components/ProfileView'; // Updated component path

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
  const [studentInfo, setStudentInfo] = useState({});
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      // If no token found, fall back to mock data
      setUseMockData(true);
      setStudentInfo(mockStudentInfo);
      setEnrolledCourses(mockEnrolledCourses);
      setAvailableCourses(mockCourses);
      setLoading(false);
      return;
    }
    
    // Fetch real data
    fetchStudentData();
    fetchEnrolledCourses();
    fetchAvailableCourses();
  }, []);

  const fetchStudentData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch('http://localhost:8080/api/v1/student/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch student data');
      }
      
      const data = await response.json();
      setStudentInfo(data);
    } catch (error) {
      console.error('Error fetching student data:', error);
      setError('Failed to load student profile');
      // Fall back to mock data
      setStudentInfo(mockStudentInfo);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) return;
      
      const response = await fetch('http://localhost:8080/api/v1/student/schedule', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch enrolled courses');
      }
      
      const data = await response.json();
      setEnrolledCourses(data);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      // Fall back to mock data
      setEnrolledCourses(mockEnrolledCourses);
    }
  };

  const fetchAvailableCourses = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) return;
      
      const response = await fetch('http://localhost:8080/api/v1/course/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch available courses');
      }
      
      const data = await response.json();
      setAvailableCourses(data);
    } catch (error) {
      console.error('Error fetching available courses:', error);
      // Fall back to mock data
      setAvailableCourses(mockCourses);
    }
  };

  const handleEnroll = async (course) => {
    if (enrolledCourses.some(c => c.id === course.id)) {
      return; // Already enrolled
    }
    
    if (useMockData) {
      // Just update state if using mock data
      setEnrolledCourses([...enrolledCourses, course]);
      return;
    }
    
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) throw new Error('Authentication token not found');
      
      const response = await fetch(`http://localhost:8080/api/v1/student/enroll/${course.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to enroll in course');
      }
      
      // Update local state
      setEnrolledCourses([...enrolledCourses, course]);
    } catch (error) {
      console.error('Error enrolling in course:', error);
      setError(`Failed to enroll in ${course.title}. Please try again.`);
    }
  };

  const handleUnenroll = async (courseId) => {
    if (useMockData) {
      // Just update state if using mock data
      setEnrolledCourses(enrolledCourses.filter(course => course.id !== courseId));
      return;
    }
    
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) throw new Error('Authentication token not found');
      
      const response = await fetch(`http://localhost:8080/api/v1/student/unenroll/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to unenroll from course');
      }
      
      // Update local state
      setEnrolledCourses(enrolledCourses.filter(course => course.id !== courseId));
    } catch (error) {
      console.error('Error unenrolling from course:', error);
      setError('Failed to unenroll from course. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('authToken');
    
    if (onLogout) {
      onLogout(); // Call the parent's logout handler if provided
    }
  };

  // Show loading indicator
  if (loading) {
    return <div className="SD-flex SD-justify-center SD-items-center SD-h-screen SD-bg-gray-100">Loading your data...</div>;
  }

  return (
    <div className="SD-flex SD-h-screen SD-bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        studentInfo={studentInfo}
        onLogout={handleLogout}
      />
      
      {/* Main Content */}
      <div className="SD-flex-1 SD-overflow-y-auto">
        <Header
          activeTab={activeTab}
          studentInfo={studentInfo}
          onLogout={handleLogout}
        />
        
        <main className="SD-page-container">
          {error && (
            <div className="SD-bg-red-100 SD-border-l-4 SD-border-red-500 SD-text-red-700 SD-p-4 SD-mb-4" role="alert">
              <p>{error}</p>
              <button 
                className="SD-text-red-700 SD-font-bold SD-hover:text-red-900" 
                onClick={() => setError(null)}
              >
                Dismiss
              </button>
            </div>
          )}
          
          {activeTab === 'home' && (
            <HomeDashboard 
              studentInfo={studentInfo} 
              enrolledCourses={enrolledCourses} 
            />
          )}
          
          {activeTab === 'courses' && (
            <CourseCatalog 
              courses={availableCourses} 
              enrolledCourses={enrolledCourses} 
              onEnroll={handleEnroll} 
            />
          )}
          
          {activeTab === 'schedule' && (
            <ScheduleView 
              enrolledCourses={enrolledCourses} 
              onUnenroll={handleUnenroll} 
            />
          )}
          
          {activeTab === 'profile' && (
            <ProfileView 
              studentInfo={studentInfo} 
            />
          )}
          
          {activeTab === 'settings' && (
            <div className="SD-text-center SD-text-gray-600 SD-p-8">
              Settings would appear here
            </div>
          )}
        </main>
      </div>
    </div>
  );
}