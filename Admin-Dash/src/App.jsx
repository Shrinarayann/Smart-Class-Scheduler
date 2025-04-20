// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Dashboard from './components/Dashboard/Dashboard';
// import StudentManagement from './components/StudentManagement/StudentManagement';
// import CourseManagement from './components/CourseManagement/CourseManagement';
// import ScheduleManagement from './components/ScheduleManagement/ScheduleManagement';
// import Sidebar from './components/Sidebar/Sidebar';
// import Header from './components/Header/Header';
// import TeachingAssistants from './components/TA/ta';
// import LoginPage from './login-page-components/LoginPage';
// import StudentMain from './student-dashboard-components/StudentMain'; // ✅ NEW
// import './App.css';

// function App() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [userRole, setUserRole] = useState(null); // 'admin' or 'student'

//   useEffect(() => {
//     const storedAuth = localStorage.getItem('isAuthenticated');
//     const storedRole = localStorage.getItem('userRole');

//     if (storedAuth === 'true' && storedRole) {
//       setIsAuthenticated(true);
//       setUserRole(storedRole);
//     }
//   }, []);

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   const handleLogin = (role) => {
//     setIsAuthenticated(true);
//     setUserRole(role);
//     localStorage.setItem('isAuthenticated', 'true');
//     localStorage.setItem('userRole', role);
//   };

//   const handleLogout = () => {
//     setIsAuthenticated(false);
//     setUserRole(null);
//     localStorage.removeItem('isAuthenticated');
//     localStorage.removeItem('userRole');
//   };

//   return (
//     <Router>
//       <Routes>

//         {/* Login */}
//         <Route
//           path="/login"
//           element={
//             isAuthenticated
//               ? userRole === 'admin'
//                 ? <Navigate to="/dashboard" replace />
//                 : <Navigate to="/student" replace />
//               : <LoginPage onLogin={handleLogin} />
//           }
//         />

//         {/* Admin Routes */}
//         {isAuthenticated && userRole === 'admin' && (
//           <Route
//             path="/*"
//             element={
//               <div className="app-container">
//                 <Sidebar isOpen={sidebarOpen} userRole={userRole} />
//                 <div className={`main-content ${sidebarOpen ? '' : 'expanded'}`}>
//                   <Header toggleSidebar={toggleSidebar} onLogout={handleLogout} userRole={userRole} />
//                   <div className="page-container">
//                     <Routes>
//                       <Route path="/dashboard" element={<Dashboard />} />
//                       <Route path="/students" element={<StudentManagement />} />
//                       <Route path="/courses" element={<CourseManagement />} />
//                       <Route path="/schedule" element={<ScheduleManagement />} />
//                       <Route path="/teaching-assistants" element={<TeachingAssistants />} />
//                       <Route path="*" element={<Navigate to="/login" replace />} />
//                     </Routes>
//                   </div>
//                 </div>
//               </div>
//             }
//           />
//         )}

//         {/* Student Route — ✅ NEW */}
//         {isAuthenticated && userRole === 'student' && (
//           <Route path="/student" element={<StudentMain onLogout={handleLogout} />} />
//         )}

//         {/* Fallback to login */}
//         {!isAuthenticated && (
//           <Route path="*" element={<Navigate to="/login" replace />} />
//         )}
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import StudentManagement from './components/StudentManagement/StudentManagement';
import CourseManagement from './components/CourseManagement/CourseManagement';
import ScheduleManagement from './components/ScheduleManagement/ScheduleManagement';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import TeachingAssistants from './components/TA/ta';
import LoginPage from './login-page-components/LoginPage';

import StudentMain from './student-dashboard-components/StudentMain'; // ✅ Add this


function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'admin' or 'student'

  // Check if user is already authenticated (e.g., from localStorage)
  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedRole = localStorage.getItem('userRole');
    
    if (storedAuth === 'true' && storedRole) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    
    // Store auth state in localStorage for persistence
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    
    // Clear auth state from localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
  };

  // Protected route wrapper component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated 
            ? (userRole === 'admin'
                ? <Navigate to="/dashboard" replace />
                : <Navigate to="/student" replace />
              )
            : <LoginPage onLogin={handleLogin} />
        } 
      />

        {/* Student dashboard route */}
        <Route
          path="/student"
          element={
            isAuthenticated && userRole === 'student'
              ? <StudentMain onLogout={handleLogout} />
              : <Navigate to="/login" replace />
          }
        />

        {/* Wildcard (everything else) goes last */}
        <Route 
          path="/*" 
          element={
            isAuthenticated ? (
              <div className="app-container">
                <Sidebar isOpen={sidebarOpen} userRole={userRole} />
                <div className={`main-content ${sidebarOpen ? '' : 'expanded'}`}>
                  <Header toggleSidebar={toggleSidebar} onLogout={handleLogout} userRole={userRole} />
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
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Login route should be below `/` and above `*` wildcard */}
        <Route 
          path="/login" 
          element={
            isAuthenticated 
              ? <Navigate to="/dashboard" replace /> 
              : <LoginPage onLogin={handleLogin} />
          } 
        />
      </Routes>

    </Router>
  );
}

export default App;