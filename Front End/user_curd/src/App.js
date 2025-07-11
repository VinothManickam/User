import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import UserForm from './components/UserForm';

function App() {
  const [users, setUsers] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActions, setShowActions] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      fetchUsers();
      setShowActions(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEdit(true);
    setShowActions(null);
  };

  const handleSaveEdit = async (userData) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${userData._id}`, userData);
      setShowEdit(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>USER LIST</h2>
      <div className="d-flex justify-content-between mb-3">
        <input type="text" className="form-control w-25" placeholder="Search..." />
        <button className="btn btn-orange" onClick={() => setShowCreate(true)}>Create User</button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Username</th>
            <th>Type</th>
            <th>Phone NO</th>
            <th>Contact Person</th>
            <th>PAN NO</th>
            <th>GSTIN NO</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id || index}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.type}</td>
              <td>{user.phoneNo}</td>
              <td>{user.contactPerson}</td>
              <td>{user.panNo}</td>
              <td>{user.gstinNo}</td>
              <td>
                <div className="action-container">
                  <button
                    className="btn-orange-dot"
                    onClick={() => setShowActions(showActions === index ? null : index)}
                  >
                    &#x22EE;
                  </button>
                  {showActions === index && (
  <div className="action-panel">
    <button className="action-item" onClick={() => handleEdit(user)}>
      <i className="bi bi-pencil-square" style={{ color: '#ff4500' }}></i> Edit
    </button>
    <button className="action-item" onClick={() => handleDelete(user._id)}>
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

      <UserForm
        show={showCreate}
        handleClose={() => setShowCreate(false)}
        onSave={async (userData) => {
          try {
            await axios.post('http://localhost:5000/api/users', userData);
            setShowCreate(false);
            fetchUsers();
          } catch (error) {
            console.error('Error creating user:', error.response?.data?.message || error.message);
          }
        }}
        isEdit={false}
      />

      <UserForm
        show={showEdit}
        handleClose={() => setShowEdit(false)}
        onSave={handleSaveEdit}
        userData={selectedUser}
        isEdit={true}
      />
    </div>
  );
}

export default App;
