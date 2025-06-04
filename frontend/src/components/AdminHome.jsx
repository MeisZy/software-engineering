import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import Logo from './images/logo.png';
import Details from './assets/jobdetailsimg.png'
import './AdminHome.css';

function AdminHome() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [openDetailIdx, setOpenDetailIdx] = useState(null);
  const [openApplicantsIdx, setOpenApplicantsIdx] = useState(null);
  const [openApplicantDetailIdx, setOpenApplicantDetailIdx] = useState(null);

  const [selectedWorkingSchedule, setSelectedWorkingSchedule] = useState([]);
  const [selectedEmploymentType, setSelectedEmploymentType] = useState([]);
  const [selectedWorkSetup, setSelectedWorkSetup] = useState([]);

  const handleLogout = () => navigate('/');
  const handleSetCriteria = () => navigate('/setcriteria');
  const handleFAQs = () => navigate('/questions');

  function getAcronym(title) {
    return title
      .split(' ')
      .map(word => word[0].toUpperCase())
      .join('');
  }

  function getInitials(firstName, middleName, lastName) {
    return (
      (firstName[0] || '').toUpperCase() +
      (middleName ? middleName[0].toUpperCase() : '') +
      (lastName[0] || '').toUpperCase()
    );
  }

  function formatDate(dateStr) {
    // Accepts 'YYYY-MM-DD' or 'YYYY/MM/DD' and returns 'YYYYMMDD'
    return dateStr.replace(/[-/]/g, '');
  }

  const sampleApplicants = [
    {
      applicantId: 'A001',
      firstName: 'John',
      middleName: 'Michael',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      mobileNumber: '09171234567',
      positionAppliedFor: 'Software Engineer',
      birthdate: '1998-05-12',
      gender: 'M',
      city: 'Quezon City',
      stateProvince: 'Metro Manila',
      status: 'Ongoing',
      applicationStage: '1st',
      resume: ['JavaScript', 'React', 'Node.js'],
      dateApplied: '2024-06-01'
    },
    {
      applicantId: 'A002',
      firstName: 'Jane',
      middleName: 'Ann',
      lastName: 'Smith',
      email: 'jane.smith@email.com',
      mobileNumber: '09181234567',
      positionAppliedFor: 'Recruiter',
      birthdate: '1997-11-23',
      gender: 'F',
      city: 'Makati',
      stateProvince: 'Metro Manila',
      status: 'Rejected',
      applicationStage: 'None',
      resume: ['Recruitment', 'HRIS', 'Interviewing'],
      dateApplied: '2024-05-15'
    },
    {
      applicantId: 'A003',
      firstName: 'Carlos',
      middleName: 'Reyes',
      lastName: 'Santos',
      email: 'carlos.santos@email.com',
      mobileNumber: '09191234567',
      positionAppliedFor: 'Business Process Analyst',
      birthdate: '1995-03-30',
      gender: 'M',
      city: 'Cebu City',
      stateProvince: 'Cebu',
      status: 'Ongoing',
      applicationStage: '2nd',
      resume: ['Process Mapping', 'Excel', 'Data Analysis'],
      dateApplied: '2025-04-23'
    },
    {
      applicantId: 'A004',
      firstName: 'Maria',
      middleName: 'Luisa',
      lastName: 'Garcia',
      email: 'maria.garcia@email.com',
      mobileNumber: '09201234567',
      positionAppliedFor: 'Graphic Designer',
      birthdate: '1999-07-15',
      gender: 'F',
      city: 'Davao City',
      stateProvince: 'Davao del Sur',
      status: 'Ongoing',
      applicationStage: 'Final',
      resume: ['Photoshop', 'Illustrator', 'Branding'],
      dateApplied: '2024-06-02'
    }
  ];

  // Generate applicantId for each applicant in sampleApplicants
  const sampleApplicantsWithId = sampleApplicants.map(applicant => {
    const dateApplied = applicant.dateApplied || applicant.birthdate || '20240604';
    return {
      ...applicant,
      applicantId: `${getAcronym(applicant.positionAppliedFor)}-${formatDate(dateApplied)}${getInitials(applicant.firstName, applicant.middleName, applicant.lastName)}`
    };
  });

  const sampleJobOpenings = [
    {
      title: 'Business Process Analyst',
      department: 'Marketing',
      workSchedule: 'Part-time',
      workSetup: 'Hybrid',
      employmentType: 'Rotational',
      description: 'We are seeking a creative and talented Graphic Designer to join our dynamic team.',
      keyResponsibilities: [
        'Create visual concepts and designs for marketing materials',
        'Collaborate with the marketing team',
        'Maintain brand consistency across all designs'
      ],
      qualifications: [
        'Bachelor’s degree in Graphic Design or related field',
        'Proficiency in Adobe Creative Suite',
        'Strong portfolio of design projects'
      ],
      whatWeOffer: [
        'Flexible working hours',
        'Opportunities for growth',
        'Supportive team environment'
      ]
    },
    {
      title: 'Recruiter',
      department: 'Human Resources',
      workSchedule: 'Full-time',
      workSetup: 'On-site',
      employmentType: 'Full Day',
      description: 'We are looking for a skilled Recruiter to help us find the best talent for our company.',
      keyResponsibilities: [
        'Source and attract candidates',
        'Conduct interviews and assessments',
        'Coordinate with department managers'
      ],
      qualifications: [
        'Bachelor’s degree in Human Resources or related field',
        'Experience in recruitment',
        'Excellent communication skills'
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
      workSetup: 'Work From Home',
      employmentType: 'Internship',
      description: 'Join our team as a Software Engineer and work on exciting projects.',
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
      workSetup: 'Hybrid',
      employmentType: 'Full Day',
      description: 'We are seeking a creative and talented Graphic Designer to join our dynamic team.',
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

  // Checkbox handlers
  const handleCheckboxChange = (id, setState, state) => {
    if (state.includes(id)) {
      setState(state.filter(item => item !== id));
    } else {
      setState([...state, id]);
    }
  };

  // Filtering logic for job cards (show all by default, filter if any filter is selected)
  const anyFilterSelected =
    selectedWorkingSchedule.length > 0 ||
    selectedEmploymentType.length > 0 ||
    selectedWorkSetup.length > 0;

  // "OR" logic: show job if it matches ANY selected filter in ANY category
// Replace your filteredJobOpenings logic with this improved version:
const filteredJobOpenings = sampleJobOpenings.filter(job => {
  if (!anyFilterSelected) return true; // Show all if no filters

  // Normalize for easier matching
  const ws = job.workSchedule.toLowerCase().replace(/[^a-z]/g, '');
  const et = job.employmentType.toLowerCase().replace(/[^a-z]/g, '');
  const wsup = job.workSetup.toLowerCase().replace(/[^a-z]/g, '');

  // Check if any selected filter matches the job's tags
  const wsMatch = selectedWorkingSchedule.some(id => ws.includes(id.replace(/[^a-z]/g, '')));
  const etMatch = selectedEmploymentType.some(id => et.includes(id.replace(/[^a-z]/g, '')));
  const wsupMatch = selectedWorkSetup.some(id => wsup.includes(id.replace(/[^a-z]/g, '')));

  // If a filter group has selections, require a match in that group
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
          <a>Interviews</a>
          <a onClick={handleFAQs}>FAQs</a>
          <a>Messages</a>
          <a onClick={handleSetCriteria}>Manage Jobs</a>
          <a onClick={handleLogout}>Logout</a>
          <a style={{color:"grey"}}>(FOR DEBUGGING ONLY)Import Applicants</a>
        </div>
      </nav>
      <div className='components'>
        <div className='adminleftcomp'>
          <div className="verticalfilter">
            <h2 style={{
              paddingBottom:"24px",
              paddingTop:"25px",
              fontSize:"24px"
              }}>Filters</h2>
              <h4 style={{fontSize:"14px",fontWeight:"600"}}>Working Schedule</h4>
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
            <h4 style={{fontSize:"14px",fontWeight:"600"}}>Employment Type</h4>
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
            <h4 style={{fontSize:"14px",fontWeight:"600"}}>Work Setup</h4>
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
        <div className='jobscontainer'>
          {filteredJobOpenings.map((job, idx) => {
            // Find the index in the original sampleJobOpenings for modal logic
            const originalIdx = sampleJobOpenings.findIndex(j => j.title === job.title);
            return (
              <div className='jobscardwrapper' key={job.title}>
                <div className="jobcard">
                  <h2>{job.title}</h2>
                  <div className='tags'>
                    <a>{job.workSchedule}</a>
                    <a>{job.employmentType}</a>
                    <a>{job.workSetup}</a>
                  </div>
                  <div className='joboption'>
                    <a  href="#"  onClick={e => { e.preventDefault(); setOpenApplicantsIdx(originalIdx);}}>
                      View Applicants
                    </a>
                    <a href="#" onClick={e => {   e.preventDefault();   setOpenDetailIdx(originalIdx); }}>
                      Details
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
                  {sampleJobOpenings[openApplicantsIdx].title}
                </h3>
                <button
                  className='jobdetailsapply'
                  onClick={() => setOpenApplicantsIdx(null)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <div className="applicantsgrid">
                <div className='applicantinstance'>
                  <ul>
                    {sampleApplicantsWithId
                      .filter(applicant => applicant.positionAppliedFor === sampleJobOpenings[openApplicantsIdx].title)
                      .map((applicant, idx) => (
                        <li key={applicant.applicantId} style={{ marginBottom: "16px", listStyle: "none" }}>
                          <b>{applicant.firstName} {applicant.middleName} {applicant.lastName}</b>
                          <button
                            style={{ marginLeft: "12px", padding: "2px 8px", fontSize: "12px",zIndex: 1 }}
                            onClick={() => setOpenApplicantDetailIdx(idx)}
                            type="button"
                          >
                            View Details
                          </button>
                          {openApplicantDetailIdx === idx && (
                            <div className='applicantdetailwrap'>
                              <span>Applicant ID: {applicant.applicantId}</span>
                              <span>Email: {applicant.email}</span>
                              <span>Mobile: {applicant.mobileNumber}</span>
                              <span>Position: {applicant.positionAppliedFor}</span>
                              <span>Birthdate: {applicant.birthdate}</span>
                              <span>Gender: {applicant.gender}</span>
                              <span>City: {applicant.city}</span>
                              <span>State/Province: {applicant.stateProvince}</span>
                              <span>Status: {applicant.status}</span>
                              <span>Stage: {applicant.applicationStage}</span>
                              <span>Skills: {applicant.resume.join(', ')}</span>
                              <button
                                style={{ marginTop: "8px", fontSize: "12px" }}
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
                  {sampleJobOpenings[openDetailIdx].title}
                </h3>
                <a className='jobdetailsapply' onClick={() => setOpenDetailIdx(null)} aria-label="Close">
                  ×
                </a>
              </div>
              <div className="jobdetailsgrid">
                <div>
                  <p><b>Department:</b> {sampleJobOpenings[openDetailIdx].department}</p>
                  <p><b>Work Schedule:</b> {sampleJobOpenings[openDetailIdx].workSchedule}</p>
                  <p><b>Work Setup:</b> {sampleJobOpenings[openDetailIdx].workSetup}</p>
                  <p><b>Employment Type:</b> {sampleJobOpenings[openDetailIdx].employmentType}</p>
                  <p><b>Description:</b> {sampleJobOpenings[openDetailIdx].description}</p>
                  <p><b>Key Responsibilities:</b></p>
                  <ul>
                    {sampleJobOpenings[openDetailIdx].keyResponsibilities.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p><b>Qualifications:</b></p>
                  <ul>
                    {sampleJobOpenings[openDetailIdx].qualifications.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                  <p><b>What we Offer:</b></p>
                  <ul>
                    {sampleJobOpenings[openDetailIdx].whatWeOffer.map((item, i) => (
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