import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Logo from './images/logo.png';
import Notification from './images/notification.png';
import Details from './assets/jobdetailsimg.png';
import './AdminHome.css';

function AdminHome() {
  const navigate = useNavigate();
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [interviewError, setInterviewError] = useState('');
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
  const [seeInterviews, setseeInterviews] = useState(false);
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeInterviewTab, setActiveInterviewTab] = useState('Interviews');
  const [interviewApplicants, setInterviewApplicants] = useState([]);
  const [showApplicantDropdown, setShowApplicantDropdown] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewVenue, setInterviewVenue] = useState('');
  const [interviewType, setInterviewType] = useState('');
  const [interviewEmail, setInterviewEmail] = useState('');
  const [interviewList, setInterviewList] = useState([]);
  const [selectedApplicantJobs, setSelectedApplicantJobs] = useState([]);
  const [selectedJobTitle, setSelectedJobTitle] = useState('');

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
      (applicant.positionAppliedFor || [])
        .filter(pos => jobs.some(job => job.title.toLowerCase() === pos.jobTitle.toLowerCase()))
        .map(pos => ({
          type: 'applicant',
          value: `${applicant.fullName} (Applied for ${pos.jobTitle})`,
          id: applicant._id,
          email: applicant.email,
          jobTitle: pos.jobTitle,
          status: pos.status,
        }))
    ),
  ].filter(suggestion => suggestion.value.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsResponse, applicantsResponse, adminNotificationsResponse] = await Promise.all([
          axios.get('http://localhost:5000/jobs'),
          axios.get('http://localhost:5000/applicants'),
          axios.get('http://localhost:5000/adminnotifications'),
        ]);
        setJobs(jobsResponse.data);
        setApplicants(applicantsResponse.data);
        setAdminNotifications(
          adminNotificationsResponse.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (seeInterviews) {
      fetch('http://localhost:5000/interviews')
        .then(res => res.json())
        .then(data => setInterviewList(data))
        .catch(() => setInterviewList([]));
    }
  }, [seeInterviews]);

  const handleAssignInterview = async () => {
    if (!interviewEmail || !interviewDate || !interviewType || !selectedJobTitle) {
      setInterviewError('All fields are required, including a job title. Please ensure the selected applicant has applied for a job.');
      return;
    }
    if (selectedApplicantJobs.length === 0) {
      setInterviewError('The selected applicant has no applied jobs. Please select a different applicant.');
      return;
    }
    setInterviewLoading(true);
    setInterviewError('');
    try {
      const res = await fetch('http://localhost:5000/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: interviewEmail,
          date: interviewDate,
          type: interviewType,
          jobTitle: selectedJobTitle
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to assign interview');
      setInterviewList(prev => [
        ...prev,
        {
          email: interviewEmail,
          date: interviewDate,
          type: interviewType,
          jobTitle: selectedJobTitle,
          notified: false
        }
      ]);
      setInterviewEmail('');
      setInterviewDate('');
      setInterviewType('');
      setSelectedJobTitle('');
      setInterviewError('');
    } catch (err) {
      setInterviewError(err.message);
    }
    setInterviewLoading(false);
  };

  const handleDeleteInterview = async (interviewId) => {
    try {
      const res = await fetch(`http://localhost:5000/interviews/${interviewId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete interview');
      setInterviewList(prev => prev.filter(iv => iv._id !== interviewId));
      setInterviewError('');
    } catch (err) {
      setInterviewError(err.message || 'Failed to delete interview');
    }
  };

  const handleApplicantChange = (e) => {
    const applicantId = e.target.value;
    setSelectedApplicant(applicantId);

    const applicantObj = applicants.find(app => app._id === applicantId);
    if (applicantObj) {
      setInterviewEmail(applicantObj.email);
      const jobs = (applicantObj.positionAppliedFor || []).map(pos => pos.jobTitle);
      setSelectedApplicantJobs(jobs);
    } else {
      setInterviewEmail('');
      setSelectedApplicantJobs([]);
    }
  };

  const handleAddApplicantToInterview = () => {
    if (!selectedApplicant) return;
    const applicantObj = applicants.find(app => app._id === selectedApplicant);
    if (!applicantObj) return;
    if (interviewApplicants.some(a => a.applicantId === applicantObj._id)) return;
    setInterviewApplicants(prev => [
      ...prev,
      {
        applicantId: applicantObj._id,
        name: applicantObj.fullName,
        status: applicantObj.status,
        score: applicantObj.scores ? Object.values(applicantObj.scores)[0] : '-',
        evaluation: '',
      }
    ]);
    setSelectedApplicant('');
    setShowApplicantDropdown(false);
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification._id === notificationId ? { ...notification, isRead: true } : notification
      )
    );
  };

  useEffect(() => {
    const fetchAdminNotifications = async () => {
      try {
        const res = await axios.get('http://localhost:5000/adminnotifications');
        setAdminNotifications(res.data);
      } catch (err) {
        setNotificationsError('Failed to fetch notifications');
      }
    };
    fetchAdminNotifications();
  }, []);

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

  const handleMarkAdminNotificationAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/adminnotifications/${id}/read`);
      setAdminNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error('Error marking admin notification as read:', err);
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
          <a onClick={() => setseeInterviews(true)}>Interviews</a>
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
            {adminNotifications.filter(n => !n.isRead).length > 0 && (
              <span className="notification-count" style={{ position: 'absolute', top: '-8px', right: '-8px' }}>
                {adminNotifications.filter(n => !n.isRead).length}
              </span>
            )}
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
            <h2 style={{ paddingBottom: "24px", paddingTop: "25px", fontSize: "24px", color:"black" }}>Filters</h2>
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
              onClick={() => setShowNotifications(false)}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                width: '800px',
                height: '468px',
                zIndex: 10,
                backgroundColor: '#13714C',
                transform: 'translate(-50%, -50%)',
                overflowY: 'auto',
                border: '2px solid black',
              }}
            >
              <div
                className="notifications-content"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '768px',
                  height: '480px',
                  boxSizing: 'border-box',
                  backgroundColor: '#A2E494',
                  border: '2px solid black',
                  margin: 0,
                  padding: 0,
                }}
                onClick={e => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontSize: "24px" }}>
                  <h2 style={{color:"black"}}>Notifications</h2>
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
                {adminNotifications.length === 0 ? (
                  <div style={{ padding: '16px', color: '#888' }}>No notifications available.</div>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {adminNotifications.map(notification => (
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
                            {notification.time || new Date(notification.createdAt).toLocaleString('en-US', {
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
                            onClick={() => handleMarkAdminNotificationAsRead(notification._id)}
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
                        .filter(applicant =>
                          (applicant.positionAppliedFor || []).some(
                            pos => pos.jobTitle === filteredJobOpenings[openApplicantsIdx]?.title
                          )
                        )
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
                                <span>Jobs Applied For: {(applicant.positionAppliedFor || []).map(pos => pos.jobTitle).join(', ')}</span>
                                <span>Birthdate: {new Date(applicant.birthdate).toISOString().split('T')[0]}</span>
                                <span>Gender: {applicant.gender}</span>
                                <span>City: {applicant.city}</span>
                                <span>State/Province: {applicant.stateProvince}</span>
                                <span>Status: {applicant.status}</span>
                                <span>Stage: {applicant.applicationStage}</span>
                                <span>Skills: {(applicant.resume && applicant.resume.filePath) ? applicant.resume.filePath : ''}</span>
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
                    {filtered.vafilteredJobOpenings[openDetailIdx]?.title || 'Job Title'}
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
            <div className="messagedetailsdarkgreen">
              <div className="messagedetailslightgreen" >
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
                      className="userjobdetailsbutton" style={{borderRadius: '6px'}}
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {seeInterviews && (
            <div className="interviewscover">
              <div className="interviewswrapper">
                <button className="interviews-close-btn" onClick={() => setseeInterviews(false)}>×</button>
                <div className="interviewslabel"><h1>Interviews</h1></div>
                <div
                  className="interviewsproper"
                  style={{
                    width: '90%',
                    minHeight: 288,
                    maxHeight: 480,
                    margin: '0 auto',
                    overflowY: 'auto',
                    background: '#fff',
                    border: '2px solid #13714C'
                  }}
                >
                  <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
                    <a
                      style={{
                        fontWeight: activeInterviewTab === 'Interviews' ? 'bold' : 'normal',
                        textDecoration: activeInterviewTab === 'Interviews' ? 'underline' : 'none',
                        cursor: 'pointer'
                      }}
                      onClick={() => setActiveInterviewTab('Interviews')}
                    >
                      Interviews
                    </a>
                    <a
                      style={{
                        fontWeight: activeInterviewTab === 'applicants' ? 'bold' : 'normal',
                        textDecoration: activeInterviewTab === 'applicants' ? 'underline' : 'none',
                        cursor: 'pointer'
                      }}
                      onClick={() => setActiveInterviewTab('applicants')}
                    >
                      Applicants
                    </a>
                  </div>
                  {activeInterviewTab === 'Interviews' && (
                    <>
                      <div className="interview-form-row">
                        <div className="form-item">
                          <label htmlFor="applicant-select">Select Applicant:</label>
                          <select id="applicant-select" value={selectedApplicant} onChange={handleApplicantChange}>
                            <option value="">-- Select Applicant --</option>
                            {applicants.map(applicant => (
                              <option key={applicant._id} value={applicant._id}>
                                {applicant.fullName}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-item">
                          <label htmlFor="interview-date">Date:</label>
                          <input
                            id="interview-date"
                            type="datetime-local"
                            value={interviewDate}
                            onChange={e => setInterviewDate(e.target.value)}
                          />
                        </div>
                        <div className="form-item">
                          <label htmlFor="interview-type">Type:</label>
                          <select
                            id="interview-type"
                            value={interviewType}
                            onChange={e => setInterviewType(e.target.value)}
                          >
                            <option value="">Select Type</option>
                            <option value="Online">Online</option>
                            <option value="On-site">On-site</option>
                          </select>
                        </div>
                        <div className="form-item">
                          <label htmlFor="job-select">Select Job Applied For:</label>
                          <select id="job-select" value={selectedJobTitle} onChange={(e) => setSelectedJobTitle(e.target.value)}>
                            <option value="">-- Select Job --</option>
                            {selectedApplicantJobs.map((job, index) => (
                              <option key={index} value={job}>{job}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-item">
                          <button onClick={handleAssignInterview} disabled={interviewLoading}>
                            {interviewLoading ? 'Assigning...' : 'Assign Interview'}
                          </button>
                        </div>
                      </div>
                      {interviewError && <div className="interview-error">{interviewError}</div>}
                      <h2 style={{ color: "black" }}>Scheduled Interviews</h2>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '600px', borderCollapse: 'collapse', fontSize:"12px" ,textAlign:"center"}}>
                          <thead>
                            <tr>
                              <th>Email</th>
                              <th>Date (dd/mm/yyyy)</th>
                              <th>Type</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {interviewList.map((iv, idx) => (
                              <tr key={iv._id || idx}>
                                <td>{iv.email}</td>
                                <td>{iv.date ? new Date(iv.date).toLocaleString() : ''}</td>
                                <td>{iv.type}</td>
                                <td>
                                  <button
                                    onClick={() => handleDeleteInterview(iv._id)}
                                    style={{
                                      background: '#A2E494',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '4px',
                                      padding: '4px 8px',
                                      cursor: 'pointer',
                                      marginTop:"5px"
                                    }}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {!interviewLoading && interviewEmail && interviewDate && interviewType && !interviewList.some(iv =>
                              iv.email === interviewEmail &&
                              new Date(iv.date).toISOString() === new Date(interviewDate).toISOString() &&
                              iv.type === interviewType
                            ) && (
                              <tr style={{ background: '#e6ffe6' }}>
                                <td>{interviewEmail}</td>
                                <td>{new Date(interviewDate).toLocaleString()}</td>
                                <td>{interviewType}</td>
                                <td>
                                  <button
                                    disabled
                                    style={{
                                      background: '#ccc',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '4px',
                                      padding: '4px 8px',
                                      cursor: 'not-allowed'
                                    }}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                  {activeInterviewTab === 'applicants' && (
                    <>
                      <h2>Applicants for Interview</h2>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr>
                              <th>Email</th>
                              <th>Full Name</th>
                              <th>Applied Positions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {applicants.map((a, idx) => (
                              <tr key={idx}>
                                <td>{a.email}</td>
                                <td>{a.fullName}</td>
                                <td>{(a.positionAppliedFor || []).map(pos => pos.jobTitle).join(', ')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminHome;