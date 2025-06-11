import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
import axios from 'axios';

function HomePage() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('userName');
    if (storedUser) setUserName(storedUser);
  }, []);

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse?.credential);
      const name = decoded.given_name || decoded.name.split(' ')[0];
      const userEmail = decoded.email;
      const profilePic = decoded.picture;

      if (name && userEmail) {
        // Send to backend for authentication/registration
        const response = await axios.post('http://localhost:5000/google-login', {
          email: userEmail,
          firstName: name,
          picture: profilePic,
        });

        const { applicant } = response.data;
        setUserName(applicant.firstName);
        setError('');

        // Store user data in localStorage
        localStorage.setItem('userName', applicant.firstName);
        localStorage.setItem('userEmail', applicant.email);
        localStorage.setItem('profilePic', applicant.profilePic);

        // Redirect based on user
        if (decoded.name === 'Collectius HR Admin') {
          navigate('/adminhome');
        } else {
          navigate('/userhome');
        }
      } else {
        setError('Missing required user information from Google');
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError(err.response?.data?.message || 'Google login failed. Please try again.');
    }
  };

  const handleManualLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      if (response.status === 200) {
        const { applicant } = response.data;
        localStorage.setItem('userName', applicant.firstName);
        localStorage.setItem('userEmail', applicant.email);
        setError('');
        navigate('/userhome');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid credentials');
    }
  };

  const redirectForgotPassword = () => {
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
          <button className="register" onClick={() => navigate('/registration')}>
            Sign Up
          </button>
        </div>
        <div className="rightcomp">
          <form onSubmit={(e) => e.preventDefault()}>
            <p style={{ fontSize: '14px', textAlign: 'left', width: '100%' }}>Login</p>
            {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="googlecontainer">
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => setError('Google login failed')}
              />
            </div>
            <a className="forgotlink" onClick={redirectForgotPassword}>
              Forgot Password?
            </a>
            <button type="button" className="login" onClick={handleManualLogin}>
              <b>Login</b>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default HomePage;