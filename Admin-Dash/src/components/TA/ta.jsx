import React, { useState,useEffect } from 'react';
import './ta.css';

function TeachingAssistants() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [formData, setFormData] = useState({
    course_code: '',
    course_name: '',
    scholar_id: '',
    scholar_name: ''
  });
  
  // Mock data for teaching assistant assignments
//   const [taAssignments, setTaAssignments] = useState([
//     {
//       course_code: "CS101",
//       course_name: "Introduction to Programming",
//       scholar_id: "RS001",
//       scholar_name: "Alex Johnson"
//     },
//     {
//       course_code: "CS201",
//       course_name: "Data Structures",
//       scholar_id: "RS001",
//       scholar_name: "Alex Johnson"
//     },
//     {
//       course_code: "CS301",
//       course_name: "Database Systems",
//       scholar_id: "RS002",
//       scholar_name: "Maya Patel"
//     },
//     {
//       course_code: "CS401",
//       course_name: "Web Development",
//       scholar_id: "RS002",
//       scholar_name: "Maya Patel"
//     },
//     {
//       course_code: "CS202",
//       course_name: "Algorithms",
//       scholar_id: "RS003",
//       scholar_name: "David Chen"
//     },
//     {
//       course_code: "CS302",
//       course_name: "Discrete Mathematics",
//       scholar_id: "RS003",
//       scholar_name: "David Chen"
//     },
//     {
//       course_code: "CS501",
//       course_name: "Machine Learning",
//       scholar_id: "RS004",
//       scholar_name: "Sarah Williams"
//     },
//     {
//       course_code: "CS502",
//       course_name: "Artificial Intelligence",
//       scholar_id: "RS004",
//       scholar_name: "Sarah Williams"
//     }
//   ]);

const [taAssignments, setTaAssignments] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  fetch("http://localhost:8080/api/v1/scholar/ta/assignment")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      return response.json();
    })
    .then((data) => {
      setTaAssignments(data);
      setLoading(false);
    })
    .catch((err) => {
      setError("Error loading TA assignments.");
      setLoading(false);
    });
}, []);

if (loading) return <p>Loading TA assignments...</p>;
if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Add Modal Functions
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    resetFormData();
  };

  // Edit Modal Functions
  const handleOpenEditModal = (assignment) => {
    setCurrentAssignment(assignment);
    setFormData({
      course_code: assignment.course_code,
      course_name: assignment.course_name,
      scholar_id: assignment.scholar_id,
      scholar_name: assignment.scholar_name
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentAssignment(null);
    resetFormData();
  };

  // Delete Modal Functions
  const handleOpenDeleteModal = (assignment) => {
    setCurrentAssignment(assignment);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentAssignment(null);
  };

  const resetFormData = () => {
    setFormData({
      course_code: '',
      course_name: '',
      scholar_id: '',
      scholar_name: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    
    // Add the new assignment to the list
    setTaAssignments([...taAssignments, formData]);
    
    // Close the modal
    handleCloseAddModal();
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    // Update the assignment in the list
    const updatedAssignments = taAssignments.map(assignment => 
      (assignment.course_code === currentAssignment.course_code && 
       assignment.scholar_id === currentAssignment.scholar_id) 
        ? formData 
        : assignment
    );
    
    setTaAssignments(updatedAssignments);
    handleCloseEditModal();
  };

  const handleDeleteSubmit = () => {
    // Filter out the assignment to delete
    const updatedAssignments = taAssignments.filter(
      assignment => !(
        assignment.course_code === currentAssignment.course_code && 
        assignment.scholar_id === currentAssignment.scholar_id
      )
    );
    
    setTaAssignments(updatedAssignments);
    handleCloseDeleteModal();
  };

  return (
    <div className="teaching-assistants-container">
      <div className="header">
        <h1>TA Assignments Dashboard</h1>
        <button className="add-button" onClick={handleOpenAddModal}>
          Add New Assignment
        </button>
      </div>

      <div className="ta-table-container">
        <table className="ta-table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Scholar ID</th>
              <th>Scholar Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {taAssignments.map((assignment, index) => (
              <tr key={index}>
                <td>{assignment.course_code}</td>
                <td>{assignment.course_name}</td>
                <td>{assignment.scholar_id}</td>
                <td>{assignment.scholar_name}</td>
                <td>
                  <button 
                    className="action-button edit" 
                    onClick={() => handleOpenEditModal(assignment)}
                  >
                    Edit
                  </button>
                  <button 
                    className="action-button delete" 
                    onClick={() => handleOpenDeleteModal(assignment)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Assignment</h2>
              <button className="close-button" onClick={handleCloseAddModal}>×</button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label htmlFor="course_code">Course Code:</label>
                <input
                  type="text"
                  id="course_code"
                  name="course_code"
                  value={formData.course_code}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="course_name">Course Name:</label>
                <input
                  type="text"
                  id="course_name"
                  name="course_name"
                  value={formData.course_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="scholar_id">Scholar ID:</label>
                <input
                  type="text"
                  id="scholar_id"
                  name="scholar_id"
                  value={formData.scholar_id}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="scholar_name">Scholar Name:</label>
                <input
                  type="text"
                  id="scholar_name"
                  name="scholar_name"
                  value={formData.scholar_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={handleCloseAddModal}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Add Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && currentAssignment && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Assignment</h2>
              <button className="close-button" onClick={handleCloseEditModal}>×</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label htmlFor="edit_course_code">Course Code:</label>
                <input
                  type="text"
                  id="edit_course_code"
                  name="course_code"
                  value={formData.course_code}
                  onChange={handleChange}
                  disabled  // Cannot change the course code during edit
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit_course_name">Course Name:</label>
                <input
                  type="text"
                  id="edit_course_name"
                  name="course_name"
                  value={formData.course_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit_scholar_id">Scholar ID:</label>
                <input
                  type="text"
                  id="edit_scholar_id"
                  name="scholar_id"
                  value={formData.scholar_id}
                  onChange={handleChange}
                  disabled  // Cannot change the scholar ID during edit
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit_scholar_name">Scholar Name:</label>
                <input
                  type="text"
                  id="edit_scholar_name"
                  name="scholar_name"
                  value={formData.scholar_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={handleCloseEditModal}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Update Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentAssignment && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <div className="modal-header">
              <h2>Confirm Deletion</h2>
              <button className="close-button" onClick={handleCloseDeleteModal}>×</button>
            </div>
            <div className="delete-modal-content">
              <p>Are you sure you want to delete the following assignment?</p>
              <div className="delete-info">
                <p><strong>Course:</strong> {currentAssignment.course_code} - {currentAssignment.course_name}</p>
                <p><strong>Scholar:</strong> {currentAssignment.scholar_id} - {currentAssignment.scholar_name}</p>
              </div>
              <p className="delete-warning">This action cannot be undone.</p>
            </div>
            <div className="form-actions delete-actions">
              <button type="button" className="cancel-button" onClick={handleCloseDeleteModal}>
                Cancel
              </button>
              <button type="button" className="delete-button" onClick={handleDeleteSubmit}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeachingAssistants;
