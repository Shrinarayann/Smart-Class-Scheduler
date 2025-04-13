import React, { useState } from 'react';
import './ScheduleManagement.css';

function ScheduleManagement() {
  // Time slots for the schedule
  const timeSlots = [
    '8:00 AM - 9:00 AM',
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 1:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM'
  ];
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  // Mock rooms
  const rooms = ['A101', 'A102', 'B201', 'B202', 'C301', 'C302'];
  
  // Mock courses from previous component
  const courses = [
    { id: 1, code: 'CS101', name: 'Introduction to Programming', faculty: 'Dr. Robert Johnson' },
    { id: 2, code: 'CS205', name: 'Data Structures', faculty: 'Dr. Emily Chen' },
    { id: 3, code: 'MATH201', name: 'Calculus II', faculty: 'Prof. Michael Brown' },
    { id: 4, code: 'ENG101', name: 'English Composition', faculty: 'Dr. Sarah Miller' },
    { id: 5, code: 'PHYS101', name: 'Physics I', faculty: 'Dr. James Wilson' },
    { id: 6, code: 'BUS301', name: 'Business Ethics', faculty: 'Prof. Lisa Garcia' },
  ];
  
  // Initial schedule state - empty timetable
  const initialSchedule = {};
  days.forEach(day => {
    initialSchedule[day] = {};
    timeSlots.forEach(timeSlot => {
      initialSchedule[day][timeSlot] = null;
    });
  });
  
  const [schedule, setSchedule] = useState(initialSchedule);
  const [showModal, setShowModal] = useState(false);
  const [currentSlot, setCurrentSlot] = useState({
    day: '',
    timeSlot: ''
  });
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [conflicts, setConflicts] = useState([]);
  
  // For detecting conflicts
  const [facultySchedule, setFacultySchedule] = useState({});
  const [roomSchedule, setRoomSchedule] = useState({});
  
  // Generate a class for schedule cell based on content
  const getCellClass = (day, timeSlot) => {
    const cellData = schedule[day][timeSlot];
    if (!cellData) return 'empty-cell';
    
    // Check if this cell has a conflict
    const isConflict = conflicts.some(
      conflict => conflict.day === day && conflict.timeSlot === timeSlot
    );
    
    if (isConflict) return 'conflict-cell';
    return 'scheduled-cell';
  };
  
  // Open modal to assign a course to a time slot
  const openSlotModal = (day, timeSlot) => {
    setCurrentSlot({ day, timeSlot });
    setSelectedCourse('');
    setSelectedRoom('');
    setShowModal(true);
  };
  
  // Close the modal
  const closeModal = () => {
    setShowModal(false);
  };
  
  // Save the schedule assignment
  const saveScheduleItem = () => {
    if (!selectedCourse || !selectedRoom) {
      alert('Please select both a course and a room.');
      return;
    }
    
    const selectedCourseObj = courses.find(c => c.id === parseInt(selectedCourse, 10));
    
    // Update the schedule
    const newSchedule = { ...schedule };
    newSchedule[currentSlot.day][currentSlot.timeSlot] = {
      course: selectedCourseObj,
      room: selectedRoom
    };
    setSchedule(newSchedule);
    
    // Check for conflicts after updating
    const newConflicts = [];
    const newFacultySchedule = { ...facultySchedule };
    const newRoomSchedule = { ...roomSchedule };
    
    // Faculty conflict check
    const facultyKey = `${currentSlot.day}-${currentSlot.timeSlot}-${selectedCourseObj.faculty}`;
    if (newFacultySchedule[facultyKey]) {
      newConflicts.push({
        day: currentSlot.day,
        timeSlot: currentSlot.timeSlot,
        type: 'faculty',
        message: `${selectedCourseObj.faculty} is already teaching at this time.`
      });
    }
    newFacultySchedule[facultyKey] = true;
    
    // Room conflict check
    const roomKey = `${currentSlot.day}-${currentSlot.timeSlot}-${selectedRoom}`;
    if (newRoomSchedule[roomKey]) {
      newConflicts.push({
        day: currentSlot.day,
        timeSlot: currentSlot.timeSlot,
        type: 'room',
        message: `Room ${selectedRoom} is already in use at this time.`
      });
    }
    newRoomSchedule[roomKey] = true;
    
    setFacultySchedule(newFacultySchedule);
    setRoomSchedule(newRoomSchedule);
    setConflicts(newConflicts);
    
    closeModal();
  };
  
  // Clear a scheduled item
  const clearScheduleItem = (day, timeSlot) => {
    const newSchedule = { ...schedule };
    newSchedule[day][timeSlot] = null;
    setSchedule(newSchedule);
    
    // Reset conflict tracking for this slot
    const currentFacultySchedule = { ...facultySchedule };
    const currentRoomSchedule = { ...roomSchedule };
    
    // Remove any faculty and room entries for this time slot
    Object.keys(currentFacultySchedule).forEach(key => {
      if (key.startsWith(`${day}-${timeSlot}`)) {
        delete currentFacultySchedule[key];
      }
    });
    
    Object.keys(currentRoomSchedule).forEach(key => {
      if (key.startsWith(`${day}-${timeSlot}`)) {
        delete currentRoomSchedule[key];
      }
    });
    
    setFacultySchedule(currentFacultySchedule);
    setRoomSchedule(currentRoomSchedule);
    
    // Update conflicts
    setConflicts(conflicts.filter(
      conflict => !(conflict.day === day && conflict.timeSlot === timeSlot)
    ));
  };
  
  // Export schedule (mock function)
  const exportSchedule = (format) => {
    alert(`Exporting schedule as ${format}. In a real application, this would generate and download a ${format} file.`);
  };
  
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
        </div>
      </div>
      
      {conflicts.length > 0 && (
        <div className="conflicts-warning">
          <h3><i className="fas fa-exclamation-triangle"></i> Schedule Conflicts Detected</h3>
          <ul>
            {conflicts.map((conflict, index) => (
              <li key={index}>
                {conflict.day}, {conflict.timeSlot}: {conflict.message}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="timetable-container">
        <table className="timetable">
          <thead>
            <tr>
              <th>Time Slot</th>
              {days.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((timeSlot) => (
              <tr key={timeSlot}>
                <td className="time-cell">{timeSlot}</td>
                {days.map((day) => {
                  const cellData = schedule[day][timeSlot];
                  return (
                    <td 
                      key={`${day}-${timeSlot}`} 
                      className={getCellClass(day, timeSlot)}
                      onClick={() => openSlotModal(day, timeSlot)}
                    >
                      {cellData ? (
                        <div className="cell-content">
                          <div className="cell-course">{cellData.course.code}</div>
                          <div className="cell-room">Room: {cellData.room}</div>
                          <div className="cell-faculty">{cellData.course.faculty}</div>
                          <button 
                            className="cell-clear-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              clearScheduleItem(day, timeSlot);
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="cell-empty">Click to assign</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Modal for assigning a course to a time slot */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Assign Course to {currentSlot.day}, {currentSlot.timeSlot}</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Select Course:</label>
                <select 
                  value={selectedCourse} 
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  required
                >
                  <option value="">Select a Course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.name} ({course.faculty})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Select Room:</label>
                <select 
                  value={selectedRoom} 
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  required
                >
                  <option value="">Select a Room</option>
                  {rooms.map((room) => (
                    <option key={room} value={room}>
                      {room}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn-primary" onClick={saveScheduleItem}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScheduleManagement;