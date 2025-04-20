// import { useState, useEffect } from 'react';

// export default function ScheduleView() {
//   const [loading, setLoading] = useState(true);
//   const [scheduleData, setScheduleData] = useState(null);
//   const [enrolledCourses, setEnrolledCourses] = useState([]);
  
//   useEffect(() => {
//     // Fetch schedule data from the API
//     const fetchSchedule = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch('http://localhost:8080/api/v1/student/schedule');
//         const data = await response.json();
//         setScheduleData(data);
        
//         // Transform the API data to match the component's expected format
//         const courses = transformCoursesData(data);
//         setEnrolledCourses(courses);
//       } catch (error) {
//         console.error('Error fetching schedule:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchSchedule();
//   }, []);
  
//   // Transform the API data to match the component's expected format
//   const transformCoursesData = (data) => {
//     // Create a map to store course information
//     const courseMap = {};
    
//     // First, build a map of all courses with their details
//     Object.entries(data.schedule).forEach(([day, sessions]) => {
//       sessions.forEach(session => {
//         const { course_code } = session;
        
//         if (!courseMap[course_code]) {
//           courseMap[course_code] = {
//             id: course_code,
//             code: course_code,
//             name: `${course_code} Course`, // We might need to fetch full course names separately
//             schedule: getScheduleCode(day, session.start_time),
//             credits: 3, // Default value, could be fetched from another API
//             teacher: session.teacher,
//             room: session.room
//           };
//         }
//       });
//     });
    
//     // Convert the map to an array
//     return Object.values(courseMap);
//   };
  
//   // Helper function to convert day and time to a schedule code
//   const getScheduleCode = (day, startTime) => {
//     const dayPrefix = day.substring(0, 3).toUpperCase();
//     return `${dayPrefix}_${startTime.replace(':', '')}`;
//   };
  
//   // Handle unenroll action
//   const handleUnenroll = async (courseId) => {
//     // Implement unenroll API call here
//     console.log('Unenrolling from course:', courseId);
    
//     // In a real app, you would call an API to unenroll
//     // After successful unenroll, refetch the schedule
    
//     // For demo purposes, just remove from local state
//     setEnrolledCourses(enrolledCourses.filter(course => course.id !== courseId));
//   };
  
//   // Create time slots for the weekly view
//   const timeSlots = ["8:00-9:30", "9:00-12:00", "10:00-11:30", "13:00-14:30", "15:00-16:30"];
//   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  
//   if (loading) {
//     return <div>Loading schedule...</div>;
//   }

//   if (!scheduleData) {
//     return <div>Failed to load schedule data.</div>;
//   }

//   return (
//     <div>
//       <h2>Student Schedule: {scheduleData.student_name}</h2>
//       <div className="schedule-grid">
//         <div className="enrolled-courses">
//           <h3 className="enrolled-title">My Enrolled Courses</h3>
//           {enrolledCourses.length === 0 ? (
//             <p className="empty-message">No courses enrolled yet.</p>
//           ) : (
//             <div className="courses-list">
//               {enrolledCourses.map(course => (
//                 <div key={course.id} className="course-item">
//                   <div>
//                     <div className="course-info-name">{course.code}: {course.name}</div>
//                     <div className="course-info-details">
//                       {course.schedule} • {course.credits} credits
//                       {course.teacher && ` • ${course.teacher}`}
//                       {course.room && ` • Room: ${course.room}`}
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => handleUnenroll(course.id)}
//                     className="unenroll-button"
//                   >
//                     Unenroll
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
        
//         <div className="credit-summary">
//           <h3 className="credit-title">Credit Summary</h3>
//           <div className="credit-info">
//             <div className="credit-row">
//               <span>Total Credits Enrolled:</span>
//               <span className="credit-value">
//                 {enrolledCourses.reduce((total, course) => total + course.credits, 0)}
//               </span>
//             </div>
//             <div className="credit-row">
//               <span>Courses:</span>
//               <span className="credit-value">{enrolledCourses.length}</span>
//             </div>
//             <div className="progress-bar">
//               <div 
//                 className="progress-fill" 
//                 style={{ width: `${Math.min((enrolledCourses.reduce((total, course) => total + course.credits, 0) / 18) * 100, 100)}%` }}
//               ></div>
//             </div>
//             <div className="progress-label">
//               {enrolledCourses.reduce((total, course) => total + course.credits, 0)}/18 maximum recommended credits
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="weekly-schedule">
//         <h3 className="weekly-title">Weekly Schedule</h3>
//         <div className="schedule-table-container">
//           <div className="schedule-table-header">
//             <div className="time-slot">Time</div>
//             {days.map(day => (
//               <div key={day} className="day-slot">{day}</div>
//             ))}
//           </div>
          
//           {timeSlots.map((timeSlot, index) => (
//             <div key={index} className="schedule-table-row">
//               <div className="time-slot">{timeSlot}</div>
              
//               {days.map(day => {
//                 // Check if there are any sessions for this day and time slot
//                 const session = scheduleData.schedule[day]?.find(s => {
//                   const [slotStart] = timeSlot.split('-');
//                   return s.start_time === slotStart;
//                 });
                
