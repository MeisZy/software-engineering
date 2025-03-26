import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';

function HomePage() {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('userName');
    if (storedUser) setUserName(storedUser);
  }, []);

  const handleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse?.credential);
    const name = decoded.given_name || decoded.name.split(' ')[0];
    const profilePic = decoded.picture; // Assuming the picture URL is in `decoded.picture`

    setUserName(name);
    localStorage.setItem('userName', name);
    localStorage.setItem('profilePic', profilePic); // Store profile picture URL
    console.log('Login Success:', decoded);

    navigate('/userhome');
  };

  const handleForgotPassword = () => {
    navigate('/forgotpassword');
  };

  return (
    <>
      <nav className="nav">
        <div className="sorter">
          <h1>Collectius</h1>
        </div>
      </nav>
      <div className="components">
        <div className="leftcomp">
        <p style={{ fontSize: '60px', fontWeight: '300' }}>New Here?</p>
          <p>Sign up and discover a great amount of new opportunities!</p>
          <button className='register' onClick={() => navigate('/registration')}>
            Sign Up
          </button>
        </div>
        <div className='rightcomp'>
          <form>
            <p style={{ fontSize: '14px', textAlign: 'left', width: '100%' }}>Login</p>
            <input type="text" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <div className='googlecontainer'>
              <GoogleLogin onSuccess={handleLoginSuccess} onError={() => console.log('Login Failed')} />
            </div>
            <a className='forgotlink' onClick={handleForgotPassword}>Forgot Password?</a>
            <button type="button" className="login"><b>Login</b></button>
          </form>
        </div>
      </div>
    </>
  );
}

export default HomePage;