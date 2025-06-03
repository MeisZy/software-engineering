import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import Placeholder from '../components/images/pfp_placeholder.png';
import Select from 'react-select'

import './SetCriteria.css';

function SetCriteria() {

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

  const workingScheduleOptions = workingSchedule.map(option => ({
    value: option.id,
    label: option.label
  }));
  const employmentTypeOptions = employmentType.map(option => ({
    value: option.id,
    label: option.label
  }));
  const workSetupOptions = workSetup.map(option => ({
    value: option.id,
    label: option.label
  }));

  const [userName, setUserName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [showAddJob, setShowAddJob] = useState(false); 
  const [criteriaPage, setCriteriaPage] = useState(1);
  const navigate = useNavigate();
  const [keyResponsibilities, setKeyResponsibilities] = useState(['']);
  const [qualifications, setQualifications] = useState(['']);

  const handleKeyDown = useCallback(
    (e) => {
      if (!showAddJob) return;
      if (e.key === 'ArrowLeft') {
        handlePrevPage();
      } else if (e.key === 'ArrowRight') {
        handleNextPage();
      }
    },
    [showAddJob]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

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

  const MIN_PAGE = 1;
  const MAX_PAGE = 4;

    const handlePrevPage = () => {
      setCriteriaPage(prev => (prev - 1 < MIN_PAGE ? MAX_PAGE : prev - 1));
    };

    const handleNextPage = () => {
      setCriteriaPage(prev => (prev + 1 > MAX_PAGE ? MIN_PAGE : prev + 1));
    };

  /*  const handleCloseAddJob = () => {
      setShowAddJob(false);
      setCriteriaPage(1);
    };*/

    const handleAddResponsibility = () => {
      setKeyResponsibilities(prev => ['', ...prev]);
    };
    const handleAddQualifications = () => {
      setQualifications(prev => ['', ...prev]);
    };

    const handleResponsibilityChange = (idx, value) => {
    setKeyResponsibilities(prev => {
      const updated = [...prev];
      updated[idx] = value;
      return updated;
    });
    };

  // Custom styles for react-select to match .rowcomponent and input styles
  const customSelectStyles = {
     control: (provided) => ({
       ...provided,
       display: 'flex',
       flexDirection: 'row',
       alignItems: 'center',
       width: '100%',          
       minWidth: '0',          // Prevents overflow
       maxWidth: '400px',     
       borderRadius: 0,
       minHeight: '20px',
       fontSize: '16px',
       padding: '0',
       border: '2px solid black',
       boxShadow: 'none',
       borderColor: '#ccc',
     }),
     valueContainer: (provided) => ({
       ...provided,
       padding: '0 8px',
     }),
     input: (provided) => ({
       ...provided,
       margin: 0,
       padding: 0,
       fontSize: '16px',
     }),
     option: (provided, state) => ({
     ...provided,
     backgroundColor: state.isFocused || state.isSelected ? '#A2E494' : undefined,
     color: state.isFocused || state.isSelected ? 'black' : '#222',
     borderRadius: 0,
     fontSize: '16px',
     border:"1px solid black",
     textAlign:"center"
     }),
     menu: (provided) => ({
       ...provided,
       borderRadius: 0,
       marginTop: 0,
       zIndex: 10,
       width: '216px', 
     }),
     singleValue: (provided) => ({
       ...provided,
       fontSize: '16px',
     }),
     indicatorSeparator: () => ({
       display: 'none',
     }),
};

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
            <div className='jobdescription'>Department</div>
            <div className='jobrequirements'>Employment Type</div>
            <div className='jobactions'>Actions</div>
          </div>
        </div>
      </div>
        {showAddJob && (
          <>
            <div style={{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",background: "rgba(0,0,0,0.4)",zIndex:3}}  onClick={() => setShowAddJob(false)}/>
                <div className='criteriascreen'>  
                  <a onClick={() => setShowAddJob(false)} style={{
                                                                  position: "fixed",
                                                                  top: 0,
                                                                  left: 0,
                                                                  width: "1vw",
                                                                  height: "1vh",
                                                                  background: "rgba(0,0,0,0.4)",
                                                                  fontSize:"12px",
                                                                  zIndex: 3
                                                              }}>Close</a>
                  <div className='criteriascreencontent'>
                    {criteriaPage === 1 && (
                      <div className='page1'>
                        <div className="rowcomponent">
                          <label>Job Name</label>
                          <input type="text" placeholder="Job Name" />
                        </div>
                        <div className="rowcomponent">
                          <label>Department</label>
                          <input type="text" placeholder="Department" />
                        </div>
                        <div className="rowcomponent">
                          <label>Employment Type</label>
                          <Select
                            options={employmentTypeOptions}
                            styles={customSelectStyles}
                            placeholder="Select Employment Type"
                          />
                        </div>
                        <div className="rowcomponent">
                          <label>Work Schedule</label>
                          <Select
                            options={workingScheduleOptions}
                            styles={customSelectStyles}
                            placeholder="Select Work Schedule"
                          />
                        </div>
                        <div className="rowcomponent">
                          <label>Work Setup</label>
                          <Select
                            options={workSetupOptions}
                            styles={customSelectStyles}
                            placeholder="Select Work Setup"
                          />
                        </div>
                          <label>Description</label>
                          <textarea />
                      </div>
                    )}
                    {criteriaPage === 2 && (
                      <div className='page2'>
                        <div className='page2header'>
                          <h1 style={{ color: 'white' }}>Key Responsibilities</h1>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {keyResponsibilities.map((resp, idx) => (
                            <div className='keyresponsibilities' key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                              <input
                                value={resp}
                                onChange={e => handleResponsibilityChange(idx, e.target.value)}
                              />
                            </div>
                          ))}
                        <div className='addremovewrap'>
                          <div className='addbuttonwrap'>
                            <a onClick={handleAddResponsibility}>
                              +
                            </a>
                          </div>
                          {keyResponsibilities.length > 1 && (
                            <div className='removebuttonwrap' style={{ marginTop: '10px' }}>
                              <a onClick={() => setKeyResponsibilities(prev => prev.slice(0, -1))}>
                                -
                              </a>
                            </div>
                          )}
                        </div>
                        </div>
                      </div>
                    )}
                    {criteriaPage === 3 && (
                      <div className='page3'>
                        <div>
                          <h1>Qualifications</h1>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {qualifications.map((qual, idx) => (
                            <div className='keyresponsibilities' key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                              <input
                                value={qual}
                                onChange={e => setQualifications(prev => {
                                  const updated = [...prev];
                                  updated[idx] = e.target.value;
                                  return updated;
                                })}
                              />
                            </div>
                          ))}
                          <div className='addremovewrap'>
                            <div className='addbuttonwrap'>
                              <a onClick={() => setQualifications(prev => ['', ...prev])}>
                                +
                              </a>
                            </div>
                            {qualifications.length > 1 && (
                              <div className='removebuttonwrap'>
                                <a onClick={() => setQualifications(prev => prev.slice(0, -1))}>
                                  -
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {criteriaPage === 4 && (
                      <div className='page4'>
                        <div className="rowcomponent">
                          <label>Page 4 Field 1</label>
                          <input type="text" placeholder="Field 1" />
                        </div>
                        <div className="rowcomponent">
                          <label>Page 3 Field 2</label>
                          <input type="text" placeholder="Field 2" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="criterianavigate">
                    <ul><a onClick={handlePrevPage} className='left'></a></ul>
                    <ul><a onClick={handleNextPage} className='right'></a></ul>
                  </div>
                </div>
          </>
        )}
    </>
  );
}

export default SetCriteria;