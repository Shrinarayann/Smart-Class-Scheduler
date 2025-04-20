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
  const [loading, setLoading] = useState(false);
  const [scheduleData, setScheduleData] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  
  // Use effect to fetch data on component mount
  useEffect(() => {
    // Uncomment the line below to fetch automatically when component mounts
    // fetchSchedule();
  }, []);
  
  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('http://localhost:8080/api/v1/student/schedule', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch schedule');
      }
      
      const data = await response.json();
      console.log("Fetched schedule data:", data); // Add this line for debugging
      setScheduleData(data);
      const courses = transformCoursesData(data);
      setEnrolledCourses(courses);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const transformCoursesData = (data) => {
    const courseMap = {};
    
    // Use the courses array from the response
    if (data.courses && Array.isArray(data.courses)) {
      data.courses.forEach(courseCode => {
        // Initialize course entry
        courseMap[courseCode] = {
          id: courseCode,
          code: courseCode,
          name: `${courseCode}`,
          credits: 3, // Default value
          sessions: []
        };
      });
    }
    
    // Process schedule data to populate additional course details
    if (data.schedule) {
      Object.entries(data.schedule).forEach(([day, sessions]) => {
        sessions.forEach(session => {
          const { course_code, teacher, room, start_time, end_time, session_number } = session;
          
          if (!courseMap[course_code]) {
            courseMap[course_code] = {
              id: course_code,
              code: course_code,
              name: `${course_code}`,
              credits: 3,
              teacher,
              room,
              sessions: []
            };
          }
          
          // Add session to the course
          courseMap[course_code].sessions.push({
            day,
            start_time,
            end_time,
            room,
            teacher,
            session_number
          });
          
          // Update course details
          courseMap[course_code].teacher = teacher || courseMap[course_code].teacher;
          courseMap[course_code].room = room || courseMap[course_code].room;
        });
      });
    }
    
    return Object.values(courseMap);
  };
  
  const handleUnenroll = async (courseId) => {
    console.log('Unenrolling from course:', courseId);
    // Here you would add API call for unenrolling
    setEnrolledCourses(enrolledCourses.filter(course => course.id !== courseId));
  };
  
  // Get time slots from schedule data
  const getTimeSlots = () => {
    if (!scheduleData || !scheduleData.schedule) return ["09:00-10:00", "11:00-12:00", "13:00-14:00", "15:00-16:00"];
    
    const times = new Set();
    Object.values(scheduleData.schedule).forEach(daySchedule => {
      daySchedule.forEach(session => {
        times.add(`${session.start_time}-${session.end_time}`);
      });
    });
    
    return Array.from(times).sort();
  };
  
  // Get unique days from schedule data
  const getDays = () => {
    if (!scheduleData || !scheduleData.schedule) return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    return Object.keys(scheduleData.schedule);
  };
  
  // Get course sessions for a specific day and time slot
  const getSessionsForTimeSlot = (day, timeSlot) => {
    if (!scheduleData || !scheduleData.schedule || !scheduleData.schedule[day]) return [];
    
    const [slotStart, slotEnd] = timeSlot.split('-');
    return scheduleData.schedule[day].filter(session => 
      session.start_time === slotStart && session.end_time === slotEnd
    );
  };
  
  // Get color class based on course code
  const getCourseColorClass = (courseCode) => {
    if (courseCode.startsWith('CS')) return 'SD-cs-slot';
    if (courseCode.startsWith('MATH')) return 'SD-math-slot';
    if (courseCode.startsWith('ENG')) return 'SD-eng-slot';
    return '';
  };

  const timeSlots = getTimeSlots();
  const days = getDays();

  return (
    <div>
      <div className="SD-header-section">
        <h2>Student Schedule</h2>
        {scheduleData && <p>Student: {scheduleData.student_name} (ID: {scheduleData.student_id})</p>}
        <button 
          onClick={fetchSchedule} 
          className="SD-generate-button"
          disabled={loading}
        >
          {loading ? 'Loading...' : scheduleData ? 'Refresh Schedule' : 'Get Your Schedule'}
        </button>
      </div>
      
      {scheduleData ? (
        <>
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
                        <div className="SD-course-info-name">{course.code}</div>
                        <div className="SD-course-info-details">
                          {course.credits} credits
                          {course.teacher && ` • Instructor: ${course.teacher}`}
                          {course.room && ` • Room: ${course.room}`}
                        </div>
                        {course.sessions && course.sessions.length > 0 && (
                          <div className="SD-course-sessions">
                            {course.sessions.map((session, idx) => (
                              <div key={idx} className="SD-session-detail">
                                {session.day}: {session.start_time} - {session.end_time}
                              </div>
                            ))}
                          </div>
                        )}
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
                    const sessions = getSessionsForTimeSlot(day, timeSlot);
                    
                    return (
                      <div key={day} className="SD-day-slot">
                        {sessions.map((session, idx) => (
                          <div 
                            key={idx}
                            className={`SD-course-slot ${getCourseColorClass(session.course_code)}`}
                          >
                            {session.course_code}
                            <div className="SD-session-info">
                              Room: {session.room}
                              <br />
                              Instructor: {session.teacher}
                              <br />
                              Session: {session.session_number}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="SD-empty-schedule">
          <p>Click "Get Your Schedule" to view your current class schedule.</p>
        </div>
      )}
    </div>
  );
}