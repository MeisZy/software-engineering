import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Placeholder from '../components/images/pfp_placeholder.png';
import SubmitArrow from '../components/assets/submitarrow.png';
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
  const [showReport, setShowReport] = useState(false); // Add this state
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

    const handleReportProblem = (e) => {
    e.preventDefault();
    setShowReport(true);
  };

  const closeReport = () => setShowReport(false);

  return (
    <>
      <nav>
        <img src={profilePic || Placeholder} alt="Profile" /> 
        <span className="usergreeting">Welcome, {userName}!</span>
        <a href="#">Message</a>
        <a href="#" onClick={handleReportProblem}>Report a Problem</a>
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
                {showReport && (
                  <div className='reportsdetailsdarkgreen'>
                    <div className='reportsdetailslightgreen'>
                        <div>
                          <h3 style={{ marginBottom: 0 }}>Report a Problem</h3>
                        </div>
                          <a onClick={closeReport} aria-label="Close"> ×</a>
                      <div className="reportsdetails" onClick={closeReport}>
                        <div className="reportsdetailsblock" onClick={e => e.stopPropagation()} style={{   background: 'white',   backgroundImage: 'none',   backgroundSize: 'cover',   backgroundPosition: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          </div>
                          <div className="reportsdetailsgrid">
                              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <label htmlFor="reportfrom" style={{ marginBottom: 0 }}>From:</label>
                                <input id="reportfrom" type="text" placeholder="Your email or name" style={{ marginBottom: 0 }} />
                              </div>
                              <label htmlFor="reporttext">Describe your issue:</label>
                              <textarea id="reporttext" placeholder="Please describe the problem you encountered..." />
                              <a
                                href="#"
                                onClick={closeReport}
                                className="submitarrow"
                                style={{
                                  width: "120px",
                                  position: "absolute",
                                  right: 0,
                                  bottom: 0,
                                  margin: "32px 0 0 0",
                                  alignSelf: "flex-end",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: "8px"
                                }}
                              >
                                <img src={SubmitArrow} alt="Submit" style={{ width: "80px", height: "40px" }} />
                              </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
      </div>
    </>
  );
}

export default UserHome;