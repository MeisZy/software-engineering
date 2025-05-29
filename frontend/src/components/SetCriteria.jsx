import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Placeholder from '../components/images/pfp_placeholder.png';

import './SetCriteria.css';

function SetCriteria() {
  const [userName, setUserName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [showAddJob, setShowAddJob] = useState(false); // NEW STATE
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

  const handleReturn = () => {
    navigate('/adminhome');
  }

  return (
    <>
      <nav style={{
        fontSize: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <img src={profilePic || Placeholder} alt="Profile" style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
          <a>Set Criteria</a>
        </div>
        <a onClick={handleReturn} style={{ cursor: "pointer" }}>Back</a>
      </nav>
      <div>
        <div className="criteria">
          <a onClick={() => setShowAddJob(true)}>Add Job</a>
          <a>Remove Job</a>
        </div>
        <div className='jobslists'>
          {/*insert mapping for jobs. until database is built. codeblock below is the proper format. add another*/}
          <div className='joblist'>
            <div className='jobtitle'>Job Title</div>
            <div className='jobdescription'>Job Description</div>
            <div className='jobrequirements'>Job Requirements</div>
            <div className='jobactions'>Actions</div>
          </div>
        </div>
      </div>
      {showAddJob && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.4)",
              zIndex: 3
            }}
            onClick={() => setShowAddJob(false)}
          />
          <div className='criteriascreen'>  
            <div className='criteriascreencontent'>
                <div className='page1'>
                  <div className="page1entry">
                    <label>Job Name</label>
                    <input type="text" placeholder="Job Name" />
                  </div>
                  <div className="page1entry">
                    <label>Job Description</label>
                    <input type="text" placeholder="Job Description" />
                  </div>
                  <div className="page1entry">
                    <label>Job Requirements</label>
                    <input type="text" placeholder="Job Requirements" />
                  </div>
                  <div className="page1entry">
                    <label>Other Info</label>
                    <input type="text" placeholder="Other Info" />
                  </div>
                </div>
            </div>
              <button onClick={() => setShowAddJob(false)} style={{marginTop: "24px"}}>Close</button>
          </div>
        </>
      )}
    </>
  );
}

export default SetCriteria;