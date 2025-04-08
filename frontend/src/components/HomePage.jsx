import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';

function HomePage() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('userName');
    if (storedUser) setUserName(storedUser);
  }, []);

  const handleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse?.credential);
    const name = decoded.given_name || decoded.name.split(' ')[0];
    setUserName(name);
    localStorage.setItem('userName', name);
    console.log('Login Success:', decoded);
    navigate('/userhome');
  };

  const redirectForgotPassword = () => {
    navigate('/forgotpassword');
  };

  const handleCC = () => {
    navigate('/createclient');
  };
  
  const handleLogin = () => {
    // Implement login logic here
    console.log("Logging in with", email, password);
  };

  return (
    <>
      <nav className="nav">
        <div className="sorter">
          <h1>Collectius</h1>
        </div>
        <a onClick={handleCC}>CreateClient</a>
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
          <form onSubmit={(e) => e.preventDefault()}>
            <p style={{ fontSize: '14px', textAlign: 'left', width: '100%' }}>Login</p>
            <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className='googlecontainer'>
              <GoogleLogin onSuccess={handleLoginSuccess} onError={() => console.log('Login Failed')} />
            </div>
            <a className='forgotlink' onClick={redirectForgotPassword}>Forgot Password?</a>
            <button type="button" className="login" onClick={handleLogin}><b>Login</b></button>
          </form>
        </div>
      </div>
    </>
  );
}

export default HomePage;