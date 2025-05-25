import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import Logo from './images/logo.png';
import './AdminHome.css';

function AdminHome() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

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
              <div style={{border:"1px solid black"}}>
                <div className="jobcard" key={idx}>
                    <h2>{job.title}</h2>
                    <div className='tags'>
                        <a>{job.workSchedule}</a>
                        <a>{job.employmentType}</a>
                        <a>{job.workSetup}</a>
                    </div>
                    <div className='jobinfo'>
                        <a href="https://google.com">View Applicants</a>
                        <a href="https://google.com">Details</a>
                    </div>
                </div>
              </div>
              ))}
        </div>
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