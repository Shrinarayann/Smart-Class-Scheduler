import React, { useState } from 'react';
import './StudentManagement.css';

function StudentManagement() {
  // Mock student data
  const initialStudents = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', year: 'Sophomore', department: 'Computer Science', courses: ['CS101', 'CS205', 'MATH201'] },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', year: 'Freshman', department: 'Engineering', courses: ['ENG101', 'PHYS101', 'MATH101'] },
    { id: 3, name: 'Alex Johnson', email: 'alex.j@example.com', year: 'Senior', department: 'Business', courses: ['BUS405', 'ECON301', 'MKT201'] },
    { id: 4, name: 'Sarah Williams', email: 'sarah.w@example.com', year: 'Junior', department: 'Arts', courses: ['ART301', 'HIST202', 'ENG201'] },
    { id: 5, name: 'Michael Brown', email: 'michael.b@example.com', year: 'Sophomore', department: 'Medicine', courses: ['MED201', 'BIO202', 'CHEM201'] },
    { id: 6, name: 'Emily Davis', email: 'emily.d@example.com', year: 'Freshman', department: 'Computer Science', courses: ['CS101', 'CS102', 'MATH101'] },
    { id: 7, name: 'Daniel Wilson', email: 'daniel.w@example.com', year: 'Senior', department: 'Engineering', courses: ['ENG401', 'ENG405', 'PHYS301'] },
    { id: 8, name: 'Olivia Martinez', email: 'olivia.m@example.com', year: 'Junior', department: 'Business', courses: ['BUS301', 'FIN301', 'MKT301'] },
  ];

  const [students, setStudents] = useState(initialStudents);
  const [filteredStudents, setFilteredStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(5);
  
  // For adding/editing student modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({
    id: null,
    name: '',
    email: '',
    year: '',
    department: '',
    courses: []
  });

  // Filter students based on search and filters
  React.useEffect(() => {
    let results = students;
    
    if (searchTerm) {
      results = results.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (departmentFilter) {
      results = results.filter(student => student.department === departmentFilter);
    }
    
    if (yearFilter) {
      results = results.filter(student => student.year === yearFilter);
    }
    
    setFilteredStudents(results);
    setCurrentPage(1);
  }, [searchTerm, departmentFilter, yearFilter, students]);

  // Get unique departments for filter dropdown
  const departments = [...new Set(students.map(student => student.department))];
  const years = ['Freshman', 'Sophomore', 'Junior', 'Senior'];

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Modal functions
  const openAddModal = () => {
    setIsEditing(false);
    setCurrentStudent({
      id: null,
      name: '',
      email: '',
      year: '',
      department: '',
      courses: []
    });
    setShowModal(true);
  };

  const openEditModal = (student) => {
    setIsEditing(true);
    setCurrentStudent(student);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentStudent({
      ...currentStudent,
      [name]: value
    });
  };

  const handleCourseChange = (e) => {
    const courses = e.target.value.split(',').map(course => course.trim());
    setCurrentStudent({
      ...currentStudent,
      courses
    });
  };

  const saveStudent = () => {
    if (isEditing) {
      // Update existing student
      setStudents(students.map(student => 
        student.id === currentStudent.id ? currentStudent : student
      ));
    } else {
      // Add new student
      const newStudent = {
        ...currentStudent,
        id: students.length + 1
      };
      setStudents([...students, newStudent]);
    }
    
    closeModal();
  };

  const deleteStudent = (id) => {
    if (window.confirm('Are you sure you want to remove this student?')) {
      setStudents(students.filter(student => student.id !== id));
    }
  };

  const resetPassword = (id) => {
    alert(`Password reset email sent to the student with ID: ${id}`);
  };

  return (
    <div className="student-management">
      <div className="page-header">
        <h1>Student Management</h1>
        <button className="btn-primary" onClick={openAddModal}>
          <i className="fas fa-plus"></i> Add New Student
        </button>
      </div>

      <div className="filters-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-selects">
          <select 
            value={departmentFilter} 
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>{dept}</option>
            ))}
          </select>

          <select 
            value={yearFilter} 
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="">All Years</option>
            {years.map((year, index) => (
              <option key={index} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="no-results">No students found matching your criteria.</div>
      ) : (
        <>
          <div className="table-container">
            <table className="students-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Year</th>
                  <th>Department</th>
                  <th>Enrolled Courses</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.year}</td>
                    <td>{student.department}</td>
                    <td>{student.courses.join(', ')}</td>
                    <td className="action-buttons">
                      <button className="btn-primary" onClick={() => openEditModal(student)}>
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="btn-warning" onClick={() => openEditModal(student)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn-danger" onClick={() => deleteStudent(student.id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                      <button className="btn-info" onClick={() => resetPassword(student.id)}>
                        <i className="fas fa-key"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button 
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            
            <div className="pagination-info">
              Page {currentPage} of {totalPages}
            </div>
            
            <button 
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Student Modal for Add/Edit */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>{isEditing ? 'Edit Student' : 'Add New Student'}</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={currentStudent.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={currentStudent.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Year:</label>
                <select
                  name="year"
                  value={currentStudent.year}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Year</option>
                  {years.map((year, index) => (
                    <option key={index} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Department:</label>
                <select
                  name="department"
                  value={currentStudent.department}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept, index) => (
                    <option key={index} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Courses (comma separated):</label>
                <input
                  type="text"
                  name="courses"
                  value={currentStudent.courses.join(', ')}
                  onChange={handleCourseChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn-primary" onClick={saveStudent}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentManagement;