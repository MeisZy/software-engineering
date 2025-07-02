import React, { useState } from 'react';
import axios from 'axios';
import './AdminAddAccount.css';
import { useNavigate } from 'react-router-dom';

function AdminAddAccount() {
  const navigate = useNavigate();

  const handleHomePage = () => {
    navigate('/');
  };

  const handleAdminMaintainance = () => {
    navigate('/adminmaintainance');
  };

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
      await axios.post('http://localhost:5000/add', payload);
      setDebugInputs(payload);
      setMessage('Registration successful');
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
    } catch (error) {
      setDebugInputs(payload);
      setMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <>
      <nav>
        <a onClick={handleHomePage}>Collectius</a>
      </nav>
      <div className='maintainanceleftcomp'>
        <li onClick={handleAdminMaintainance}>Back</li>
      </div>
      <div className='maintainancerightcomp'>
        <form className="addregistrationform" onSubmit={handleSubmit}>
          <h4 style={{ color: "black" }}>Add User Account</h4>
          <div className="formcaption">
            <p>Add an Applicant's Detail</p>
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
          {message && <p>{message}</p>}
          {debugInputs && (
            <div style={{ background: "#f4f4f4", padding: "12px", borderRadius: "6px", marginTop: "12px" }}>
              <b>Debug: Submitted Inputs</b>
              <pre style={{ margin: 0, fontSize: "13px" }}>
                {JSON.stringify(debugInputs, null, 2)}
              </pre>
            </div>
          )}
        </form>
      </div>
    </>
  );
}

export default AdminAddAccount;