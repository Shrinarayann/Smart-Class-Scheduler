import React, { useState } from 'react';
import './TA.css';

function TeachingAssistants() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentTA, setCurrentTA] = useState(null);
  const [formData, setFormData] = useState({
    scholar_id: '',
    name: '',
    courses: '',
    supervisor_id: ''
  });
  
  // Mock data for teaching assistants
  const [teachingAssistants, setTeachingAssistants] = useState([
    {
      scholar_id: "RS001",
      name: "Alex Johnson",
      courses: ["Introduction to Programming", "Data Structures"],
      supervisor_id: "PROF101"
    },
    {
      scholar_id: "RS002",
      name: "Maya Patel",
      courses: ["Database Systems", "Web Development"],
      supervisor_id: "PROF102"
    },
    {
      scholar_id: "RS003",
      name: "David Chen",
      courses: ["Algorithms", "Discrete Mathematics"],
      supervisor_id: "PROF103"
    },
    {
      scholar_id: "RS004",
      name: "Sarah Williams",
      courses: ["Machine Learning", "Artificial Intelligence"],
      supervisor_id: "PROF104"
    }
  ]);

  // Add Modal Functions
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    resetFormData();
  };

  // Edit Modal Functions
  const handleOpenEditModal = (ta) => {
    setCurrentTA(ta);
    setFormData({
      scholar_id: ta.scholar_id,
      name: ta.name,
      courses: ta.courses.join(', '),
      supervisor_id: ta.supervisor_id
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentTA(null);
    resetFormData();
  };

  // Delete Modal Functions
  const handleOpenDeleteModal = (ta) => {
    setCurrentTA(ta);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentTA(null);
  };

  const resetFormData = () => {
    setFormData({
      scholar_id: '',
      name: '',
      courses: '',
      supervisor_id: ''
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
    
    // Process courses as an array
    const newTA = {
      ...formData,
      courses: formData.courses.split(',').map(course => course.trim())
    };
    
    // Add the new teaching assistant to the list
    setTeachingAssistants([...teachingAssistants, newTA]);
    
    // Close the modal
    handleCloseAddModal();
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    // Process courses as an array
    const updatedTA = {
      ...formData,
      courses: formData.courses.split(',').map(course => course.trim())
    };
    
    // Update the teaching assistant in the list
    const updatedTAs = teachingAssistants.map(ta => 
      ta.scholar_id === currentTA.scholar_id ? updatedTA : ta
    );
    
    setTeachingAssistants(updatedTAs);
    handleCloseEditModal();
  };

  const handleDeleteSubmit = () => {
    // Filter out the teaching assistant to delete
    const updatedTAs = teachingAssistants.filter(
      ta => ta.scholar_id !== currentTA.scholar_id
    );
    
    setTeachingAssistants(updatedTAs);
    handleCloseDeleteModal();
  };

  return (
    <div className="teaching-assistants-container">
      <div className="header">
        <h1>Teaching Assistants</h1>
        <button className="add-button" onClick={handleOpenAddModal}>
          Add Research Scholar
        </button>
      </div>

      <div className="ta-table-container">
        <table className="ta-table">
          <thead>
            <tr>
              <th>Scholar ID</th>
              <th>Name</th>
              <th>Courses</th>
              <th>Supervisor ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachingAssistants.map((ta) => (
              <tr key={ta.scholar_id}>
                <td>{ta.scholar_id}</td>
                <td>{ta.name}</td>
                <td>
                  <ul className="courses-list">
                    {ta.courses.map((course, index) => (
                      <li key={index}>{course}</li>
                    ))}
                  </ul>
                </td>
                <td>{ta.supervisor_id}</td>
                <td>
                  <button 
                    className="action-button edit" 
                    onClick={() => handleOpenEditModal(ta)}
                  >
                    Edit
                  </button>
                  <button 
                    className="action-button delete" 
                    onClick={() => handleOpenDeleteModal(ta)}
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
              <h2>Add Research Scholar</h2>
              <button className="close-button" onClick={handleCloseAddModal}>×</button>
            </div>
            <form onSubmit={handleAddSubmit}>
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
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="courses">Courses (comma-separated):</label>
                <input
                  type="text"
                  id="courses"
                  name="courses"
                  value={formData.courses}
                  onChange={handleChange}
                  placeholder="e.g., Data Structures, Algorithms"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="supervisor_id">Supervisor ID:</label>
                <input
                  type="text"
                  id="supervisor_id"
                  name="supervisor_id"
                  value={formData.supervisor_id}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={handleCloseAddModal}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Add Teaching Assistant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && currentTA && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Research Scholar</h2>
              <button className="close-button" onClick={handleCloseEditModal}>×</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label htmlFor="edit_scholar_id">Scholar ID:</label>
                <input
                  type="text"
                  id="edit_scholar_id"
                  name="scholar_id"
                  value={formData.scholar_id}
                  onChange={handleChange}
                  disabled  // Cannot change the scholar ID
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit_name">Name:</label>
                <input
                  type="text"
                  id="edit_name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit_courses">Courses (comma-separated):</label>
                <input
                  type="text"
                  id="edit_courses"
                  name="courses"
                  value={formData.courses}
                  onChange={handleChange}
                  placeholder="e.g., Data Structures, Algorithms"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit_supervisor_id">Supervisor ID:</label>
                <input
                  type="text"
                  id="edit_supervisor_id"
                  name="supervisor_id"
                  value={formData.supervisor_id}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={handleCloseEditModal}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Update Teaching Assistant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentTA && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <div className="modal-header">
              <h2>Confirm Deletion</h2>
              <button className="close-button" onClick={handleCloseDeleteModal}>×</button>
            </div>
            <div className="delete-modal-content">
              <p>Are you sure you want to delete the following research scholar?</p>
              <div className="delete-info">
                <p><strong>Scholar ID:</strong> {currentTA.scholar_id}</p>
                <p><strong>Name:</strong> {currentTA.name}</p>
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