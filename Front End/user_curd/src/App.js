import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import CreateUserForm from './components/CreateUserForm';

function AppContent({ users, onEdit, onDelete }) {
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(null);

  return (
    <div className="container mt-4">
      <h2>USER LIST</h2>
      <div className="d-flex justify-content-between mb-3">
        <input type="text" className="form-control w-25" placeholder="Search..." />
        <button className="btn btn-orange" onClick={() => navigate('/create')}>
          Create User
        </button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>S.No</th>
            <th>User Name</th>
            <th>Type</th>
            <th>Phone No</th>
            <th>Contact Person</th>
            <th>GSTIN No</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id || index}>
              <td>{user.sNo}</td>
              <td className="d-flex align-items-center">
                <img
                  src={`http://localhost:5000/Uploads/${user.logo}`}
                  alt="logo"
                  style={{
                    width: '30px',
                    height: '30px',
                    objectFit: 'contain',
                    marginRight: '8px',
                    borderRadius: '4px',
                  }}
                  onError={(e) => { e.target.src = '/placeholder.png'; }} 
                />
                {user.companyName}
              </td>
              <td>{user.type}</td>
              <td>{user.phoneNo}</td>
              <td>{user.proprietorName}</td>
              <td>{user.gstinNo}</td>
              <td>
                <div className="action-container">
                  <button
                    className="btn-orange-dot"
                    onClick={() => setShowActions(showActions === index ? null : index)}
                  >
                    ⋮
                  </button>
                  {showActions === index && (
                    <div className="action-panel">
                      <button className="action-item" onClick={() => onEdit(user)}>
                        <i className="bi bi-pencil-square" style={{ color: '#ff4500' }}></i> Edit
                      </button>
                      <button className="action-item" onClick={() => onDelete(user._id)}>
                        <i className="bi bi-trash3" style={{ color: '#ff4500' }}></i> Delete
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function App() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error.response?.data || error);
      alert('Failed to fetch users. Please try again.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error.response?.data || error);
      alert('Failed to delete user. Please try again.');
    }
  };

  const handleEdit = (user) => {
    navigate('/create', { state: { user, isEdit: true } });
  };

  const handleCreateUser = async (userData, isEdit = false) => {
    try {
      const formData = new FormData();
      console.log('User Data being sent:', userData);

      Object.keys(userData).forEach((key) => {
        if (key === 'kycDetails') {
          const kycDetails = userData.kycDetails.map(({ documentFile, documentFileUrl, ...rest }) => rest);
          formData.append(key, JSON.stringify(kycDetails));
        } else if (key === 'bankDetails') {
          formData.append(key, JSON.stringify(userData[key]));
        } else if (userData[key] instanceof File) {
          formData.append(key, userData[key]);
        } else if (key !== 'logoUrl' && key !== 'documentFileUrl' && key !== '_id') {
          formData.append(key, userData[key] || '');
        }
      });

      userData.kycDetails.forEach((item, index) => {
        if (item.documentFile instanceof File) {
          formData.append(`kycDetails[${index}]`, item.documentFile);
        }
      });

      for (let pair of formData.entries()) {
        console.log('FormData key-value:', pair[0], pair[1]);
      }

      const url = isEdit && userData._id
        ? `http://localhost:5000/api/users/${userData._id}`
        : 'http://localhost:5000/api/users';
      const method = isEdit ? 'put' : 'post';

      const response = await axios({
        method,
        url,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Response from server:', response.data);
      await fetchUsers();
      navigate('/');
    } catch (error) {
      console.error('Error saving user:', error.response?.data || error);
      alert(`Error: ${error.response?.data?.message || 'Failed to save user. Please try again.'}`);
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<AppContent users={users} onEdit={handleEdit} onDelete={handleDelete} />}
      />
      <Route
        path="/create"
        element={
          <CreateUserForm
            onSave={handleCreateUser}
            onCancel={() => navigate('/')}
          />
        }
      />
    </Routes>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
