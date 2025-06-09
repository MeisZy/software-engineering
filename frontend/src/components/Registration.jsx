import { useState, useEffect } from 'react';
import axios from 'axios';
import './Registration.css';

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
  });
  const [message, setMessage] = useState('');
  const [debugInputs, setDebugInputs] = useState(null);
  const [mongoStatus, setMongoStatus] = useState('Checking...');

  // Check MongoDB server status on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await axios.get('http://localhost:5000/status');
        setMongoStatus(res.data.status === 'ok' ? '🟢 Server is Online' : '🔴 MongoDB Disconnected');
      } catch {
        setMongoStatus('🔴 MongoDB Disconnected');
      }
    };

    checkStatus();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDebugInputs({ ...formData }); // Print all inputs for debugging
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
      };
      await axios.post('http://localhost:5000/add', payload);
      setMessage('Registration successful!');
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
        <div style={{ marginLeft: "auto", fontWeight: 600, fontSize: "1rem" }}>
          {mongoStatus}
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
    </>
  );
}

export default Registration;