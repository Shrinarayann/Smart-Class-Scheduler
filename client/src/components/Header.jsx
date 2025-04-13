import '../styles/header.css';

export default function Header({ activeTab, studentInfo }) {
  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-title">
          {activeTab === 'home' && 'Dashboard'}
          {activeTab === 'courses' && 'Course Catalog'}
          {activeTab === 'schedule' && 'My Schedule'}
          {activeTab === 'profile' && 'Profile'}
          {activeTab === 'settings' && 'Settings'}
        </h1>
        <div className="header-info">
          <span>{studentInfo.program} • {studentInfo.semester}</span>
        </div>
      </div>
    </header>
  );
}