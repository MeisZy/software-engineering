import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Placeholder from '../components/images/pfp_placeholder.png';
import './UserHome.css';

function UserHome() {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('userName');
    if (storedUser) {
      setUserName(storedUser);
    } else {
      navigate('/'); 
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userName');
    navigate('/');
  };

  return (
    <>
      <nav className="nav">
        <img src={Placeholder} alt="Profile" />
        <span>Welcome, {userName}!</span>
        <a href="#">Admin</a>
        <a href="#">Message</a>
        <a href="#">Community</a>
        <a href="#">FAQs</a>
        <button className="logout" onClick={handleLogout}>Logout</button>
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

