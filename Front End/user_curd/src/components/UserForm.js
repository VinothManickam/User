import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import axios from 'axios';

function UserForm() {
  const [user, setUser] = useState({
    username: '',
    type: 'vendor',
    phoneNo: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users', user);
      navigate('/'); 
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div>
      <h2>Add User</h2>
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
        <button type="submit">Add User</button>
      </form>
      <Link to="/">Back to List</Link>
    </div>
  );
}

export default UserForm;