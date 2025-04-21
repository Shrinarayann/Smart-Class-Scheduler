// import { Home, BookOpen, Calendar, User, Settings, LogOut } from 'lucide-react';

// export default function Sidebar({ activeTab, setActiveTab, studentInfo }) {
//   return (
//     <div className="sidebar">
//       <div className="sidebar-header">
//         <h2 className="sidebar-title">Student Portal</h2>
//       </div>
//       <div className="sidebar-content">
//         <div className="user-profile">
//           <div className="avatar">
//             {studentInfo.name.split(' ').map(n => n[0]).join('')}
//           </div>
//           <div className="user-info">
//             <p className="user-name">{studentInfo.name}</p>
//             <p className="user-id">{studentInfo.id}</p>
//           </div>
//         </div>
        
//         <nav className="nav-menu">
//           <button 
//             onClick={() => setActiveTab('home')}
//             className={`nav-button ${activeTab === 'home' ? 'active' : ''}`}>
//             <Home size={18} className="nav-icon" />
//             <span>Dashboard</span>
//           </button>
//           <button 
//             onClick={() => setActiveTab('courses')}
//             className={`nav-button ${activeTab === 'courses' ? 'active' : ''}`}>
//             <BookOpen size={18} className="nav-icon" />
//             <span>Course Catalog</span>
//           </button>
//           <button 
//             onClick={() => setActiveTab('schedule')}
//             className={`nav-button ${activeTab === 'schedule' ? 'active' : ''}`}>
//             <Calendar size={18} className="nav-icon" />
//             <span>My Schedule</span>
//           </button>
//           <button 
//             onClick={() => setActiveTab('profile')}
//             className={`nav-button ${activeTab === 'profile' ? 'active' : ''}`}>
//             <User size={18} className="nav-icon" />
//             <span>Profile</span>
//           </button>
//           <button 
//             onClick={() => setActiveTab('settings')}
//             className={`nav-button ${activeTab === 'settings' ? 'active' : ''}`}>
//             <Settings size={18} className="nav-icon" />
//             <span>Settings</span>
//           </button>
//         </nav>
//       </div>
//       <div className="sidebar-footer">
//         <button className="logout-button">
//           <LogOut size={18} className="logout-icon" />
//           <span>Logout</span>
//         </button>
//       </div>
//     </div>
//   );
// }

// import { Home, BookOpen, Calendar, User, Settings, LogOut } from 'lucide-react';

// export default function Sidebar({ activeTab, setActiveTab, studentInfo }) {
//   return (
//     <div className="SD-sidebar">
//       <div className="SD-sidebar-header">
//         <h2 className="SD-sidebar-title">Student Portal</h2>
//       </div>
//       <div className="SD-sidebar-content">
//         <div className="SD-user-profile">
//           <div className="SD-avatar">
//             {studentInfo.name.split(' ').map(n => n[0]).join('')}
//           </div>
//           <div className="SD-user-info">
//             <p className="SD-user-name">{studentInfo.name}</p>
//             <p className="SD-user-id">{studentInfo.id}</p>
//           </div>
//         </div>
        
//         <nav className="SD-nav-menu">
//           <button 
//             onClick={() => setActiveTab('home')}
//             className={`SD-nav-button ${activeTab === 'home' ? 'active' : ''}`}>
//             <Home size={18} className="SD-nav-icon" />
//             <span>Dashboard</span>
//           </button>
//           <button 
//             onClick={() => setActiveTab('courses')}
//             className={`SD-nav-button ${activeTab === 'courses' ? 'active' : ''}`}>
//             <BookOpen size={18} className="SD-nav-icon" />
//             <span>Course Catalog</span>
//           </button>
//           <button 
//             onClick={() => setActiveTab('schedule')}
//             className={`SD-nav-button ${activeTab === 'schedule' ? 'active' : ''}`}>
//             <Calendar size={18} className="SD-nav-icon" />
//             <span>My Schedule</span>
//           </button>
//           <button 
//             onClick={() => setActiveTab('profile')}
//             className={`SD-nav-button ${activeTab === 'profile' ? 'active' : ''}`}>
//             <User size={18} className="SD-nav-icon" />
//             <span>Profile</span>
//           </button>
//           <button 
//             onClick={() => setActiveTab('settings')}
//             className={`SD-nav-button ${activeTab === 'settings' ? 'active' : ''}`}>
//             <Settings size={18} className="SD-nav-icon" />
//             <span>Settings</span>
//           </button>
//         </nav>
//       </div>
//       <div className="SD-sidebar-footer">
//         <button className="SD-logout-button">
//           <LogOut size={18} className="SD-logout-icon" />
//           <span>Logout</span>
//         </button>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { Home, BookOpen, Calendar, User, Settings, LogOut } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          // If no token is found, redirect to login
          window.location.href = '/login';
          return;
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
      } catch (err) {
        setError(err.message);
        console.error('Error fetching student profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const handleLogout = () => {
    // Clear auth data from localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('authToken');
    
    // Call the onLogout function passed from parent component if it exists
    if (onLogout) {
      onLogout();
    }
    
    // Always redirect to login page when logging out
    window.location.href = '/login';
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'ST';
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="SD-sidebar">
      <div className="SD-sidebar-header">
        <h2 className="SD-sidebar-title">Student Portal</h2>
      </div>
      <div className="SD-sidebar-content">
        <div className="SD-user-profile">
          <div className="SD-avatar">
            {loading ? 'ST' : getInitials(studentInfo?.name)}
          </div>
          <div className="SD-user-info">
            {loading ? (
              <p className="SD-user-loading">Loading profile...</p>
            ) : error ? (
              <p className="SD-user-error">Error loading profile</p>
            ) : (
              <>
                <p className="SD-user-name">{studentInfo?.name || 'Student'}</p>
                <p className="SD-user-id">ID: {studentInfo?.student_id || 'N/A'}</p>
                <p className="SD-user-major">{studentInfo?.major || 'Major: N/A'}</p>
                <p className="SD-user-year">Year: {studentInfo?.year || 'N/A'}</p>
              </>
            )}
          </div>
        </div>
        
        <nav className="SD-nav-menu">
          <button 
            onClick={() => setActiveTab('home')}
            className={`SD-nav-button ${activeTab === 'home' ? 'active' : ''}`}>
            <Home size={18} className="SD-nav-icon" />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('courses')}
            className={`SD-nav-button ${activeTab === 'courses' ? 'active' : ''}`}>
            <BookOpen size={18} className="SD-nav-icon" />
            <span>Course Catalog</span>
          </button>
          <button 
            onClick={() => setActiveTab('schedule')}
            className={`SD-nav-button ${activeTab === 'schedule' ? 'active' : ''}`}>
            <Calendar size={18} className="SD-nav-icon" />
            <span>My Schedule</span>
          </button>
          {/* <button 
            onClick={() => setActiveTab('profile')}
            className={`SD-nav-button ${activeTab === 'profile' ? 'active' : ''}`}>
            <User size={18} className="SD-nav-icon" />
            <span>Profile</span>
          </button> */}
          <button 
            onClick={() => setActiveTab('settings')}
            className={`SD-nav-button ${activeTab === 'settings' ? 'active' : ''}`}>
            <Settings size={18} className="SD-nav-icon" />
            <span>Settings</span>
          </button>
        </nav>
      </div>
      <div className="SD-sidebar-footer">
        <button className="SD-logout-button" onClick={handleLogout}>
          <LogOut size={18} className="SD-logout-icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
