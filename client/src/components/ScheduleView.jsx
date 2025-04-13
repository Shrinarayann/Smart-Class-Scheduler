import { scheduleMap } from '../data/mockData';

export default function ScheduleView({ enrolledCourses, onUnenroll }) {
  // Create time slots for the weekly view
  const timeSlots = ["8:00-9:30", "9:00-12:00", "10:00-11:30", "13:00-14:30", "15:00-16:30"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div>
      <div className="schedule-grid">
        <div className="enrolled-courses">
          <h3 className="enrolled-title">My Enrolled Courses</h3>
          {enrolledCourses.length === 0 ? (
            <p className="empty-message">No courses enrolled yet.</p>
          ) : (
            <div className="courses-list">
              {enrolledCourses.map(course => (
                <div key={course.id} className="course-item">
                  <div>
                    <div className="course-info-name">{course.code}: {course.name}</div>
                    <div className="course-info-details">{course.schedule} • {course.credits} credits</div>
                  </div>
                  <button
                    onClick={() => onUnenroll(course.id)}
                    className="unenroll-button"
                  >
                    Unenroll
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="credit-summary">
          <h3 className="credit-title">Credit Summary</h3>
          <div className="credit-info">
            <div className="credit-row">
              <span>Total Credits Enrolled:</span>
              <span className="credit-value">
                {enrolledCourses.reduce((total, course) => total + course.credits, 0)}
              </span>
            </div>
            <div className="credit-row">
              <span>Courses:</span>
              <span className="credit-value">{enrolledCourses.length}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${Math.min((enrolledCourses.reduce((total, course) => total + course.credits, 0) / 18) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="progress-label">
              {enrolledCourses.reduce((total, course) => total + course.credits, 0)}/18 maximum recommended credits
            </div>
          </div>
        </div>
      </div>

      <div className="weekly-schedule">
        <h3 className="weekly-title">Weekly Schedule</h3>
        <div className="schedule-table-container">
          <div className="schedule-table-header">
            <div className="time-slot">Time</div>
            {days.map(day => (
              <div key={day} className="day-slot">{day}</div>
            ))}
          </div>
          
          {timeSlots.map((timeSlot, index) => (
            <div key={index} className="schedule-table-row">
              <div className="time-slot">{timeSlot}</div>
              
              {days.map(day => {
                const course = enrolledCourses.find(course => {
                  const scheduleInfo = scheduleMap[course.schedule];
                  return scheduleInfo && 
                         scheduleInfo.days.includes(day) && 
                         scheduleInfo.time === timeSlot;
                });
                
                return (
                  <div key={day} className="day-slot">
                    {course && (
                      <div className={`
                        course-slot
                        ${course.code.startsWith('CS') ? 'cs-slot' : ''}
                        ${course.code.startsWith('MATH') ? 'math-slot' : ''}
                        ${course.code.startsWith('ENG') ? 'eng-slot' : ''}
                      `}>
                        {course.code}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
