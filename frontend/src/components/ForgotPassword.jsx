import React, { useState } from 'react';
import './ForgotPassword.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import IconLock from '../components/images/fpass_lock.png';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const redirectHomePage = () => {
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Valid email is required');
      setIsLoading(false);
      return;
    }

    try {
      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Send the OTP to the backend
      const response = await axios.post('http://localhost:5000/forgot-password', { email, otp });
      setMessage(response.data.message);
      localStorage.setItem('resetEmail', email);
      setTimeout(() => navigate('/authenticator'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
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
              disabled={isLoading}
            />
            <button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send'}
            </button>
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