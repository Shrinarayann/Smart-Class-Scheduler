import React, { useState, useEffect } from 'react';
import './ScheduleManagement.css';

function ScheduleManagement() {
  // State for schedule data from backend
  const [roomSchedules, setRoomSchedules] = useState({});
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Days for the schedule
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  // Fetch schedule data from backend
  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/schedules/rooms');
        const data = await response.json();
        setRoomSchedules(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching schedule data:', error);
        setLoading(false);
      }
    };
    
    fetchScheduleData();
    
    // For development/testing, comment out the above and use this mock data
    // const mockData = getMockScheduleData();
    // setRoomSchedules(mockData);
    // setLoading(false);
  }, []);
  
  // Function to handle room selection
  const handleRoomSelect = (roomId) => {
    setSelectedRoom(roomId === selectedRoom ? null : roomId);
  };
  
  // Generate manual schedule
  const generateSchedule = async () => {
    try {
      setLoading(true);
      // Call backend to generate schedule
      const response = await fetch('/api/schedules/generate', { method: 'POST' });
      const data = await response.json();
      setRoomSchedules(data);
      setLoading(false);
      alert('Schedule generated successfully!');
    } catch (error) {
      console.error('Error generating schedule:', error);
      setLoading(false);
      alert('Failed to generate schedule. Please try again.');
    }
  };
  
  // Export schedule (mock function)
  const exportSchedule = (format) => {
    alert(`Exporting schedule as ${format}. In a real application, this would generate and download a ${format} file.`);
  };
  
  // Group schedules by day for a specific room
  const getSchedulesByDay = (roomData) => {
    if (!roomData || !roomData.schedules) return {};
    
    const scheduledByDay = {};
    days.forEach(day => {
      scheduledByDay[day] = roomData.schedules.filter(schedule => schedule.day === day)
        .sort((a, b) => a.start_time.localeCompare(b.start_time));
    });
    
    return scheduledByDay;
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="schedule-management">
        <div className="loading-container">
          <div className="spinner"></div>
          <h2>Loading schedule data...</h2>
        </div>
      </div>
    );
  }
  
  return (
    <div className="schedule-management">
      <div className="page-header">
        <h1>Schedule Management</h1>
        <div className="export-buttons">
          <button className="btn-success" onClick={() => exportSchedule('Excel')}>
            <i className="fas fa-file-excel"></i> Export to Excel
          </button>
          <button className="btn-danger" onClick={() => exportSchedule('PDF')}>
            <i className="fas fa-file-pdf"></i> Export to PDF
          </button>
          <button className="btn-primary" onClick={generateSchedule}>
            <i className="fas fa-calendar-alt"></i> Generate Schedule
          </button>
        </div>
      </div>
      
      {/* Room selection cards */}
      <div className="room-cards-container">
        <h2>Select a Room to View Schedule</h2>
        <div className="room-cards">
          {Object.keys(roomSchedules).map(roomId => {
            const roomData = roomSchedules[roomId];
            const totalSessions = roomData.schedules ? roomData.schedules.length : 0;
            const isSelected = selectedRoom === roomId;
            
            return (
              <div 
                key={roomId} 
                className={`room-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleRoomSelect(roomId)}
              >
                <h3>Room {roomData.room_id}</h3>
                <div className="room-card-details">
                  <p><strong>Capacity:</strong> {roomData.capacity}</p>
                  <p><strong>Sessions:</strong> {totalSessions}</p>
                </div>
                <div className="room-card-footer">
                  <button className="btn-small">
                    {isSelected ? 'Hide Details' : 'View Schedule'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Selected room schedule */}
      {selectedRoom && (
        <div className="selected-room-schedule">
          <div className="room-schedule-header">
            <h2>Schedule for Room {roomSchedules[selectedRoom].room_id}</h2>
            <p>Capacity: {roomSchedules[selectedRoom].capacity} students</p>
          </div>
          
          {/* Tab navigation for days */}
          <div className="day-tabs">
            {days.map(day => {
              const daySchedules = getSchedulesByDay(roomSchedules[selectedRoom])[day] || [];
              const hasClasses = daySchedules.length > 0;
              return (
                <button 
                  key={day} 
                  className={`day-tab ${hasClasses ? 'has-classes' : ''}`}
                  onClick={() => document.getElementById(`day-${day}`).scrollIntoView({ behavior: 'smooth' })}
                >
                  {day}
                  {hasClasses && <span className="class-count">{daySchedules.length}</span>}
                </button>
              );
            })}
          </div>
          
          {/* Day-wise schedules */}
          <div className="day-schedules">
            {days.map(day => {
              const daySchedules = getSchedulesByDay(roomSchedules[selectedRoom])[day] || [];
              return (
                <div key={day} id={`day-${day}`} className="day-schedule">
                  <h3>{day}</h3>
                  
                  {daySchedules.length === 0 ? (
                    <div className="no-classes">
                      <p>No classes scheduled for this day</p>
                    </div>
                  ) : (
                    <div className="time-slots">
                      {daySchedules.map((schedule, index) => (
                        <div key={index} className="time-slot-card">
                          <div className="time-slot-header">
                            <span className="time">{schedule.start_time} - {schedule.end_time}</span>
                            <span className="course-code">{schedule.course_code}</span>
                          </div>
                          <div className="time-slot-details">
                            <p><strong>Course:</strong> {schedule.course_name}</p>
                            <p><strong>Section:</strong> {schedule.section_id}</p>
                            <p><strong>Professor:</strong> {schedule.professor}</p>
                            <p><strong>Session:</strong> {schedule.session_number}/{schedule.total_sessions}</p>
                            <p><strong>Students:</strong> {schedule.enrolled_students}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Room timetable view for selected room */}
      {selectedRoom && (
        <div className="room-timetable-view">
          <h3>Timetable View for Room {roomSchedules[selectedRoom].room_id}</h3>
          <table className="timetable">
            <thead>
              <tr>
                <th>Time</th>
                {days.map(day => <th key={day}>{day.substring(0, 3)}</th>)}
              </tr>
            </thead>
            <tbody>
              {generateTimeSlots().map(timeSlot => {
                const formattedTime = timeSlot.format;
                return (
                  <tr key={formattedTime}>
                    <td className="time-cell">{formattedTime}</td>
                    {days.map(day => {
                      const schedules = roomSchedules[selectedRoom].schedules || [];
                      const classAtThisTime = schedules.find(
                        schedule => schedule.day === day && schedule.start_time === timeSlot.value
                      );
                      
                      return (
                        <td 
                          key={`${day}-${formattedTime}`} 
                          className={classAtThisTime ? 'scheduled-cell' : 'empty-cell'}
                        >
                          {classAtThisTime && (
                            <div className="cell-content">
                              <div className="cell-course">{classAtThisTime.course_code}</div>
                              <div className="cell-session">({classAtThisTime.session_number})</div>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Helper function to generate time slots for the timetable
function generateTimeSlots() {
  return [
    { value: '09:00', format: '9:00 AM' },
    { value: '10:00', format: '10:00 AM' },
    { value: '11:15', format: '11:15 AM' },
    { value: '12:15', format: '12:15 PM' },
    { value: '13:15', format: '1:15 PM' },
    { value: '14:15', format: '2:15 PM' },
    { value: '15:15', format: '3:15 PM' },
    { value: '16:15', format: '4:15 PM' }
  ];
}

// Mock data for development/testing
function getMockScheduleData() {
  return {
    "A101": {
      "room_id": "A101",
      "capacity": 30,
      "schedules": [
        {
          "day": "Monday",
          "start_time": "09:00",
          "end_time": "10:00",
          "course_code": "CS101",
          "course_name": "Introduction to Programming",
          "section_id": "CS101-A",
          "professor": "Dr. Smith",
          "session_number": 1,
          "total_sessions": 2,
          "enrolled_students": 25
        },
        {
          "day": "Monday",
          "start_time": "10:00",
          "end_time": "11:00",
          "course_code": "CS101",
          "course_name": "Introduction to Programming",
          "section_id": "CS101-A",
          "professor": "Dr. Smith",
          "session_number": 2,
          "total_sessions": 2,
          "enrolled_students": 25
        }
      ]
    },
    "A102": {
      "room_id": "A102",
      "capacity": 30,
      "schedules": [
        {
          "day": "Monday",
          "start_time": "09:00",
          "end_time": "10:00",
          "course_code": "MATH101",
          "course_name": "Calculus I",
          "section_id": "MATH101-A",
          "professor": "Dr. Johnson",
          "session_number": 1,
          "total_sessions": 2,
          "enrolled_students": 28
        },
        {
          "day": "Monday",
          "start_time": "10:00",
          "end_time": "11:00",
          "course_code": "MATH101",
          "course_name": "Calculus I",
          "section_id": "MATH101-A",
          "professor": "Dr. Johnson",
          "session_number": 2,
          "total_sessions": 2,
          "enrolled_students": 28
        }
      ]
    },
    "B201": {
      "room_id": "B201",
      "capacity": 40,
      "schedules": [
        {
          "day": "Monday",
          "start_time": "09:00",
          "end_time": "10:00",
          "course_code": "ENG101",
          "course_name": "English Composition",
          "section_id": "ENG101-A",
          "professor": "Prof. Davis",
          "session_number": 1,
          "total_sessions": 1,
          "enrolled_students": 35
        }
      ]
    }
  };
}

export default ScheduleManagement;