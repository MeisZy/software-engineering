import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Placeholder from '../components/images/pfp_placeholder.png';
import './UserHome.css';

function UserHome() {
  const workingSchedule = [
    { label: 'Full Time', id: 'fulltime' },
    { label: 'Part Time', id: 'parttime' },
    { label: 'Internship / On-the-Job Training', id: 'internship' },
  ];
  const employmentType = [
    { label: 'Full Day', id: 'fullday' },
    { label: 'Rotational', id: 'rotational' },
    { label: 'Shift Work', id: 'shiftwork' },
    { label: 'Distance Work', id: 'distancework' },
  ];
  const workSetup = [
    { label: 'Work From Home', id: 'workfromhome' },
    { label: 'On - Site', id: 'onsite' },
    { label: 'Hybrid', id: 'hybrid' },
  ];

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedWorkingSchedule, setSelectedWorkingSchedule] = useState([]);
  const [selectedEmploymentType, setSelectedEmploymentType] = useState([]);
  const [selectedWorkSetup, setSelectedWorkSetup] = useState([]);
  const [userName, setUserName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [openDetailIdx, setOpenDetailIdx] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/jobs');
        setJobs(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again.');
        setLoading(false);
      }
    };
    fetchJobs();

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
  };

  const handleCheckboxChange = (id, setState, state) => {
    if (state.includes(id)) {
      setState(state.filter(item => item !== id));
    } else {
      setState([...state, id]);
    }
  };

  const anyFilterSelected =
    selectedWorkingSchedule.length > 0 ||
    selectedEmploymentType.length > 0 ||
    selectedWorkSetup.length > 0;

  const filteredJobOpenings = jobs.filter(job => {
    if (!anyFilterSelected) return true;

    const ws = job.workSchedule.toLowerCase().replace(/[^a-z]/g, '');
    const et = job.employmentType.toLowerCase().replace(/[^a-z]/g, '');
    const wsup = job.workSetup.toLowerCase().replace(/[^a-z]/g, '');

    const wsMatch = selectedWorkingSchedule.some(id => ws.includes(id.replace(/[^a-z]/g, '')));
    const etMatch = selectedEmploymentType.some(id => et.includes(id.replace(/[^a-z]/g, '')));
    const wsupMatch = selectedWorkSetup.some(id => wsup.includes(id.replace(/[^a-z]/g, '')));

    if (selectedWorkingSchedule.length && !wsMatch) return false;
    if (selectedEmploymentType.length && !etMatch) return false;
    if (selectedWorkSetup.length && !wsupMatch) return false;

    return true;
  });

  return (
    <>
      <nav>
        <img src={profilePic || Placeholder} alt="Profile" />
        <span className="usergreeting">Welcome, {userName}!</span>
        <a href="#">Message</a>
        <a href="#" onClick={handleFAQs}>FAQs</a>
        <a className="logout" onClick={handleLogout}>Logout</a>
      </nav>
      <div className='usercontainer'>
        <div className='userleftcomp'>
          <div className="userverticalfilter">
            <h2 style={{
              paddingBottom: "24px",
              paddingTop: "25px",
              fontSize: "24px"
            }}>Filters</h2>
            <h4 style={{ fontSize: "14px", fontWeight: "600" }}>Working Schedule</h4>
            {workingSchedule.map(option => (
              <label className="custom-checkbox" key={option.id}>
                <input
                  type="checkbox"
                  id={option.id}
                  checked={selectedWorkingSchedule.includes(option.id)}
                  onChange={() => handleCheckboxChange(option.id, setSelectedWorkingSchedule, selectedWorkingSchedule)}
                />
                <span className="checkmark"></span>
                <p>{option.label}</p>
              </label>
            ))}
          </div>
          <div className="userverticalfilter">
            <h4 style={{ fontSize: "14px", fontWeight: "600" }}>Employment Type</h4>
            {employmentType.map(option => (
              <label className="custom-checkbox" key={option.id}>
                <input
                  type="checkbox"
                  id={option.id}
                  checked={selectedEmploymentType.includes(option.id)}
                  onChange={() => handleCheckboxChange(option.id, setSelectedEmploymentType, selectedEmploymentType)}
                />
                <span className="checkmark"></span>
                <p>{option.label}</p>
              </label>
            ))}
          </div>
          <div className="userverticalfilter">
            <h4 style={{ fontSize: "14px", fontWeight: "600" }}>Work Setup</h4>
            {workSetup.map(option => (
              <label className="custom-checkbox" key={option.id}>
                <input
                  type="checkbox"
                  id={option.id}
                  checked={selectedWorkSetup.includes(option.id)}
                  onChange={() => handleCheckboxChange(option.id, setSelectedWorkSetup, selectedWorkSetup)}
                />
                <span className="checkmark"></span>
                <p>{option.label}</p>
              </label>
            ))}
          </div>
        </div>
        <div className='userrightcomp'>
          {error && <div style={{ color: 'red', padding: '16px' }}>{error}</div>}
          {loading ? (
            <div style={{ padding: '32px', color: '#888' }}>Loading jobs...</div>
          ) : (
            <div className='jobscontainer'>
              {filteredJobOpenings.length === 0 ? (
                <p style={{ padding: "32px", color: "#888" }}>No job openings match your filters.</p>
              ) : (
                filteredJobOpenings.map((job, idx) => (
                  <div className='jobscardwrapper' key={job._id}>
                    <div className="jobcard">
                      <h2>{job.title}</h2>
                      <div className='tags'>
                        <a>{job.workSchedule}</a>
                        <a>{job.employmentType}</a>
                        <a>{job.workSetup}</a>
                      </div>
                      <div className='joboption'>
                        <a
                          href="#"
                          onClick={e => {
                            e.preventDefault();
                            setOpenDetailIdx(idx);
                          }}
                        >
                          Details
                        </a>
                      </div>
                    </div>
                    {openDetailIdx === idx && (
                      <div className="userjobdetails" onClick={() => setOpenDetailIdx(null)}>
                        <div className="userjobdetailsblock" onClick={e => e.stopPropagation()}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h3 style={{ marginBottom: 0 }}>
                              {job.title}
                            </h3>
                            <a
                              style={{
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                color: 'white',
                                textDecoration: 'none',
                                cursor: 'pointer',
                                marginLeft: '24px',
                                lineHeight: '1',
                              }}
                              onClick={() => setOpenDetailIdx(null)}
                              aria-label="Close"
                            >
                              ×
                            </a>
                          </div>
                          <div className="userjobdetailsgrid" style={{ marginTop: "16px" }}>
                            <p><b>Department:</b> {job.department}</p>
                            <p><b>Work Schedule:</b> {job.workSchedule}</p>
                            <p><b>Work Setup:</b> {job.workSetup}</p>
                            <p><b>Employment Type:</b> {job.employmentType}</p>
                            <p><b>Description:</b> {job.description.join(', ')}</p>
                            <p><b>Key Responsibilities:</b></p>
                            <ul>
                              {job.keyResponsibilities.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                            <p><b>Qualifications:</b></p>
                            <ul>
                              {job.qualifications.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                            <p><b>What we Offer:</b></p>
                            <ul>
                              {job.whatWeOffer.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                            <button className='userjobdetailexit' onClick={() => setOpenDetailIdx(null)}>
                              Close
                            </button>
                            <button className='userjobdetailapply' onClick={() => setOpenDetailIdx(null)}>
                              Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default UserHome;