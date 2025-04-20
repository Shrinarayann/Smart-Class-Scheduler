import { useState, useEffect } from 'react';

function ProfileView() {
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        setLoading(true);
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
          throw new Error('Failed to fetch student profile');
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

    fetchStudentProfile();
  }, []);

  const getInitials = (name) => {
    if (!name) return 'ST';
    return name.split(' ').map(n => n[0]).join('');
  };

  if (loading) {
    return (
      <div className="profile-card loading">
        <div className="profile-header">
          <h2 className="card-title">Student Profile</h2>
        </div>
        <div className="profile-content loading-content">
          <p>Loading profile information...</p>
        </div>
      </div>
    );
  }

  if (error || !studentInfo) {
    return (
      <div className="profile-card error">
        <div className="profile-header">
          <h2 className="card-title">Student Profile</h2>
        </div>
        <div className="profile-content error-content">
          <p>Error loading profile: {error || 'Unknown error'}</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-card">
      <div className="profile-header">
        <h2 className="card-title">Student Profile</h2>
      </div>
      
      <div className="profile-content">
        <div className="profile-layout">
          <div className="profile-avatar-container">
            <div className="profile-avatar">
              {getInitials(studentInfo.name)}
            </div>
          </div>
          
          <div className="profile-details">
            <div className="profile-grid">
              <div className="profile-field">
                <p className="field-label">Full Name</p>
                <p className="field-value">{studentInfo.name}</p>
              </div>
              
              <div className="profile-field">
                <p className="field-label">Student ID</p>
                <p className="field-value">{studentInfo.student_id}</p>
              </div>
              
              <div className="profile-field">
                <p className="field-label">Email</p>
                <p className="field-value">{studentInfo.email || "Not provided"}</p>
              </div>
              
              <div className="profile-field">
                <p className="field-label">Major</p>
                <p className="field-value">{studentInfo.major || "Not specified"}</p>
              </div>
              
              <div className="profile-field">
                <p className="field-label">Year</p>
                <p className="field-value">{studentInfo.year || "Not specified"}</p>
              </div>
              
              <div className="profile-field">
                <p className="field-label">Enrolled Courses</p>
                <p className="field-value">
                  {studentInfo.enrolled_courses ? studentInfo.enrolled_courses.length : 0} courses
                </p>
              </div>
            </div>
            
            <div className="enrolled-courses-section">
              <h3 className="section-title">Enrolled Courses</h3>
              {studentInfo.enrolled_courses && studentInfo.enrolled_courses.length > 0 ? (
                <ul className="courses-list">
                  {studentInfo.enrolled_courses.map((course, index) => (
                    <li key={index} className="course-item">
                      {course}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-courses">No courses enrolled</p>
              )}
            </div>
            
            <div className="update-profile">
              <button className="update-button">Update Profile</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileView;