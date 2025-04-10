import React from "react";
import './Catalog.css';

const catalogData = [
  { code: "CS101", title: "Computer Networks", professor: "Dr. A", credits: 3, hours: "Mon 10-12" },
  { code: "CS102", title: "Operating Systems", professor: "Dr. B", credits: 4, hours: "Tue 2-4" },
  { code: "CS103", title: "Data Structures", professor: "Dr. C", credits: 3, hours: "Wed 9-11" },
  { code: "CS104", title: "Artificial Intelligence", professor: "Dr. D", credits: 4, hours: "Thu 11-1" },
  { code: "CS105", title: "Machine Learning", professor: "Dr. E", credits: 3, hours: "Fri 1-3" }
];

function Catalog() {
  return (
    <div className="catalog">
      <h2>Course Catalog</h2>
      <div className="catalog-list">
        {catalogData.map((course) => (
          <div key={course.code} className="catalog-card">
            <h4>{course.code} - {course.title}</h4>
            <p><strong>Professor:</strong> {course.professor}</p>
            <p><strong>Credits:</strong> {course.credits}</p>
            <p><strong>Hours:</strong> {course.hours}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Catalog;