import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';
import { useUser } from '../../lib/UserContext';


export default function Login() {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false); //spinner

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  useEffect(() => {
    // Fetch user data from the API using Axios when the component mounts
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/v1/users/get-all-users'
        );
        setUsersData(response.data.data);
        // Save user data to localStorage after successful login
        localStorage.setItem('user', JSON.stringify({ email: userEmail }));
      } catch (error) {
        console.error('Error fetching data from the API:', error);
      }
    };

    fetchUserData(); // Call the function to fetch user data when the component mounts
  }, [usersData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    // Check if the entered email and employee ID match the condition
    if (email === 'boss@gmail.com' && password === '1234') {
      setUser({ email: 'boss@gmail.com' });
      localStorage.setItem('user', JSON.stringify({ email: 'boss@gmail.com' }));
      navigate('/admindashboard');
    } else {
      setError('Account not authorized. Please check your credentials.');
    }
    

    // Check if the entered email and employee ID match any user data from the API
    const matchingUser = usersData.find(
      (user) =>
        user.email === email &&
        user.password === password &&
        user.isApproved === true
    );

    if (matchingUser) {
      const userEmail = matchingUser.email; // Get the email from matching user
      setUser({ email: userEmail })
      localStorage.setItem('user', JSON.stringify({ email: userEmail }));
      navigate(`/employeedashboard`);
    } else {
      setError('Account not found or not approved. Please check your credentials.');
    }
    
  };
  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-field">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label>password:</label>
          <input
            type="text"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className="submit-button" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}
