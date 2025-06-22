import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Placeholder from '../components/images/pfp_placeholder.png';
import Notification from './images/notification.png';
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
  const [userEmail, setUserEmail] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [openDetailIdx, setOpenDetailIdx] = useState(null);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportSubject, setReportSubject] = useState('');
  const [reportMessage, setReportMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();

  const suggestions = jobs
    .filter(job => job.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 5);

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

    const storedEmail = localStorage.getItem('userEmail');
    const storedPic = localStorage.getItem('profilePic');
    if (storedEmail) {
      setUserEmail(storedEmail);
      setProfilePic(storedPic || '');
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/logout', {
        email: userEmail,
        fullName: localStorage.getItem('userName') || '',
        firstName: '',
        middleName: '',
      });
    } catch (err) {
      console.error('Error logging logout:', err);
    } finally {
      localStorage.removeItem('userName');
      localStorage.removeItem('profilePic');
      localStorage.removeItem('userEmail');
      navigate('/');
    }
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

  const handleApply = async (jobTitle) => {
    try {
      const response = await axios.post('http://localhost:5000/apply', {
        email: userEmail,
        jobTitle,
      });
      setApplicationMessage(response.data.message);
      setTimeout(() => setApplicationMessage(''), 3000);
      setOpenDetailIdx(null);
    } catch (error) {
      console.error('Error applying for job:', error);
      setApplicationMessage(error.response?.data?.message || 'Failed to apply. Please try again.');
      setTimeout(() => setApplicationMessage(''), 3000);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportSubject || !reportMessage) {
      setApplicationMessage('Please fill in both subject and message.');
      setTimeout(() => setApplicationMessage(''), 3000);
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/report-problem', {
        sender: userEmail,
        subject: reportSubject,
        body: reportMessage,
      });
      setApplicationMessage(response.data.message);
      setShowReportForm(false);
      setReportSubject('');
      setReportMessage('');
    } catch (error) {
      console.error('Error submitting report:', error);
      setApplicationMessage(error.response?.data?.message || 'Failed to submit report. Please try again.');
    } finally {
      setTimeout(() => setApplicationMessage(''), 3000);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
    setHighlightedIndex(-1);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[highlightedIndex]);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 100);
  };

  const handleProfile = () => {
    navigate('/profile');
  }


  const anyFilterSelected =
    selectedWorkingSchedule.length > 0 ||
    selectedEmploymentType.length > 0 ||
    selectedWorkSetup.length > 0;

  const filteredJobOpenings = jobs.filter(job => {
    const ws = job.workSchedule.toLowerCase().replace(/[^a-z]/g, '');
    const et = job.employmentType.toLowerCase().replace(/[^a-z]/g, '');
    const wsup = job.workSetup.toLowerCase().replace(/[^a-z]/g, '');
    const title = job.title.toLowerCase();

    if (searchQuery && !title.includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (!anyFilterSelected) return true;

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
  <nav className="user-nav">
      <div className="user-nav-left">
        <img src={profilePic || Placeholder} alt="Profile" />
        <span className="usergreeting">Welcome, {userEmail}!</span>
        <a href="#" onClick={(e) => { e.preventDefault(); setShowReportForm(true); }}>Report a Problem</a>
        <a href="#" onClick={handleFAQs}>FAQs</a>
        <a href="#" onClick={handleProfile}>Settings</a>
        <a className="logout" onClick={handleLogout}>Logout</a>
      </div>
      <div className="user-nav-right">
        <a href="#" className="notification-link">
          <img src={Notification} alt="Notifications" className="notification-icon" />
        </a>
      </div>
  </nav>
      <div className='usercontainer'>
        <div className='userleftcomp'>
          <div className='usersearch'>
            <input 
              type="text" 
              placeholder="Search jobs..." 
              name="search"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="suggestionsdropdown" ref={suggestionsRef}>
                {suggestions.map((job, index) => (
                  <li
                    key={job._id}
                    className={`suggestion-item${index === highlightedIndex ? ' highlighted' : ''}`}
                    onClick={() => handleSuggestionClick(job.title)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <span>{job.title}</span>
                    <div className="suggestiontags">
                      <span>{job.workSchedule} - </span>
                      <span>{job.employmentType} - </span>
                      <span>{job.workSetup}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
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
          {applicationMessage && (
            <div style={{ color: applicationMessage.includes('successfully') ? 'green' : 'red', padding: '16px' }}>
              {applicationMessage}
            </div>
          )}
          {loading ? (
            <div style={{ padding: '32px', color: '#888' }}>Loading jobs...</div>
          ) : (
            <div className='jobscontainer'>
              {filteredJobOpenings.length === 0 ? (
                <p style={{ padding: "32px", color: "#888" }}>No job openings match your search or filters.</p>
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
                            <button
                              className='userjobdetailexit'
                              onClick={() => setOpenDetailIdx(null)}
                              style={{
                                marginTop: "24px",
                                background: "white",
                                color: "#13714C",
                                border: "none",
                                borderRadius: "6px",
                                padding: "8px 24px",
                                fontWeight: 600,
                                cursor: "pointer",
                                marginRight: "8px"
                              }}
                            >
                              Close
                            </button>
                            <button
                              className='userjobdetailapply'
                              onClick={() => handleApply(job.title)}
                              style={{
                                marginTop: "24px",
                                background: "#A2E494",
                                color: "#13714C",
                                border: "none",
                                borderRadius: "6px",
                                padding: "8px 24px",
                                fontWeight: 600,
                                cursor: "pointer"
                              }}
                            >
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
      {showReportForm && (
        <div
          className="reportsdetailsdarkgreen"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div className="reportsdetailslightgreen" style={{ width: '588px', height: '388px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <h3 style={{ padding: '16px 24px', margin: 0 }}>Report a Problem</h3>
              <a
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: 'black',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  marginRight: '24px',
                }}
                onClick={() => setShowReportForm(false)}
                aria-label="Close"
              >
                ×
              </a>
            </div>
            <form className="reportsdetailsgrid" onSubmit={handleReportSubmit} style={{ padding: '0 24px' }}>
              <label>Subject</label>
              <input
                type="text"
                value={reportSubject}
                onChange={(e) => setReportSubject(e.target.value)}
                placeholder="Enter subject"
              />
              <label>Message</label>
              <textarea
                value={reportMessage}
                onChange={(e) => setReportMessage(e.target.value)}
                placeholder="Describe the problem"
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button
                  type="button"
                  className="userjobdetailexit"
                  onClick={() => setShowReportForm(false)}
                  style={{
                    marginRight: '8px',
                  }}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="userjobdetailapply"
                  style={{
                    background: '#A2E494',
                    color: '#13714C',
                  }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default UserHome;