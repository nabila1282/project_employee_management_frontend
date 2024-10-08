import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SignUp.css';

export default function SignUp() {
  const [lastAssignedEmployeeId, setLastAssignedEmployeeId] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    phoneNumber: '',
    password: '', 
    department: '',
    address: '',
  });

  const [isValid, setIsValid] = useState(true); // Initially set to true
  const [loading, setLoading] = useState(false);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [users, setusers] = useState([1])
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/v1/departments/get-all-departments')
      .then((response) => {
        const data = response.data;
        const departments = data.data.map((department) => department.name);
        setDepartmentOptions(departments);
      })
      .catch((error) => {
        console.error('Error fetching departments:', error);
      });
  }, []);
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/v1/users/get-all-users')
      .then((response) => {
        const data = response.data;
        const users = data?.data;
        if (users && users.length > 0) {
          const lastEmployeeId = Number(users[users.length - 1].employeeId); // Convert to number
          setLastAssignedEmployeeId(lastEmployeeId);
        } else {
          setLastAssignedEmployeeId(0); // Set to 0 if there are no users
        }
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;

    let valid = true;

    if (name === 'phoneNumber') {

      if (!/^\d+$/.test(value)) {
        valid = false;
      }
    }

    setIsValid(valid); // Update isValid based on the validation result

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!isValid) {
  //     alert('Please provide a valid number.');
  //     return;
  //   }

  //   try {
  //     const dataWithEmployeeId = {
  //       ...formData,
  //       employeeId: lastAssignedEmployeeId + 1
  //       // employeeId: lastAssignedEmployeeId
  //     };

  //     const response = await axios.post(
  //       'http://localhost:5000/api/v1/users/create-user',
  //       dataWithEmployeeId
  //     );

  //     if (response.status === 200) {
  //       alert('Account created! Wait for admin approval.');
  //       setLastAssignedEmployeeId((prevEmployeeId) => prevEmployeeId + 1); // Update employeeId
  //       // const z = (users[0] + 1);
  //       // console.log('z',z);
        
  //       // setLastAssignedEmployeeId(z);
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     if (error.response && error.response.data) {
  //       const errorMessage = error.response.data.message;
  //       alert(`Error creating account: ${errorMessage}`);
  //     } else if (error.message) {
  //       alert(`Error creating account: ${error.message}`);
  //     } else {
  //       alert('Error creating account');
  //     }
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid) {
      alert('Please provide a valid number.');
      return;
    }

    try {
      const dataWithEmployeeId = {
        ...formData,
        employeeId: lastAssignedEmployeeId + 1
      };

      const response = await axios.post(
        'http://localhost:5000/api/v1/users/create-user',
        dataWithEmployeeId
      );

      if (response.status === 200) {
        alert('Account created! Wait for admin approval.');

        // Update lastAssignedEmployeeId based on the newly created user's employeeId
        const newEmployeeId = Number(response.data.data.employeeId); // Convert to number
        setLastAssignedEmployeeId(newEmployeeId);
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;
        alert(`Error creating account: ${errorMessage}`);
      } else if (error.message) {
        alert(`Error creating account: ${error.message}`);
      } else {
        alert('Error creating account');
      }
    }
  };

  console.log('lastAssignedEmployeeId', lastAssignedEmployeeId);

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-field">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
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
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Department:</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            {departmentOptions.map((department, index) => (
              <option key={index} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-field">
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            pattern="[0-9]*"
            required
          />
          {!isValid && <span className="error-message">Please provide a valid number.</span>}
        </div>
       
        {/* <div className="form-field">
          <label>Employee ID:</label>
          <input
            type="text"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            pattern="[0-9]*"
            
          />
           {!isValid && <span className="error-message">Please provide a valid number.</span>} 
        </div> */}
        <button className="submit-button" type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}
