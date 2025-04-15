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
    course_id: '',    // Use course_id instead of id
    course_name: '',  // Use course_name instead of name
    credits: 3        // Credits remain as is
  });
  

  //Faculty
  const [showFacultyModal, setShowFacultyModal] = useState(false);
  const [facultyForm, setFacultyForm] = useState({
    teacherId: '',
    name: '',
    email: '',
    department: '',
    courses: [] // list of course IDs or names
  });

  const [facultyErrors, setFacultyErrors] = useState({});

  
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
      course_id: '',     // Make sure this matches API expectation
      course_name: '',   // Make sure this matches API expectation
      credits: 3         // Make sure this matches API expectation
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
      [name]: value,  // Dynamically update state based on input name
    });
  };  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFacultyInputChange = (e) => {
    const { name, value } = e.target;
    setFacultyForm(prev => ({
      ...prev,
      [name]: value
  }));
  };
  
  const handleFacultyCoursesChange = (e) => {
    const selectedCourses = Array.from(e.target.selectedOptions, option => option.value);
    setFacultyForm(prev => ({
      ...prev,
      courses: selectedCourses
    }));
  };
  
  
  const validateFacultyForm = () => {
    const errors = {};
    if (!facultyForm.teacherId.trim()) errors.teacherId = 'Teacher ID is required';
    if (!facultyForm.name.trim()) errors.name = 'Name is required';
    if (!facultyForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(facultyForm.email)) {
      errors.email = 'Invalid email format';
    }
    if (!facultyForm.department.trim()) errors.department = 'Department is required';
    if (facultyForm.courses.length === 0) errors.courses = 'At least one course must be selected';
  
    setFacultyErrors(errors);
    return Object.keys(errors).length === 0;
  };
  

  const validateCourseForm = () => {
    if (!currentCourse.course_id || !currentCourse.course_name) {
      alert('Course Code and Course Name are required');
      return false;
    }
    return true;
  };
  

  const saveFaculty = async () => {
    if (validateFacultyForm()) {
      try {
        // Format data to match expected backend format
        const facultyData = {
          teacher_id: facultyForm.teacherId,        // Changed to snake_case
          name: facultyForm.name,                   // Same
          email: facultyForm.email,                 // Same
          department: facultyForm.department,       // Same
          teachable_courses: facultyForm.courses    // Changed from teachableCourses to match backend
        };
        
        console.log("Sending faculty data:", facultyData); // Debug log
        
        const response = await fetch('http://localhost:8000/api/v1/teacher/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(facultyData),
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Server error response:", errorText);
          throw new Error('Server returned an error');
        }
  
        const newFaculty = await response.json();
        console.log("New Faculty Registered:", newFaculty);
  
        // Update UI with the new faculty
        // Update this line in your saveFaculty function
        setFacultyList(prev => [...prev, newFaculty.name]);
        setShowFacultyModal(false);
        setFacultyForm({
          teacherId: '',
          name: '',
          email: '',
          department: '',
          courses: []
        });
        
        alert('Faculty registered successfully!');
      } catch (error) {
        console.error('Error saving faculty:', error);
        alert('Error occurred while registering faculty.');
      }
    }
  };
  
  // Classroom Modal
  const [showClassroomModal, setShowClassroomModal] = useState(false);
  const [classroomForm, setClassroomForm] = useState({
    roomId: '',
    capacity: ''
  });
  const [classroomErrors, setClassroomErrors] = useState({});

  const handleClassroomInputChange = (e) => {
    const { name, value } = e.target;
    setClassroomForm(prev => ({
      ...prev,
      [name]: value
    }));

    if (classroomErrors[name]) {
      setClassroomErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateClassroomForm = () => {
    const errors = {};
    if (!classroomForm.roomId.trim()) errors.roomId = 'Room ID is required';
    if (!classroomForm.capacity || isNaN(classroomForm.capacity)) {
      errors.capacity = 'Valid capacity is required';
    }

    setClassroomErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveClassroom = async () => {
    if (!validateClassroomForm()) return;
  
    try {
      // Format data to match expected backend format
      const roomData = {
        room_id: classroomForm.roomId,       // Match backend's expected field name
        capacity: parseInt(classroomForm.capacity)  // Ensure it's a number
      };
      
      console.log("Sending classroom data:", roomData); // Debug log
      
      const response = await fetch('http://localhost:8000/api/v1/room/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await response.json();
      console.log('Classroom added:', result);
  
      alert(`Classroom ${result.room_id} with capacity ${result.capacity} added.`);
      setShowClassroomModal(false);
      setClassroomForm({ roomId: '', capacity: '' });
    } catch (err) {
      console.error('Error adding classroom:', err);
      alert('Failed to add classroom. Try again.');
    }
  };
  

  const availableCourses = [
    { id: 1, name: "Data Structures" },
    { id: 2, name: "Operating Systems" },
    { id: 3, name: "Databases" },
    { id: 4, name: "Machine Learning" },
    { id: 5, name: "Computer Networks" },
  ];
  
  
  // Available faculty for now
  const [facultyList, setFacultyList] = useState([
    'Dr. Robert Johnson',
    'Dr. Emily Chen',
    'Prof. Michael Brown',
    'Dr. Sarah Miller',
    'Dr. James Wilson',
    'Prof. Lisa Garcia',
  ]);
  
  
  const saveCourse = async () => {
    if (!validateCourseForm()) return;
  
    try {
      // Create an object with exactly the fields the API expects
      const courseData = {
        course_id: currentCourse.course_id,
        course_name: currentCourse.course_name,
        credits: parseInt(currentCourse.credits) // Ensure it's a number
      };
  
      console.log("Sending data to API:", courseData); // Debug log
      
      const response = await fetch('http://localhost:8000/api/v1/course/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to add course: ${errorData}`);
      }
  
      const createdCourse = await response.json();
      console.log("Course created:", createdCourse);
  
      setCourses([...courses, createdCourse]);
      alert(`Course ${createdCourse.course_name} has been added successfully!`);
      
      closeModal();
    } catch (error) {
      console.error('Error saving course:', error);
      alert('There was an error saving the course. Please try again.');
    }
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

  // Add these state variables at the top with your other state declarations
const [showScholarModal, setShowScholarModal] = useState(false);
const [scholarForm, setScholarForm] = useState({
  scholar_id: '',
  name: '',
  TA_courses: '',
  supervisor_id: ''
});
const [scholarErrors, setScholarErrors] = useState({});

// Add this handler function with your other handlers
const handleScholarInputChange = (e) => {
  const { name, value } = e.target;
  setScholarForm(prev => ({
    ...prev,
    [name]: value
  }));

  if (scholarErrors[name]) {
    setScholarErrors(prev => ({ ...prev, [name]: '' }));
  }
};

// Add this validation function
const validateScholarForm = () => {
  const errors = {};
  if (!scholarForm.scholar_id.trim()) errors.scholar_id = 'Scholar ID is required';
  if (!scholarForm.name.trim()) errors.name = 'Name is required';
  
  setScholarErrors(errors);
  return Object.keys(errors).length === 0;
};

// Add this submit function
const saveScholar = async () => {
  if (!validateScholarForm()) return;

  try {
    const response = await fetch('http://localhost:8000/api/v1/scholar/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scholarForm),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    console.log('Research Scholar added:', result);

    alert(`Research Scholar ${result.name} with ID ${result.scholar_id} added.`);
    setShowScholarModal(false);
    setScholarForm({ scholar_id: '', name: '', TA_courses: '', supervisor_id: '' });
  } catch (err) {
    console.error('Error adding research scholar:', err);
    alert('Failed to add research scholar. Try again.');
  }
};

  return (
    <div className="course-management">
      <div className="page-header">
        <h1>Course Management</h1>
        <button className="btn-primary" onClick={openAddModal}>
          <i className="fas fa-plus"></i> Add New Course
        </button>

        <button className="btn-info" onClick={() => setShowFacultyModal(true)}>
          <i className="fas fa-user-plus"></i> Register Faculty
        </button>

        <button className="btn-success" onClick={() => setShowClassroomModal(true)}>
          <i className="fas fa-door-open"></i> Add Classroom
        </button>
        
        <button className="btn-warning" onClick={() => setShowScholarModal(true)}>
          <i className="fas fa-user-graduate"></i> Research Scholar
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
                  name="course_id"
                  value={currentCourse.course_id}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label>Course Name:</label>
                <input
                  type="text"
                  name="course_name"
                  value={currentCourse.course_name}
                  onChange={handleInputChange}
                />
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
                
              </div>

            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn-primary" onClick={saveCourse}>Save</button>
            </div>
          </div>
        </div>
      )}

      {showFacultyModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Register New Faculty</h2>
              <button className="close-btn" onClick={() => setShowFacultyModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {/* Teacher ID Input */}
              <div className="form-group">
                <label>Teacher ID:</label>
                <input
                  type="text"
                  name="teacherId"
                  value={facultyForm.teacherId}
                  onChange={handleFacultyInputChange}
                />
                {facultyErrors.teacherId && <div className="error-text">{facultyErrors.teacherId}</div>}
              </div>

              {/* Name Input */}
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={facultyForm.name}
                  onChange={handleFacultyInputChange}
                />
                {facultyErrors.name && <div className="error-text">{facultyErrors.name}</div>}
              </div>

              {/* Email Input */}
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={facultyForm.email}
                  onChange={handleFacultyInputChange}
                />
                {facultyErrors.email && <div className="error-text">{facultyErrors.email}</div>}
              </div>

              {/* Department Input */}
              <div className="form-group">
                <label>Department:</label>
                <input
                  type="text"
                  name="department"
                  value={facultyForm.department}
                  onChange={handleFacultyInputChange}
                />
                {facultyErrors.department && <div className="error-text">{facultyErrors.department}</div>}
              </div>

              {/* Courses Select */}
              <div className="form-group">
                <label>Courses they can teach:</label>
                <select
                  name="courses"
                  multiple
                  value={facultyForm.courses}
                  onChange={handleFacultyCoursesChange}
                >
                  {availableCourses.map((course) => (
                    <option key={course.id} value={course.code}>
                      {course.name}
                    </option>
                  ))}
                </select>
                {facultyErrors.courses && <div className="error-text">{facultyErrors.courses}</div>}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowFacultyModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={saveFaculty}>Register</button>
            </div>
          </div>
        </div>
      )}

      {showClassroomModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Add Classroom</h2>
              <button className="close-btn" onClick={() => setShowClassroomModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Room ID:</label>
                <input
                  type="text"
                  name="roomId"
                  value={classroomForm.roomId}
                  onChange={handleClassroomInputChange}
                />
                {classroomErrors.roomId && <div className="error-text">{classroomErrors.roomId}</div>}
              </div>

              <div className="form-group">
                <label>Capacity:</label>
                <input
                  type="number"
                  name="capacity"
                  value={classroomForm.capacity}
                  onChange={handleClassroomInputChange}
                />
                {classroomErrors.capacity && <div className="error-text">{classroomErrors.capacity}</div>}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowClassroomModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={saveClassroom}>Save</button>
            </div>
          </div>
        </div>
      )}

      {showScholarModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Add Research Scholar</h2>
              <button className="close-btn" onClick={() => setShowScholarModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Scholar ID:</label>
                <input
                  type="text"
                  name="scholar_id"
                  value={scholarForm.scholar_id}
                  onChange={handleScholarInputChange}
                />
                {scholarErrors.scholar_id && <div className="error-text">{scholarErrors.scholar_id}</div>}
              </div>

              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={scholarForm.name}
                  onChange={handleScholarInputChange}
                />
                {scholarErrors.name && <div className="error-text">{scholarErrors.name}</div>}
              </div>

              <div className="form-group">
                <label>TA Courses:</label>
                <input
                  type="text"
                  name="TA_courses"
                  value={scholarForm.TA_courses}
                  onChange={handleScholarInputChange}
                />
              </div>

              <div className="form-group">
                <label>Supervisor ID:</label>
                <input
                  type="text"
                  name="supervisor_id"
                  value={scholarForm.supervisor_id}
                  onChange={handleScholarInputChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowScholarModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={saveScholar}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
    

  );
}
export default CourseManagement;