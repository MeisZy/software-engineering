import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Authenticator.css';
import './ForgotPassword.css'

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

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    if (!otp || !/^\d{6}$/.test(otp)) {
      setError('Please enter a valid 6-digit OTP');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/verify-otp', { email, otp });
      localStorage.setItem('resetToken', response.data.resetToken);
      alert("OTP sent successfully");
      setTimeout(() => navigate('/newpass'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
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
        <div className='container'>
          <div className='formcontainer'>
          <p className="forgottext">Verify OTP</p>
            {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
            {message && <p style={{ color: 'green', fontSize: '12px' }}>{message}</p>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                disabled={isLoading}
              />
            <button onClick={verifyOtp} disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <div style={{listStyle:"none",fontSize:"20px"}}>
              <li onClick={redirectHomePage}>
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