import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';  

function UserList() {
  const [users, setUsers] = useState([]);

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


  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        fetchUsers(); 
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div>
      <Link to="/add">
        <button>Create User</button>
      </Link>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Username</th>
            <th>Type</th>
            <th>Phone No</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.sNo}</td>
              <td>{user.username}</td>
              <td>{user.type}</td>
              <td>{user.phoneNo}</td>
              <td className="actions">
                <Link to={`/edit/${user._id}`} title="Edit">
                  <FaEdit className="action-icon edit-icon" />
                </Link>
                <button
                  onClick={() => deleteUser(user._id)}
                  className="action-button"
                  title="Delete"
                >
                  <FaTrash className="action-icon delete-icon" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;