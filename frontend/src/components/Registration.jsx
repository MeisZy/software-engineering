import React, { useState } from 'react';
import './Registration.css';
import axios from 'axios';

function Registration() {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    birthdate: '',
    gender: '',
    city: '',
    stateProvince: '',
    email: '',
    mobileNumber: '',
    positionAppliedFor: '',
    skills: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/register', formData);
      setMessage(response.data.message);
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        birthdate: '',
        gender: '',
        city: '',
        stateProvince: '',
        email: '',
        mobileNumber: '',
        positionAppliedFor: '',
        skills: ''
      });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed');
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
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="middleName"
            placeholder="Middle Name"
            value={formData.middleName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formrow">
          <input
            type="date"
            name="birthdate"
            placeholder="Birth Date"
            value={formData.birthdate}
            onChange={handleChange}
            required
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <p>Address</p>
        <div className="formrow">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="stateProvince"
            placeholder="State / Province"
            value={formData.stateProvince}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formrow">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="mobileNumber"
            placeholder="Phone Number"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formrow">
          <input
            type="text"
            name="positionAppliedFor"
            placeholder="Position Applied For"
            value={formData.positionAppliedFor}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="skills"
            placeholder="Skills (comma-separated)"
            value={formData.skills}
            onChange={handleChange}
          />
        </div>
        {message && <p>{message}</p>}
        <button type="submit" className="btn">Register</button>
      </form>
    </>
  );
}

export default Registration;