//                 return (
//                   <div key={day} className="day-slot">
//                     {session && (
//                       <div className={`
//                         course-slot
//                         ${session.course_code.startsWith('CS') ? 'cs-slot' : ''}
//                         ${session.course_code.startsWith('MATH') ? 'math-slot' : ''}
//                         ${session.course_code.startsWith('ENG') ? 'eng-slot' : ''}
//                       `}>
//                         {session.course_code}
//                         <div className="session-info">
//                           Room: {session.room}
//                           <br />
//                           Session: {session.session_number}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';

export default function ScheduleView() {
  const [loading, setLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/api/v1/student/schedule');
        const data = await response.json();
        setScheduleData(data);
        const courses = transformCoursesData(data);
        setEnrolledCourses(courses);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSchedule();
  }, []);
  
  const transformCoursesData = (data) => {
    const courseMap = {};
    
    Object.entries(data.schedule).forEach(([day, sessions]) => {
      sessions.forEach(session => {
        const { course_code } = session;
        
        if (!courseMap[course_code]) {
          courseMap[course_code] = {
            id: course_code,
            code: course_code,
            name: `${course_code} Course`,
            schedule: getScheduleCode(day, session.start_time),
            credits: 3,
            teacher: session.teacher,
            room: session.room
          };
        }
      });
    });
    
    return Object.values(courseMap);
  };
  
  const getScheduleCode = (day, startTime) => {
    const dayPrefix = day.substring(0, 3).toUpperCase();
    return `${dayPrefix}_${startTime.replace(':', '')}`;
  };
  
  const handleUnenroll = async (courseId) => {
    console.log('Unenrolling from course:', courseId);
    setEnrolledCourses(enrolledCourses.filter(course => course.id !== courseId));
  };
  
  const timeSlots = ["8:00-9:30", "9:00-12:00", "10:00-11:30", "13:00-14:30", "15:00-16:30"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  
  if (loading) return <div>Loading schedule...</div>;
  if (!scheduleData) return <div>Failed to load schedule data.</div>;

  return (
    <div>
      <h2>Student Schedule: {scheduleData.student_name}</h2>
      <div className="SD-schedule-grid">
        <div className="SD-enrolled-courses">
          <h3 className="SD-enrolled-title">My Enrolled Courses</h3>
          {enrolledCourses.length === 0 ? (
            <p className="SD-empty-message">No courses enrolled yet.</p>
          ) : (
            <div className="SD-courses-list">
              {enrolledCourses.map(course => (
                <div key={course.id} className="SD-course-item">
                  <div>
                    <div className="SD-course-info-name">{course.code}: {course.name}</div>
                    <div className="SD-course-info-details">
                      {course.schedule} • {course.credits} credits
                      {course.teacher && ` • ${course.teacher}`}
                      {course.room && ` • Room: ${course.room}`}
                    </div>
                  </div>
                  <button
                    onClick={() => handleUnenroll(course.id)}
                    className="SD-unenroll-button"
                  >
                    Unenroll
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="SD-credit-summary">
          <h3 className="SD-credit-title">Credit Summary</h3>
          <div className="SD-credit-info">
            <div className="SD-credit-row">
              <span>Total Credits Enrolled:</span>
              <span className="SD-credit-value">
                {enrolledCourses.reduce((total, course) => total + course.credits, 0)}
              </span>
            </div>
            <div className="SD-credit-row">
              <span>Courses:</span>
              <span className="SD-credit-value">{enrolledCourses.length}</span>
            </div>
            <div className="SD-progress-bar">
              <div 
                className="SD-progress-fill" 
                style={{ width: `${Math.min((enrolledCourses.reduce((total, course) => total + course.credits, 0) / 18) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="SD-progress-label">
              {enrolledCourses.reduce((total, course) => total + course.credits, 0)}/18 maximum recommended credits
            </div>
          </div>
        </div>
      </div>

      <div className="SD-weekly-schedule">
        <h3 className="SD-weekly-title">Weekly Schedule</h3>
        <div className="SD-schedule-table-container">
          <div className="SD-schedule-table-header">
            <div className="SD-time-slot">Time</div>
            {days.map(day => (
              <div key={day} className="SD-day-slot">{day}</div>
            ))}
          </div>
          
          {timeSlots.map((timeSlot, index) => (
            <div key={index} className="SD-schedule-table-row">
              <div className="SD-time-slot">{timeSlot}</div>
              
              {days.map(day => {
                const session = scheduleData.schedule[day]?.find(s => {
                  const [slotStart] = timeSlot.split('-');
                  return s.start_time === slotStart;
                });
                
                return (
                  <div key={day} className="SD-day-slot">
                    {session && (
                      <div className={`
                        SD-course-slot
                        ${session.course_code.startsWith('CS') ? 'SD-cs-slot' : ''}
                        ${session.course_code.startsWith('MATH') ? 'SD-math-slot' : ''}
                        ${session.course_code.startsWith('ENG') ? 'SD-eng-slot' : ''}
                      `}>
                        {session.course_code}
                        <div className="SD-session-info">
                          Room: {session.room}
                          <br />
                          Session: {session.session_number}
                        </div>
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
