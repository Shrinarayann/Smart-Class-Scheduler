import React from "react";
import './Schedule.css';

const scheduleData = [
  { course: "Computer Networks", time: "Mon 10-12", room: "A101" },
  { course: "Operating Systems", time: "Tue 2-4", room: "B202" },
  { course: "Machine Learning", time: "Fri 1-3", room: "C303" }
];

function Schedule() {
  return (
    <div className="schedule">
      <h2>My Weekly Schedule</h2>
      <table className="schedule-table">
        <thead>
          <tr>
            <th>Course</th>
            <th>Time</th>
            <th>Room</th>
          </tr>
        </thead>
        <tbody>
          {scheduleData.map((entry, index) => (
            <tr key={index}>
              <td>{entry.course}</td>
              <td>{entry.time}</td>
              <td>{entry.room}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Schedule;