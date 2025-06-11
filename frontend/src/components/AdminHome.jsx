import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Logo from './images/logo.png';
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsResponse, applicantsResponse] = await Promise.all([
          axios.get('http://localhost:5000/jobs'),
          axios.get('http://localhost:5000/applicants')
        ]);
        setJobs(jobsResponse.data);
        setApplicants(applicantsResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
        <a href="/" className="logo-link">
          <img src={Logo} alt="Logo" className="logo" />
        </a>
        <div>
          <a href="javascript:;">Admin</a>
        </div>
        <div>
          <a onClick={handleMaintainance}>Settings</a>
          <a onClick={handleFAQs}>FAQs</a>
          <a>Messages</a>
          <a onClick={handleSetCriteria}>Manage Jobs</a>
          <a onClick={handleLogout}>Logout</a>
        </div>
      </nav>
      <div className='components'>
        <div className='adminleftcomp'>
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
          {loading ? (
            <div style={{ padding: '32px', color: '#888' }}>Loading data...</div>
          ) : (
            <div className='jobscontainer'>
              {filteredJobOpenings.length === 0 ? (
                <div style={{ padding: '32px', color: '#888' }}>No jobs available.</div>
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
                    {filteredJobOpenings[openApplicantsIdx].title}
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
                        .filter(applicant => applicant.positionAppliedFor.includes(filteredJobOpenings[openApplicantsIdx].title))
                        .map((applicant, idx) => (
                          <li key={applicant.email} style={{ marginBottom: "16px", listStyle: "none" }}>
                            <b>{applicant.firstName} {applicant.middleName} {applicant.lastName}</b>
                            <a className="viewdetails" onClick={() => setOpenApplicantDetailIdx(idx)}>
                              View Details
                            </a>
                            {openApplicantDetailIdx === idx && (
                              <div className='applicantdetailwrap'>
                                <span>Email: {applicant.email}</span>
                                <span>Mobile: {applicant.mobileNumber}</span>
                                <span>Position: {applicant.positionAppliedFor.join(', ')}</span>
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
                    {filteredJobOpenings[openDetailIdx].title}
                  </h3>
                  <a className='jobdetailsapply' onClick={() => setOpenDetailIdx(null)} aria-label="Close">
                    ×
                  </a>
                </div>
                <div className="jobdetailsgrid">
                  <div>
                    <p><b>Department:</b> {filteredJobOpenings[openDetailIdx].department}</p>
                    <p><b>Work Schedule:</b> {filteredJobOpenings[openDetailIdx].workSchedule}</p>
                    <p><b>Work Setup:</b> {filteredJobOpenings[openDetailIdx].workSetup}</p>
                    <p><b>Employment Type:</b> {filteredJobOpenings[openDetailIdx].employmentType}</p>
                    <p><b>Description:</b> {filteredJobOpenings[openDetailIdx].description.join(', ')}</p>
                    <p><b>Key Responsibilities:</b></p>
                    <ul>
                      {filteredJobOpenings[openDetailIdx].keyResponsibilities.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p><b>Qualifications:</b></p>
                    <ul>
                      {filteredJobOpenings[openDetailIdx].qualifications.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                    <p><b>What we Offer:</b></p>
                    <ul>
                      {filteredJobOpenings[openDetailIdx].whatWeOffer.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
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
        </div>
      </div>
    </>
  );
}

export default AdminHome;