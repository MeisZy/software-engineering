import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Logo from './images/logo.png';
import Notification from './images/notification.png';
import Details from './assets/jobdetailsimg.png';
import './AdminHome.css';

function AdminHome() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDetailIdx, setOpenDetailIdx] = useState(null);
  const [openApplicantsIdx, setOpenApplicantsIdx] = useState(null);
  const [openApplicantDetailIdx, setOpenApplicantDetailIdx] = useState(null);
  const [selectedWorkingSchedule, setSelectedWorkingSchedule] = useState([]);
  const [selectedEmploymentType, setSelectedEmploymentType] = useState([]);
  const [selectedWorkSetup, setSelectedWorkSetup] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsError, setNotificationsError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState('');
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [messageStatus, setMessageStatus] = useState('');
  const suggestionsRef = useRef(null);
  const [showUserLogs, setShowUserLogs] = useState(false);
  const [userLogs, setUserLogs] = useState([]);
  const [logsError, setLogsError] = useState('');

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

  const suggestions = [
    ...jobs.map(job => ({
      type: 'job',
      value: job.title,
      id: job._id,
      workSchedule: job.workSchedule,
      employmentType: job.employmentType,
      workSetup: job.workSetup,
    })),
    ...applicants.flatMap(applicant =>
      applicant.positionAppliedFor
        .filter(jobTitle => jobs.some(job => job.title.toLowerCase() === jobTitle.toLowerCase()))
        .map(jobTitle => ({
          type: 'applicant',
          value: `${applicant.fullName} (Applied for ${jobTitle})`,
          id: applicant._id,
          email: applicant.email,
          jobTitle,
        }))
    ),
  ]
    .filter(suggestion => suggestion.value.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsResponse, applicantsResponse] = await Promise.all([
          axios.get('http://localhost:5000/jobs'),
          axios.get('http://localhost:5000/applicants'),
        ]);
        setJobs(jobsResponse.data);
        setApplicants(applicantsResponse.data);
        // Generate notifications from applicants' job applications
        const applicationNotifications = applicantsResponse.data.flatMap(applicant =>
          applicant.positionAppliedFor.map(jobTitle => ({
            _id: `${applicant._id}-${jobTitle}`,
            message: `${applicant.fullName} has applied for the ${jobTitle}.`,
            createdAt: applicant.createdAt || new Date(),
            isRead: false,
            email: applicant.email,
          }))
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNotifications(applicationNotifications);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification._id === notificationId ? { ...notification, isRead: true } : notification
      )
    );
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (!messageRecipient || !messageSubject || !messageBody) {
      setMessageStatus('Please fill in all fields.');
      setTimeout(() => setMessageStatus(''), 3000);
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/send-message', {
        sender: 'admin@collectius.com',
        recipient: messageRecipient,
        subject: messageSubject,
        body: messageBody,
      });
      setMessageStatus(response.data.message || 'Message sent successfully');
      setShowMessageForm(false);
      setMessageRecipient('');
      setMessageSubject('');
      setMessageBody('');
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
      setMessageStatus(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setTimeout(() => setMessageStatus(''), 3000);
    }
  };

