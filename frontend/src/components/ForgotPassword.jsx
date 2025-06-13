import React, { useState } from 'react';
import './ForgotPassword.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import IconLock from '../components/images/fpass_lock.png';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const redirectHomePage = () => {
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Email is required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/forgot-password', { email });
      setMessage(response.data.message);
      localStorage.setItem('resetEmail', email); // Store email for Authenticator
      setTimeout(() => navigate('/authenticator'), 2000); // Redirect after 2 seconds
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    }
  };

  return (
    <>
      <nav>
        <h1>Collectius</h1>
      </nav>
      <div className='proper'>
        <div className='container' style={{ borderRadius: '0', border: 'none' }}>
          <p className="forgottext">Forgot Password</p>
          <div className='fpassproper'>
            <img src={IconLock} alt="Lock Icon" />
            <p>Enter your Email Address</p>
            {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
            {message && <p style={{ color: 'green', fontSize: '12px' }}>{message}</p>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <a onClick={handleSubmit}>Send</a>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%',
              marginTop: '20px'
            }}>
              <li onClick={redirectHomePage} style={{
                listStyle: 'none',
                fontSize: '20px',
                cursor: 'pointer'
              }}>
                <u>Back to Login</u>
              </li>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;