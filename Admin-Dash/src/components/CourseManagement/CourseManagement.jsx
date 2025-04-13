import React, { useState } from 'react';
import './CourseManagement.css';

function CourseManagement() {
  // Mock course data
  const initialCourses = [
    { id: 1, code: 'CS101', name: 'Introduction to Programming', faculty: 'Dr. Robert Johnson', students: 45, description: 'Basic programming concepts using Python', credits: 3 },
    { id: 2, code: 'CS205', name: 'Data Structures', faculty: 'Dr. Emily Chen', students: 38, description: 'Advanced data structures and algorithms', credits: 4 },
    { id: 3, code: 'MATH201', name: 'Calculus II', faculty: 'Prof. Michael Brown', students: 50, description: 'Integration techniques and applications', credits: 4 },
    { id: 4, code: 'ENG101', name: 'English Composition', faculty: 'Dr. Sarah Miller', students: 65, description: 'Fundamentals of writing and rhetoric', credits: 3 },
    { id: 5, code: 'PHYS101', name: 'Physics I', faculty: 'Dr. James Wilson', students: 42, description: 'Mechanics and thermodynamics', credits: 4 },
    { id: 6, code: 'BUS301', name: 'Business Ethics', faculty: 'Prof. Lisa Garcia', students: 35, description: 'Ethical considerations in business decisions', credits: 3 },
  ];

  const [courses, setCourses] = useState(initialCourses);
  const [filteredCourses, setFilteredCourses] = useState(initialCourses);
  const [searchTerm, setSearchTerm] = useState('');
  
  // For adding/editing course modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState({
    id: null,
    code: '',
    name: '',
    faculty: '',
    students: 0,
    description: '',
    credits: 0
  });
  
  // For displaying file upload
  const [selectedFile, setSelectedFile] = useState(null);

  // Filter courses based on search term
  React.useEffect(() => {
    if (searchTerm) {
      const results = courses.filter(course => 
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.faculty.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(results);
    } else {
      setFilteredCourses(courses);
    }
  }, [searchTerm, courses]);

  // Modal functions
  const openAddModal = () => {
    setIsEditing(false);
    setCurrentCourse({
      id: null,
      code: '',
      name: '',
      faculty: '',
      students: 0,
      description: '',
      credits: 3
    });
    setSelectedFile(null);
    setShowModal(true);
  };

  const openEditModal = (course) => {
    setIsEditing(true);
    setCurrentCourse(course);
    setSelectedFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCourse({
      ...currentCourse,
      [name]: name === 'students' || name === 'credits' ? parseInt(value, 10) : value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const saveCourse = () => {
    if (isEditing) {
      // Update existing course
      setCourses(courses.map(course => 
        course.id === currentCourse.id ? currentCourse : course
      ));
    } else {
      // Add new course
      const newCourse = {
        ...currentCourse,
        id: courses.length + 1
      };
      setCourses([...courses, newCourse]);
    }
    
    // If we had a real backend, we would upload the file here
    if (selectedFile) {
      console.log(`Uploading file: ${selectedFile.name}`);
      // Actual file upload would go here
    }
    
    closeModal();
  };

  const deleteCourse = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(course => course.id !== id));
    }
  };

  const assignInstructor = (course) => {
    const instructor = prompt('Enter the name of the instructor to assign:', course.faculty);
    if (instructor) {
      setCourses(courses.map(c => 
        c.id === course.id ? {...c, faculty: instructor} : c
      ));
    }
  };

  return (
    <div className="course-management">
      <div className="page-header">
        <h1>Course Management</h1>
        <button className="btn-primary" onClick={openAddModal}>
          <i className="fas fa-plus"></i> Add New Course
        </button>
      </div>

      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by course name, code, or faculty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="no-results">No courses found matching your criteria.</div>
      ) : (
        <div className="table-container">
          <table className="courses-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Faculty</th>
                <th>Enrolled Students</th>
                <th>Credits</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course.id}>
                  <td>{course.code}</td>
                  <td>{course.name}</td>
                  <td>{course.faculty}</td>
                  <td>{course.students}</td>
                  <td>{course.credits}</td>
                  <td className="action-buttons">
                    <button className="btn-primary" onClick={() => openEditModal(course)}>
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="btn-warning" onClick={() => openEditModal(course)}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn-danger" onClick={() => deleteCourse(course.id)}>
                      <i className="fas fa-trash"></i>
                    </button>
                    <button className="btn-info" onClick={() => assignInstructor(course)}>
                      <i className="fas fa-user-plus"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Course Modal for Add/Edit */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>{isEditing ? 'Edit Course' : 'Add New Course'}</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Course Code:</label>
                <input
                  type="text"
                  name="code"
                  value={currentCourse.code}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Course Name:</label>
                <input
                  type="text"
                  name="name"
                  value={currentCourse.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Faculty:</label>
                <input
                  type="text"
                  name="faculty"
                  value={currentCourse.faculty}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={currentCourse.description}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
              </div>
              
              <div className="form-row">
                <div className="form-group half">
                  <label>Credits:</label>
                  <input
                    type="number"
                    name="credits"
                    min="1"
                    max="6"
                    value={currentCourse.credits}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group half">
                  <label>Enrollment Cap:</label>
                  <input
                    type="number"
                    name="students"
                    min="0"
                    value={currentCourse.students}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Syllabus Upload:</label>
                <div className="file-input-container">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                  />
                  {selectedFile && (
                    <div className="selected-file">
                      Selected: {selectedFile.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn-primary" onClick={saveCourse}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseManagement;