import React from 'react';
import './ForgotPassword.css';
import { useNavigate } from 'react-router-dom';
import IconLock from '../components/images/fpass_lock.png'; 

function ForgotPassword() {
  const navigate = useNavigate();
  
  const redirectHomePage = () => {
    navigate('/');
  }
  const redirectAuthenticator = () => {
    navigate('/');
  }

  return (
    <>
      <nav>
        <h1>Collectius</h1>
      </nav>
      <div className='proper'>
        <div className='container' style={{borderRadius:"0",border:"none"}}>
          <p className="forgottext">Forgot Password</p> 
          <div className='fpassproper'>
            <img src={IconLock} alt="Lock Icon" /> 
            <p>Enter your Email Address</p>
            <input type="text" placeholder="Email" />
            <a>Send</a>
            <div style={{
              display: "flex",
              justifyContent:"flex-end",
              width:"100%",
              marginTop: "20px"
            }}>
              <li onClick={redirectHomePage} style={{
                listStyle: "none",
                fontSize: "20px",
                cursor: "pointer"
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