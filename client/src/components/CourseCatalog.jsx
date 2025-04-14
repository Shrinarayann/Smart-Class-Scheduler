// components/CourseCatalog.jsx
import { useState } from 'react';

export default function CourseCatalog({ courses, enrolledCourses, onEnroll }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.name.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedFilter === 'All') return matchesSearch;
    if (selectedFilter === 'Open') return matchesSearch && course.status === 'Open';
    if (selectedFilter === 'Full') return matchesSearch && course.status === 'Full';

    return matchesSearch;
  });

  return (
    <div className="catalog-container">
      <div className="catalog-header">
        <div className="header-controls">
          <h2 className="text-lg font-medium">Available Courses</h2>
          <div className="filter-buttons">
            <button 
              className={`filter-button ${selectedFilter === 'All' ? 'active-all' : ''}`}
              onClick={() => setSelectedFilter('All')}>
              All
            </button>
            <button 
              className={`filter-button ${selectedFilter === 'Open' ? 'active-open' : ''}`}
              onClick={() => setSelectedFilter('Open')}>
              Open
            </button>
            <button 
              className={`filter-button ${selectedFilter === 'Full' ? 'active-full' : ''}`}
              onClick={() => setSelectedFilter('Full')}>
              Full
            </button>
          </div>
        </div>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Search courses by code or name..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="course-table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Instructor</th>
              {/* <th>Schedule</th> */}
              <th>Credits</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map(course => {
              const isEnrolled = enrolledCourses.some(c => c.id === course.id);

              return (
                <tr key={course.id}>
                  <td>
                    <div>
                      <div className="course-name">{course.code}</div>
                      <div className="course-code">{course.name}</div>
                    </div>
                  </td>
                  <td>{course.instructor}</td>
                  {/* <td>{course.schedule}</td> */}
                  <td>{course.credits}</td>
                  <td>
                    <span className={`course-status ${
                      course.status === 'Open' ? 'status-open' : 'status-full'
                    }`}>
                      {course.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => !isEnrolled && course.status === 'Open' && onEnroll(course)}
                      disabled={isEnrolled || course.status === 'Full'}
                      className={`enroll-button ${
                        isEnrolled 
                          ? 'enroll-disabled'
                          : course.status === 'Full'
                            ? 'enroll-disabled'
                            : 'enroll-active'
                      }`}
                    >
                      {isEnrolled ? 'Enrolled' : 'Enroll'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
