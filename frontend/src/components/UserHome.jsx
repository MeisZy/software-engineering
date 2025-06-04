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

  // Example job openings for demonstration
  const sampleJobOpenings = [
    {
      title: 'Business Process Analyst',
      department: 'Marketing',
      workSchedule: 'Part-time',
      employmentType: 'Rotational',
      workSetup: 'Hybrid',
      description: 'Analyze and improve business processes.',
      keyResponsibilities: [
        'Create process maps and documentation',
        'Identify process improvement opportunities',
        'Work with cross-functional teams'
      ],
      qualifications: [
        'Bachelor’s degree in Business or related field',
        'Strong analytical skills',
        'Experience with process mapping tools'
      ],
      whatWeOffer: [
        'Flexible schedule',
        'Growth opportunities',
        'Supportive team'
      ]
    },
    {
      title: 'Recruiter',
      department: 'Human Resources',
      workSchedule: 'Full-time',
      employmentType: 'Full Day',
      workSetup: 'On-site',
      description: 'Recruit and onboard new employees.',
      keyResponsibilities: [
        'Source and attract candidates',
        'Conduct interviews',
        'Coordinate with hiring managers'
      ],
      qualifications: [
        'Bachelor’s degree in HR or related field',
        'Excellent communication skills',
        'Experience in recruitment'
      ],
      whatWeOffer: [
        'Competitive salary',
        'Health benefits',
        'Professional development'
      ]
    },
    {
      title: 'Software Engineer',
      department: 'IT',
      workSchedule: 'Internship / On-the-Job Training',
      employmentType: 'Internship',
      workSetup: 'Work From Home',
      description: 'Develop and maintain software applications.',
      keyResponsibilities: [
        'Assist in software development projects',
        'Write clean and efficient code',
        'Participate in code reviews'
      ],
      qualifications: [
        'Currently pursuing a degree in Computer Science or related field',
        'Familiarity with JavaScript and React',
        'Eagerness to learn'
      ],
      whatWeOffer: [
        'Mentorship from senior engineers',
        'Remote work setup',
        'Hands-on experience'
      ]
    },
    {
      title: 'Graphic Designer',
      department: 'Marketing',
      workSchedule: 'Full-time',
      employmentType: 'Full Day',
      workSetup: 'Hybrid',
      description: 'Design graphics for marketing materials.',
      keyResponsibilities: [
        'Design marketing materials',
        'Work with the creative team',
        'Ensure brand consistency'
      ],
      qualifications: [
        'Bachelor’s degree in Graphic Design or related field',
        'Proficiency in Adobe Creative Suite',
        'Strong portfolio of design projects'
      ],
      whatWeOffer: [
        'Creative environment',
        'Career growth',
        'Flexible schedule'
      ]
    }
  ];

  // Filter states
  const [selectedWorkingSchedule, setSelectedWorkingSchedule] = useState([]);
  const [selectedEmploymentType, setSelectedEmploymentType] = useState([]);
  const [selectedWorkSetup, setSelectedWorkSetup] = useState([]);

  // Checkbox handler
  const handleCheckboxChange = (id, setState, state) => {
    if (state.includes(id)) {
      setState(state.filter(item => item !== id));
    } else {
      setState([...state, id]);
    }
  };

  // Filtering logic (same as AdminHome)
  const anyFilterSelected =
    selectedWorkingSchedule.length > 0 ||
    selectedEmploymentType.length > 0 ||
    selectedWorkSetup.length > 0;

  const filteredJobOpenings = sampleJobOpenings.filter(job => {
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

  const [userName, setUserName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [openDetailIdx, setOpenDetailIdx] = useState(null);
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
  };

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
        <a href="#" onClick={handleReportProblem}>Report a Problem?</a>
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
         <div className='jobscontainer'>
            {filteredJobOpenings.length === 0 && (
              <p style={{ padding: "32px", color: "#888" }}>No job openings match your filters.</p>
            )}
            {filteredJobOpenings.map((job, idx) => (
              <div className='jobscardwrapper' key={job.title}>
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
                  <div
                    className="userjobdetails"
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100vw",
                      height: "100vh",
                      background: "rgba(0,0,0,0.4)",
                      zIndex: 1000,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    onClick={() => setOpenDetailIdx(null)}
                  >
                    <div
                      className="userjobdetailsblock"
                      onClick={e => e.stopPropagation()}
                      style={{
                        background: "#13714C",
                        color: "white",
                        borderRadius: "12px",
                        padding: "32px",
                        minWidth: "350px",
                        maxWidth: "600px",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.18)"
                      }}
                    >
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
                            lineHeight: '1'
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
                        <p><b>Description:</b> {job.description}</p>
                        <p><b>Key Responsibilities:</b></p>
                        <ul>
                          {job.keyResponsibilities && job.keyResponsibilities.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                        <p><b>Qualifications:</b></p>
                        <ul>
                          {job.qualifications && job.qualifications.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                        <p><b>What we Offer:</b></p>
                        <ul>
                          {job.whatWeOffer && job.whatWeOffer.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                        <button
                          onClick={() => setOpenDetailIdx(null)}
                          style={{
                            marginTop: "24px",
                            background: "white",
                            color: "#13714C",
                            border: "none",
                            borderRadius: "6px",
                            padding: "8px 24px",
                            fontWeight: 600,
                            cursor: "pointer"
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {showReport && (
          <div className='reportsdetailsdarkgreen'>
            <div className='reportsdetailslightgreen'>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ marginBottom: 0 }}>Report a Problem</h3>
                <a
                  onClick={closeReport}
                  aria-label="Close"
                  style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#13714C',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    marginRight: '32px',
                    marginTop: '20px',
                    lineHeight: '1'
                  }}
                >
                  ×
                </a>
              </div>
              <div className="reportsdetails" onClick={closeReport}>
                <div
                  className="reportsdetailsblock"
                  onClick={e => e.stopPropagation()}
                  style={{
                    background: 'white',
                    backgroundImage: 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="reportsdetailsgrid">
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <label htmlFor="reportfrom" style={{ marginBottom: 0 }}>From:</label>
                      <input id="reportfrom" type="text" placeholder="Your email or name" style={{ marginBottom: 0 }} />
                    </div>
                    <label htmlFor="reporttext">Describe your issue:</label>
                    <textarea id="reporttext" placeholder="Please describe the problem you encountered..." />
                    <a href="#" onClick={closeReport} className="submitarrow" style={{ width: "120px", position: "absolute", right: 0, bottom: 0, margin: "32px 0 0 0", alignSelf: "flex-end", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
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