//contains : Login submodule  

import './HomePage.css'
import { Link } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'; 
import { useState } from 'react'; 

function HomePage() {
  const [userName, setUserName] = useState('');

  return (
    <>
      <nav className="nav">
        <div className="sorter">
          <h1>Collectius</h1>
        </div>
      </nav>
      <div className="components">
        <div className='leftcomp'>
          <p><h3 style={{fontSize: "60px",fontWeight:"300"}}>New Here?</h3>
          Sign up and discover a great amount of new opportunities!</p>
          <button className='register'>Sign Up</button>
        </div>
        <div className='rightcomp'>
          <form>
            <p style={{
              fontSize: "14px",
              textAlign: "left",
              width: "100%"     
            }}>Login</p>
            <input type="text" placeholder="Email"></input>
            <input type="password" placeholder="Password"></input>
            <div className='googlecontainer'>
              <GoogleLogin  
                onSuccess={(credentialResponse) => {
                  const decoded = jwtDecode(credentialResponse?.credential);

                  setUserName(decoded.given_name || decoded.name.split(' ')[0]);
                  console.log('Login Success:', decoded);
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
              />
              {userName && <p>Welcome, {userName}!</p>}
            </div>   
            <a href="{sample link}" className='forgotlink'> 
              Forgot Password?
            </a>
            <button className="login"><b>Login</b></button>
          </form>
        </div>
      </div>
    </> 
  )
}

export default HomePage;
