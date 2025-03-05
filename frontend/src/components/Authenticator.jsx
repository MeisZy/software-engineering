import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Authenticator.css';

function Authenticator() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  
  const sendOtp = async () => {
    try {
      await axios.post('http://localhost:5000/api/send-otp', { email });
      alert('OTP sent to your email');
      setStep(2);
    } catch (error) {
      alert('Error sending OTP');
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/verify-otp', { email, otp });
      if (response.data.success) {
        navigate('/forgot-password');
      } else {
        alert('Invalid OTP');
      }
    } catch (error) {
      alert('OTP verification failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>OTP Verification</h2>
      {step === 1 ? (
        <>
          <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button onClick={sendOtp}>Send OTP</button>
        </>
      ) : (
        <>
          <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}
    </div>
  );
}

export default Authenticator;
