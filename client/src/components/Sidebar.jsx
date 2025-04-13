import { Home, BookOpen, Calendar, User, Settings, LogOut } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, studentInfo }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Student Portal</h2>
      </div>
      <div className="sidebar-content">
        <div className="user-profile">
          <div className="avatar">
            {studentInfo.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="user-info">
            <p className="user-name">{studentInfo.name}</p>
            <p className="user-id">{studentInfo.id}</p>
          </div>
        </div>
        
        <nav className="nav-menu">
          <button 
            onClick={() => setActiveTab('home')}
            className={`nav-button ${activeTab === 'home' ? 'active' : ''}`}>
            <Home size={18} className="nav-icon" />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('courses')}
            className={`nav-button ${activeTab === 'courses' ? 'active' : ''}`}>
            <BookOpen size={18} className="nav-icon" />
            <span>Course Catalog</span>
          </button>
          <button 
            onClick={() => setActiveTab('schedule')}
            className={`nav-button ${activeTab === 'schedule' ? 'active' : ''}`}>
            <Calendar size={18} className="nav-icon" />
            <span>My Schedule</span>
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`nav-button ${activeTab === 'profile' ? 'active' : ''}`}>
            <User size={18} className="nav-icon" />
            <span>Profile</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`nav-button ${activeTab === 'settings' ? 'active' : ''}`}>
            <Settings size={18} className="nav-icon" />
            <span>Settings</span>
          </button>
        </nav>
      </div>
      <div className="sidebar-footer">
        <button className="logout-button">
          <LogOut size={18} className="logout-icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}