import { useState, useEffect } from 'react';
import axios from 'axios';
import './Registration.css';
import uuid from "uuid";

function Registration() {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    birthdate: '',
    gender: '',
    streetAddress: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [debugInputs, setDebugInputs] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Validate required fields
    const requiredFields = [
      'firstName', 'lastName', 'birthdate', 'gender', 'streetAddress',
      'city', 'stateProvince', 'postalCode', 'email', 'mobileNumber',
      'password', 'confirmPassword'
    ];
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      setMessage('All fields are required');
      alert('Registration failed: All fields are required');
      return;
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setMessage('Invalid email format');
      alert('Registration failed: Invalid email format');
      return;
    }

    // Validate password: at least 2 special characters and 1 number
    const specialCharCount = (formData.password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length;
    const numberCount = (formData.password.match(/[0-9]/g) || []).length;
    if (specialCharCount < 2 || numberCount < 1) {
      setMessage('Password must contain at least 2 special characters and 1 number');
      alert('Registration failed: Password must contain at least 2 special characters and 1 number');
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      alert('Registration failed: Passwords do not match');
      return;
    }

    try {
      const payload = {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        birthdate: formData.birthdate,
        gender: formData.gender,
        streetAddress: formData.streetAddress,
        city: formData.city,
        stateProvince: formData.stateProvince,
        postalCode: formData.postalCode,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };
      const response = await axios.post('http://localhost:5000/add', payload);
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        birthdate: '',
        gender: '',
        streetAddress: '',
        city: '',
        stateProvince: '',
        postalCode: '',
        email: '',
        mobileNumber: '',
        password: '',
        confirmPassword: '',
      });
      setMessage('Registration successful');
      alert('Registration successful! Welcome to Collectius.');
      setDebugInputs(response.data);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed';
      if (error.response?.data?.code === 11000) {
        setMessage('Email already registered');
        alert('Registration failed: Email already registered');
      } else {
        setMessage(errorMsg);
        alert(`Registration failed: ${errorMsg}`);
      }
    }
  };

  return (
    <>
      <nav className="nav">
        <div className="sorter">
          <a>Collectius</a>
        </div>
      </nav>
      <form className="registrationform" onSubmit={handleSubmit}>
        <h4>Registration</h4>
        <div className="formcaption">
          <p>Enter your details to register.</p>
          <p>Profile Information</p>
        </div>
        <div className="formrow">
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
          <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} placeholder="Middle Name" />
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
        </div>
        <div className="formrow">
          <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} placeholder="Birth Date" />
          <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
            <option value="" disabled>Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <p>Address</p>
        <div className="formrow">
          <input type="text" name="streetAddress" value={formData.streetAddress} onChange={handleChange} className="addressbox" placeholder="Street Address" />
        </div>
        <div className="formrow">
          <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" />
          <input type="text" name="stateProvince" value={formData.stateProvince} onChange={handleChange} placeholder="State / Province" />
          <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Postal Code" />
        </div>
        <div className="formrow">
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
          <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="Phone Number" />
        </div>
        <div className="formrow">
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" />
        </div>
        <button type="submit" className="btn">Register</button>
        {message && <p style={{ color: message.includes('successful') ? 'green' : 'red', fontSize: '12px' }}>{message}</p>}
        {debugInputs && (
          <div style={{ background: "#f4f4f4", padding: "12px", borderRadius: "6px", marginTop: "12px" }}>
            <b>Debug: Submitted Inputs</b>
            <pre style={{ margin: 0, fontSize: "13px" }}>
              {JSON.stringify(debugInputs, null, 2)}
            </pre>
          </div>
        )}
      </form>
    </>
  );
}

export default Registration;