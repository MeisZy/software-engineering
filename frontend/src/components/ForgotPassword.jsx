import React from 'react';
import './ForgotPassword.css';
import { useNavigate } from 'react-router-dom';
import IconLock from '../components/images/fpass_lock.png'; 

function ForgotPassword() {
  return (
    <>
      <nav>
        <h1>Collectius</h1>
      </nav>
      <div className='container'>
        <img src={IconLock} alt="Lock Icon" /> 
        <div className='fpassproper'>
          <p>Enter your Email Address</p>
          <input type="text" placeholder="Email" />
          <a>Send</a>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;