const handleDeleteApplicant = async (applicantId) => {
  try {
    await axios.delete(`http://localhost:5000/applicants/${applicantId}`);
    setApplicants(prevApplicants => prevApplicants.filter(applicant => applicant._id !== applicantId));
  } catch (error) {
    console.error('Error deleting applicant:', error);
    setError('Failed to delete applicant. Please try again.');
    setTimeout(() => setError(''), 3000);
  }
};

  const handleLogout = () => navigate('/');
  const handleSetCriteria = () => navigate('/setcriteria');
  const handleFAQs = () => navigate('/questions');
  const handleMaintainance = () => navigate('/adminmaintainance');

  const handleCheckboxChange = (id, setState, state) => {
    if (state.includes(id)) {
      setState(state.filter(item => item !== id));
    } else {
      setState([...state, id]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
    setHighlightedIndex(-1);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.value);
    setShowSuggestions(false);
    setHighlightedIndex(-1);

    try {
      if (suggestion.type === 'job') {
        const jobIndex = jobs.findIndex(job => job._id === suggestion.id);
        if (jobIndex === -1) {
          console.error(`Job not found for ID: ${suggestion.id}, Title: ${suggestion.value}`);
          setError('Selected job not found.');
          setTimeout(() => setError(''), 3000);
          return;
        }
        setOpenDetailIdx(jobIndex);
      } else if (suggestion.type === 'applicant') {
        const jobIndex = jobs.findIndex(job => job.title.toLowerCase() === suggestion.jobTitle.toLowerCase());
        const applicantIndex = applicants.findIndex(applicant => applicant._id === suggestion.id);

        if (jobIndex === -1) {
          console.error(`Job not found for Title: ${suggestion.jobTitle}`);
          setError('Job associated with applicant not found.');
          setTimeout(() => setError(''), 3000);
          return;
        }
        if (applicantIndex === -1) {
          console.error(`Applicant not found for ID: ${suggestion.id}, Email: ${suggestion.email}`);
          setError('Selected applicant not found.');
          setTimeout(() => setError(''), 3000);
          return;
        }

        setOpenApplicantsIdx(jobIndex);
        setOpenApplicantDetailIdx(applicantIndex);
      }
    } catch (err) {
      console.error('Error handling suggestion click:', err);
      setError('An error occurred while processing your selection.');
      setTimeout(() => setError(''), 3000);
    }
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

    const fetchUserLogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/userlogs');
      setUserLogs(response.data);
      setLogsError('');
    } catch (err) {
      console.error('Error fetching user logs:', err);
      setLogsError('Failed to load user logs. Please try again.');
    }
  };

  const handleShowUserLogs = () => {
    setShowUserLogs(true);
    fetchUserLogs();
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 100);
  };

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
      <nav className="admin-nav">
        <div className="admin-nav-left">
          <a href="/" className="logo-link">
            <img src={Logo} alt="Logo" className="logo" />
          </a>
          <a href="javascript:void(0);">Admin</a>
        </div>
        <div className="admin-nav-center">
          <a onClick={handleMaintainance}>Settings</a>
          <a onClick={handleFAQs}>FAQs</a>
          <a onClick={handleSetCriteria}>Manage Jobs</a>
          <a onClick={() => setShowMessageForm(true)}>Send Message</a>
          <a onClick={handleShowUserLogs}>User Logs</a>
        </div>
    <div className="admin-nav-right">
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <img
        src={Notification}
        alt="Notifications"
        className="notification-icon"
        style={{ cursor: 'pointer' }}
        onClick={() => setShowNotifications(!showNotifications)}
      />
      {/* Notification counter removed */}
    </div>
    <a className="logout" onClick={handleLogout}>Logout</a>
  </div>
