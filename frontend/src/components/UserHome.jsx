import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Placeholder from '../components/images/pfp_placeholder.png';
import './UserHome.css';

function UserHome() {

    const workingSchedule = [
    { label: 'Full Time', id: 'fulltime' },
    { label: 'Part Time', id: 'parttime' },
    { label: 'Internship / On-the-Job Training', id: 'internship' },
  ];
  const employmentType =[
    { label: 'Full Day', id: 'fullday' },
    { label: 'Rotational', id: 'rotational' },
    { label: 'Shift Work', id: 'shiftwork' },
    { label: 'Distance Work', id: 'distancework' },
  ];
  const workSetup =[
    { label: 'Work From Home', id: 'workfromhome' },
    { label: 'On - Site', id: 'onsite' },
    { label: 'Hybrid', id: 'hybrid' },
  ];

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
      <nav>
        <img src={profilePic || Placeholder} alt="Profile" /> 
        <span className="usergreeting">Welcome, {userName}!</span>
        <a href="#">Admin</a>
        <a href="#">Message</a>
        <a href="#">Report a Problem</a>
        <a href="#" onClick={handleFAQs}>FAQs</a>
        <a className="logout" onClick={handleLogout}>Logout</a>
      </nav>
      <div className='usercontainer'>
        <div className='userleftcomp'>
        <div className="userverticalfilter">
            <h2 style={{
              paddingBottom:"24px",
              paddingTop:"25px",
              fontSize:"24px"
              }}>Filters</h2>
              <h4 style={{fontSize:"14px",fontWeight:"600"}}>Working Schedule</h4>
            {workingSchedule.map(option => (
              <label className="custom-checkbox" key={option.id}>
                <input type="checkbox" id={option.id} />
                <span className="checkmark"></span>
                <p>{option.label}</p>
              </label>
            ))}
          </div>
          <div className="userverticalfilter">
            <h4 style={{fontSize:"14px",fontWeight:"600"}}>Employment Type</h4>
            {employmentType.map(option => (
              <label className="custom-checkbox" key={option.id}>
                <input type="checkbox" id={option.id} />
                <span className="checkmark"></span>
                <p>{option.label}</p>
              </label>
            ))}
          </div>
          <div className="userverticalfilter">
            <h4 style={{fontSize:"14px",fontWeight:"600"}}>Work Setup</h4>
            {workSetup.map(option => (
              <label className="custom-checkbox" key={option.id}>
                <input type="checkbox" id={option.id} />
                <span className="checkmark"></span>
                <p>{option.label}</p>
              </label>
            ))}
          </div>
        </div>
        <div className='userrightcomp'>
          <p>test</p>
        </div>
      </div>
    </>
  );
}

export default UserHome;