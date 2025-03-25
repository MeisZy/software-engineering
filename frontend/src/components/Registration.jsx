import React from 'react';
import './Registration.css';

function Registration() {
  return (
    <>
      <nav className="nav">
          <h1>Collectius</h1>
      </nav>
      <form className="registrationform">
        <h4>Registration</h4>
        <div className="formcaption">
          <p>Enter your details to register.</p>
          <p>Profile Information</p>
        </div>
        <div className="formrow">
          <input type="text" placeholder="First Name" />
          <input type="text" placeholder="Middle Name" />
          <input type="text" placeholder="Last Name" />
        </div>
        <div className="formrow">
          <input type="date" placeholder="Birth Date" />
            <select id="gender">
              <option value="" disabled selected /> 
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          <div className="select-wrapper">
          </div>
        </div>
        <p>Address</p>
        <div className="formrow">
          <input type="text" placeholder="Street Address" className="addressbox" />
        </div>
        <div className="formrow">
          <input type="text" placeholder="City" />
          <input type="text" placeholder="State / Province" />
          <input type="text" placeholder="Postal Code" />
        </div>
        <div className="formrow">
          <input type="email" placeholder="Email" />
          <input type="text" placeholder="Phone Number" />
        </div>
        <div className="formrow">
          <input type="password" placeholder="Password" />
          <input type="password" placeholder="Confirm Password" />
        </div>
        <button type="submit" className="btn">Register</button>
      </form>
    </>
  );
}

export default Registration;
