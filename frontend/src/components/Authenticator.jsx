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
    <>
      <nav>
        <h1>Collectius</h1>
      </nav>
      <div className='proper'>
        <div className='container' style={{borderRadius:"0",border:"none"}}>
          <p className="forgottext">Verify OTP</p> 
          <div className='fpassproper'>
            <p>Enter OTP</p>
            <input type="text" placeholder="Email" />
            <a onClick={verifyOtp}>Send</a>
            <div style={{
              display: "flex",
              justifyContent:"flex-end",
              width:"100%",
              marginTop: "20px"
            }}>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Authenticator;