</nav>
      <div className='components'>
        <div className='adminleftcomp'>
          <div className='adminsearch'>
            <input 
              type="text" 
              placeholder="Search jobs or applicants..." 
              name="search"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="suggestionsdropdown" ref={suggestionsRef}>
                {suggestions.map((suggestion, index) => (
                  <li
                    key={`${suggestion.type}-${suggestion.id}`}
                    className={`suggestion-item ${index === highlightedIndex ? 'highlighted' : ''} ${suggestion.type}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <div>
                      <span>{suggestion.value}</span>
                      {suggestion.type === 'job' && (
                        <div className="suggestiontags">
                          <span>{suggestion.workSchedule} - </span>
                          <span>{suggestion.employmentType} - </span>
                          <span>{suggestion.workSetup}</span>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="verticalfilter">
            <h2 style={{ paddingBottom: "24px", paddingTop: "25px", fontSize: "24px" }}>Filters</h2>
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
          <div className="verticalfilter">
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
          <div className="verticalfilter">
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
        <div className='adminrightcomp'>
          {error && <div style={{ color: 'red', padding: '16px' }}>{error}</div>}
          {messageStatus && (
            <div style={{ color: messageStatus.includes('successfully') ? 'green' : 'red', padding: '16px' }}>
              {messageStatus}
            </div>
          )}
{loading ? (
  <div style={{ padding: '32px', color: '#888' }}>Loading data...</div>
) : (
  <div className='jobscontainer'>
    {filteredJobOpenings.length === 0 ? (
      <div style={{ padding: '32px', color: '#888' }}>No jobs match your search or filters.</div>
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
              <a href="#" onClick={e => { e.preventDefault(); setOpenApplicantsIdx(idx); }}>
                View Applicants
              </a>
              <a href="#" onClick={e => { e.preventDefault(); setOpenDetailIdx(idx); }}>
                Details
              </a>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
)}

          {showNotifications && (
            <div
              className="notifications-container"
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'white',
                padding: '24px',
                borderRadius: '8px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '80vh',
                overflowY: 'auto',
                zIndex: 10,
              }}
              onClick={() => setShowNotifications(false)}
            >
              <div
                className="notifications-content"
                style={{ padding: '16px' }}
                onClick={e => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2>Notifications</h2>
                  <button
                    onClick={() => setShowNotifications(false)}
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      border: 'none',
                      background: 'none',
                    }}
                  >
                    ×
                  </button>
                </div>
                {notificationsError && <div style={{ color: 'red', marginBottom: '16px' }}>{notificationsError}</div>}
                {notifications.length === 0 ? (
                  <div style={{ padding: '16px', color: '#888' }}>No notifications available.</div>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {notifications.map(notification => (
                      <li
                        key={notification._id}
                        style={{
                          padding: '8px',
                          borderBottom: '1px solid #ddd',
                          background: notification.isRead ? '#f4f4f4' : '#fff',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <p style={{ margin: 0, fontWeight: notification.isRead ? 'normal' : 'bold' }}>
                            {notification.message}
                          </p>
                          <span style={{ fontSize: '12px', color: '#888' }}>
                            {new Date(notification.createdAt).toLocaleString('en-US', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            style={{
                              background: '#A2E494',
                              color: '#13714C',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              cursor: 'pointer',
                            }}
                          >
                            Mark as Read
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
          
          {showUserLogs && (
            <div
              className="userlogs-container"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.4)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10,
              }}
              onClick={() => setShowUserLogs(false)}
            >
              <div className="userlogs-container">
                <div className="userlogs-content" onClick={e => e.stopPropagation()}>
                  <div className="userLogsHeader">
                    <h3>User Logs</h3>
                    <button
                      className="close-button"
                      onClick={() => setShowUserLogs(false)}
                      style={{
                        fontSize: '30px',
                        marginRight: '19px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        border: 'none',
                        background: 'none',
                      }}
                    >
                      ×
                    </button>
                  </div>
                  {logsError && <div style={{ color: 'red', marginBottom: '16px' }}>{logsError}</div>}
                  {userLogs.length === 0 ? (
                    <div style={{ padding: '16px', color: '#888' }}>No user logs available.</div>
                  ) : (
                    <div className="table-container">
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Full Name</th>
                            <th>Activity</th>
                          </tr>
                        </thead>
                      </table>
                      <div className="tbody-container">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <tbody>
                            {userLogs.map(log => (
                              <tr key={log._id}>
                                <td>
                                  {new Date(log.date).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                  })}
                                </td>
                                <td>{log.fullName}</td>
                                <td>{log.activity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}


          {openApplicantsIdx !== null && (
            <div className="applicantslistcontainer" onClick={() => setOpenApplicantsIdx(null)}>
              <div
                className="jobdetailsblock"
                onClick={e => e.stopPropagation()}
                style={{
                  backgroundImage: `url(${Details})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gridColumn: '1 / span 2' }}>
                  <h3 style={{ marginBottom: 0 }}>
                    {filteredJobOpenings[openApplicantsIdx]?.title || 'Job Title'}
                  </h3>
                  <button
                    className='jobdetailsapply'
                    onClick={() => setOpenApplicantsIdx(null)}
                    aria-label="Close"
                    style={{ fontSize: '2rem', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    ×
                  </button>
                </div>
                <div className="applicantsgrid">
                  <div className='applicantinstance'>
                    <ul>
{applicants
  .filter(applicant => applicant.positionAppliedFor.includes(filteredJobOpenings[openApplicantsIdx]?.title))
  .map((applicant, idx) => (
    <li key={applicant._id} style={{ marginBottom: "16px", listStyle: "none" }}>
      <b>{applicant.fullName}</b>
      <a className="viewdetails" onClick={() => setOpenApplicantDetailIdx(idx)}>
        View Details
      </a>
      <button onClick={() => handleDeleteApplicant(applicant._id)} style={{ marginLeft: '8px' }}>
        Delete
      </button>
      {openApplicantDetailIdx === idx && (
        <div className='applicantdetailwrap'>
          <span>Email: {applicant.email}</span>
          <span>Mobile: {applicant.mobileNumber}</span>
          <span>Jobs Applied For: {applicant.positionAppliedFor.join(', ')}</span>
          <span>Birthdate: {new Date(applicant.birthdate).toISOString().split('T')[0]}</span>
          <span>Gender: {applicant.gender}</span>
          <span>City: {applicant.city}</span>
          <span>State/Province: {applicant.stateProvince}</span>
          <span>Status: {applicant.status}</span>
          <span>Stage: {applicant.applicationStage}</span>
          <span>Skills: {applicant.resume.join(', ')}</span>
          <button
            style={{ marginTop: "8px", fontSize: "12px", width: "100px" }}
            onClick={() => setOpenApplicantDetailIdx(null)}
            type="button"
          >
            Close
          </button>
        </div>
      )}
    </li>
))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          {openDetailIdx !== null && (
  <div className="jobdetails" onClick={() => setOpenDetailIdx(null)}>
    <div className="jobdetailsdarkgreen">
      <div className="jobdetailslightgreen"></div>
    </div>
    <div
      className="jobdetailsblock"
      onClick={e => e.stopPropagation()}
      style={{
        backgroundImage: `url(${Details})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gridColumn: '1 / span 2' }}>
        <h3 style={{ marginBottom: 0 }}>
          {filteredJobOpenings[openDetailIdx]?.title || 'Job Title'}
        </h3>
        <a className='jobdetailsapply' onClick={() => setOpenDetailIdx(null)} aria-label="Close">
          ×
        </a>
      </div>
      <div className="jobdetailsgrid">
        <div>
          <p><b>Department:</b> {filteredJobOpenings[openDetailIdx]?.department || 'N/A'}</p>
          <p><b>Work Schedule:</b> {filteredJobOpenings[openDetailIdx]?.workSchedule}</p>
          <p><b>Work Setup:</b> {filteredJobOpenings[openDetailIdx]?.workSetup}</p>
          <p><b>Employment Type:</b> {filteredJobOpenings[openDetailIdx]?.employmentType}</p>
          <p><b>Description:</b> {filteredJobOpenings[openDetailIdx]?.description.join(', ')}</p>
          <p><b>Key Responsibilities:</b></p>
          <ul>
            {filteredJobOpenings[openDetailIdx]?.keyResponsibilities.map((item, i) => (
              <li key={i}>{item}</li>
            )) || <li>N/A</li>}
          </ul>
        </div>
        <div>
          <p><b>Qualifications:</b></p>
          <ul>
            {filteredJobOpenings[openDetailIdx]?.qualifications.map((item, i) => (
              <li key={i}>{item}</li>
            )) || <li>N/A</li>}
          </ul>
          <p><b>What we Offer:</b></p>
          <ul>
            {filteredJobOpenings[openDetailIdx]?.whatWeOffer.map((item, i) => (
              <li key={i}>{item}</li>
            )) || <li>N/A</li>}
          </ul>
          <p><b>Threshold:</b> {filteredJobOpenings[openDetailIdx]?.threshold || 'N/A'}</p>
          <p><b>Keywords:</b> {filteredJobOpenings[openDetailIdx]?.keywords.join(', ') || 'N/A'}</p>
          <p><b>Graded Qualifications:</b></p>
          <ul>
            {filteredJobOpenings[openDetailIdx]?.gradedQualifications.map((qual, index) => (
              <li key={index}>{qual.attribute}: {qual.points}</li>
            )) || <li>N/A</li>}
          </ul>
          <button
            onClick={() => setOpenDetailIdx(null)}
            style={{ marginTop: "32px" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}
          {showMessageForm && (
            <div
              className="messagedetailsdarkgreen"
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '600px',
                height: '401px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div className="messagedetailslightgreen" style={{ width: '588px', height: '388px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <h3 style={{ padding: '16px 24px', margin: 0 }}>Send Email</h3>
                  <a
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: 'black',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      marginRight: '24px',
                    }}
                    onClick={() => setShowMessageForm(false)}
                    aria-label="Close"
                  >
                    ×
                  </a>
                </div>
                <form className="messagedetailsgrid" onSubmit={handleMessageSubmit} style={{ padding: '0 24px' }}>
                  <label htmlFor="recipient">Recipient:</label>
                  <input
                    type="email"
                    id="recipient"
                    value={messageRecipient}
                    onChange={(e) => setMessageRecipient(e.target.value)}
                    placeholder="Enter recipient email"
                    required
                  />
                  <label htmlFor="subject">Subject:</label>
                  <input
                    type="text"
                    id="subject"
                    value={messageSubject}
                    onChange={(e) => setMessageSubject(e.target.value)}
                    placeholder="Enter subject"
                    required
                  />
                  <label htmlFor="body">Message:</label>
                  <textarea
                    id="body"
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    placeholder="Enter your message"
                    required
                    style={{ height: '100px', resize: 'vertical' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                    <button
                      type="button"
                      className="userjobdetailsbutton"
                      onClick={() => setShowMessageForm(false)}
                      style={{
                        marginRight: '8px',
                        background: 'white',
                        color: '#13714C',
                        border: '1px solid #13714C',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="userjobdetailsbutton"
                      style={{
                        background: '#A2E494',
                        color: '#13714C',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminHome; 