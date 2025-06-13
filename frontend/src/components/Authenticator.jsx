import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Authenticator.css';

function Authenticator() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('resetEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      navigate('/forgot-password');
    }
  }, [navigate]);

  const sendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/forgot-password', { email });
      setMessage('OTP sent to your email');
      setIsLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending OTP');
      setIsLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/verify-otp', { email, otp });
      localStorage.setItem('resetToken', response.data.resetToken);
      setMessage('OTP verified successfully');
      setTimeout(() => navigate('/newpass'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
      setIsLoading(false);
    }
  };

  const redirectHomePage = () => {
    localStorage.removeItem('resetEmail');
    navigate('/');
  };

  return (
    <>
      <nav>
        <h1>Collectius</h1>
      </nav>
      <div className='proper'>
        <div className='container' style={{ borderRadius: '0', border: 'none' }}>
          <p className="forgottext">Verify OTP</p>
          <div className='fpassproper'>
            {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
            {message && <p style={{ color: 'green', fontSize: '12px' }}>{message}</p>}
            <p>Enter your Email Address</p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <a onClick={sendOtp} disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send OTP'}
            </a>
            <p>Enter OTP</p>
            <input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={isLoading}
            />
            <a onClick={verifyOtp} disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </a>
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

export default Authenticator;