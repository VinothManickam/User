import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

function UserEdit() {
  const [user, setUser] = useState({
    username: '',
    type: 'vendor',
    phoneNo: '',
  });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${id}`);
        setUser({
          username: response.data.username,
          type: response.data.type,
          phoneNo: response.data.phoneNo,
        });
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/users/${id}`, user);
      navigate('/'); 
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div>
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={user.username}
          onChange={handleChange}
          required
        />
        <select name="type" value={user.type} onChange={handleChange}>
          <option value="vendor">Vendor</option>
          <option value="customer">Customer</option>
        </select>
        <input
          type="text"
          name="phoneNo"
          placeholder="Phone Number"
          value={user.phoneNo}
          onChange={handleChange}
          required
        />
        <button type="submit">Update User</button>
      </form>
      <Link to="/">Back to List</Link>
    </div>
  );
}

export default UserEdit;