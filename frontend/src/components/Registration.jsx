import React from 'react'
import './Registration.css'

function Registration() {
  return (
    <>
    <nav className="nav">
        <div className="sorter">
          <a>Collectius</a>
        </div>
    </nav>
    <form className="registrationform">
    <h4>Registration</h4>
    <div className="formcaption">
        <p>Enter your details to register</p>
        <p>Profile Information</p>
    </div>
    <div className="formrow">
        <input type="text" placeholder="First Name" />
        <input type="text" placeholder="Middle Name" />
        <input type="text" placeholder="Last Name" />
    </div>
    <div className="formrow">
        <input type="text" placeholder="Birth Date" />
        <select id="gender" placeholder='gender'>
          
        </select>
    </div>
    <p>Address</p>
    <div className="formrow">
        <input type="text" placeholder="Street Address" />
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
  )
}

export default Registration