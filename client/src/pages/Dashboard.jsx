import React, { useState } from "react";
import "./Dashboard.css";

const courseList = [
  "Computer Networks",
  "Operating Systems",
  "Data Structures",
  "Algorithm Design",
  "Database Systems",
  "Web Development"
];

function Dashboard() {
  const [selectedCourses, setSelectedCourses] = useState([]);

  const toggleCourse = (course) => {
    setSelectedCourses((prev) =>
      prev.includes(course)
        ? prev.filter((c) => c !== course)
        : [...prev, course]
    );
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome Back!</h1>
        <p>Select your courses for this semester</p>
      </div>
      
      <div className="course-selection">
        <h2>Available Courses</h2>
        <div className="course-grid">
          {courseList.map((course) => (
            <div
              key={course}
              className={`course-card ${selectedCourses.includes(course) ? "selected" : ""}`}
              onClick={() => toggleCourse(course)}
            >
              <div className="course-title">{course}</div>
              <div className="course-status">
                {selectedCourses.includes(course) ? "Selected" : "Click to select"}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="selected-courses">
        <h2>Your Selected Courses</h2>
        {selectedCourses.length > 0 ? (
          <ul className="selected-list">
            {selectedCourses.map((course) => (
              <li key={course}>{course}</li>
            ))}
          </ul>
        ) : (
          <p className="no-courses">No courses selected yet</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;