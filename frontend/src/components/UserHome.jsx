import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Placeholder from '../components/images/pfp_placeholder.png';
import './UserHome.css';

function UserHome() {
  const [userName, setUserName] = useState('');
  const [profilePic, setProfilePic] = useState(''); 
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('userName');
    const storedPic = localStorage.getItem('profilePic'); 
    if (storedUser) {
      setUserName(storedUser);
      setProfilePic(storedPic); 
    } else {
      navigate('/'); 
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('profilePic'); 
    navigate('/');
  };

  const handleFAQs = () => {
    navigate('/questions');
  }

  return (
    <>
      <nav className="nav">
        <img src={profilePic || Placeholder} alt="Profile" /> 
        <span className="usergreeting">Welcome, {userName}!</span>
        <a href="#">Admin</a>
        <a href="#">Message</a>
        <a href="#">Report a Problem</a>
        <a href="#" onClick={handleFAQs}>FAQs</a>
        <a className="logout" onClick={handleLogout}>Logout</a>
      </nav>
      <div className='proper'>
        <div className='container'>
          <h4>Human Resources</h4>
          <div className='joblength'>Part-time</div>
          <p className='jobdescription'>
            We are seeking a creative and talented Graphic Designer to join our dynamic team...
          </p>
          <div className='moreinfo'>
            <div className='infobutton'>
              <a href="#">Details</a>
            </div>
          </div>
        </div>

        <div className='container'>
          <h4>Recruiter</h4>
          <div className='joblength'>Full-time</div>
          <p className='jobdescription'>
            We are seeking a creative and talented Graphic Designer to join our dynamic team...
          </p>
          <div className='moreinfo'>
            <div className='infobutton'>
              <a href="#">Details</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserHome;