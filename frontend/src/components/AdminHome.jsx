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
  
  const handleLogout = () => navigate('/');

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
    title: 'Software Engineer5',
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
    title: 'Software Engineer5',
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
    title: 'Software Engineer5',
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
    title: 'Software Engineer5',
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
    title: 'Software Engineer5',
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
    title: 'Software Engineer5',
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
    title: 'Software Engineer5',
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
    title: 'Software Engineer5',
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
    title: 'Software Engineer9',
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
    resume: ['JavaScript', 'React', 'Node.js']
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
    resume: ['Recruitment', 'HRIS', 'Interviewing']
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
    resume: ['Process Mapping', 'Excel', 'Data Analysis']
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
    resume: ['Photoshop', 'Illustrator', 'Branding']
  }
];

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
          <a>FAQs</a>
          <a>Messages</a>
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
                <input type="checkbox" id={option.id} />
                <span className="checkmark"></span>
                <p>{option.label}</p>
              </label>
            ))}
          </div>
          <div className="verticalfilter">
            <h4 style={{fontSize:"14px",fontWeight:"600"}}>Employment Type</h4>
            {employmentType.map(option => (
              <label className="custom-checkbox" key={option.id}>
                <input type="checkbox" id={option.id} />
                <span className="checkmark"></span>
                <p>{option.label}</p>
              </label>
            ))}
          </div>
          <div className="verticalfilter">
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
      <div className='adminrightcomp'>
        <div className='jobscontainer'>
          {sampleJobOpenings.map((job, idx) => (
            <div className='jobscardwrapper' key={idx}>
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
                      setOpenApplicantsIdx(idx);
                    }}
                  >
                    View Applicants
                  </a>
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
            </div>
          ))}
        </div>
          {openApplicantsIdx !== null && (
          <div className="applicantslistcontainer"  onClick={() => setOpenApplicantsIdx(null)}>
            <div className="jobdetailsblock" onClick={e => e.stopPropagation()} style={{   backgroundImage: `url(${Details})`,   backgroundSize: 'cover',   backgroundPosition: 'center' }}>
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
                      {sampleApplicants.map(applicant => (
                        <li key={applicant.applicantId} style={{marginBottom: "16px"}}>
                          <b>{applicant.firstName} {applicant.middleName} {applicant.lastName}</b><br />
                          <span>ID: {applicant.applicantId}</span><br />
                          <span>Email: {applicant.email}</span><br />
                          <span>Mobile: {applicant.mobileNumber}</span><br />
                          <span>Position: {applicant.positionAppliedFor}</span><br />
                          <span>Birthdate: {applicant.birthdate}</span><br />
                          <span>Gender: {applicant.gender}</span><br />
                          <span>City: {applicant.city}</span><br />
                          <span>State/Province: {applicant.stateProvince}</span><br />
                          <span>Status  : {applicant.status}</span><br />
                          <span>Stage: {applicant.applicationStage}</span><br />
                          <span>Skills: {applicant.resume.join(', ')}</span>
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

/*
              <p><b>Department:</b> {job.department}</p>
              <p><b>Work Schedule:</b> {job.workSchedule}</p>
              <p><b>Work Setup:</b> {job.workSetup}</p>
              <p><b>Employment Type:</b> {job.employmentType}</p>
              <p><b>Description:</b> {job.description}</p>
              <div>
                <b>Key Responsibilities:</b>
                <ul>
                  {job.keyResponsibilities.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <b>Qualifications:</b>
                <ul>
                  {job.qualifications.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <b>What we Offer:</b>
                <ul>
                  {job.whatWeOffer.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

*/