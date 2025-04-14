// Profile View Component
function ProfileView({ studentInfo }) {
    return (
      <div className="profile-card">
        <div className="profile-header">
          <h2 className="card-title">Student Profile</h2>
        </div>
        
        <div className="profile-content">
          <div className="profile-layout">
            <div className="profile-avatar-container">
              <div className="profile-avatar">
                {studentInfo.name.split(' ').map(n => n[0]).join('')}
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
                  <p className="field-value">{studentInfo.major}</p>
                </div>
                
                <div className="profile-field">
                  <p className="field-label">Year</p>
                  <p className="field-value">{studentInfo.year}</p>
                </div>
                
                <div className="profile-field">
                  <p className="field-label">Enrolled Credits</p>
                  <p className="field-value">
                    {studentInfo.enrolled_courses ? studentInfo.enrolled_courses.length : 0} courses
                  </p>
                </div>
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