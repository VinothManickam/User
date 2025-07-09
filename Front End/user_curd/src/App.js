import { Routes, Route } from 'react-router-dom';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import UserEdit from './components/UserEdit';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>User Management</h1>
      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="/add" element={<UserForm />} />
        <Route path="/edit/:id" element={<UserEdit />} />
      </Routes>
    </div>
  );
}

export default App;