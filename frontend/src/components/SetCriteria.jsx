import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Placeholder from '../components/images/pfp_placeholder.png';
import Select from 'react-select';
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
    label: option.label,
  }));
  const employmentTypeOptions = employmentType.map(option => ({
    value: option.id,
    label: option.label,
  }));
  const workSetupOptions = workSetup.map(option => ({
    value: option.id,
    label: option.label,
  }));

  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [showAddJob, setShowAddJob] = useState(false);
  const [criteriaPage, setCriteriaPage] = useState(1);
  const [keyResponsibilities, setKeyResponsibilities] = useState(['']);
  const [qualifications, setQualifications] = useState(['']);
  const [offers, setOffers] = useState(['']);
  const [jobData, setJobData] = useState({
    title: '',
    department: '',
    employmentType: '',
    workSchedule: '',
    workSetup: '',
    description: '',
  });
  const [error, setError] = useState('');

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
  };

  const MIN_PAGE = 1;
  const MAX_PAGE = 5;

  const handlePrevPage = () => {
    setCriteriaPage(prev => (prev - 1 < MIN_PAGE ? MAX_PAGE : prev - 1));
    setError('');
  };

  const handleNextPage = () => {
    setCriteriaPage(prev => (prev + 1 > MAX_PAGE ? MIN_PAGE : prev + 1));
    setError('');
  };

  const handleAddResponsibility = () => {
    setKeyResponsibilities(prev => ['', ...prev]);
  };

  const handleAddQualifications = () => {
    setQualifications(prev => ['', ...prev]);
  };

  const handleAddOffer = () => {
    setOffers(prev => ['', ...prev]);
  };

  const handleRemoveOffer = () => {
    setOffers(prev => prev.slice(0, -1));
  };

  const handleResponsibilityChange = (idx, value) => {
    setKeyResponsibilities(prev => {
      const updated = [...prev];
      updated[idx] = value;
      return updated;
    });
  };

  const handleQualificationChange = (idx, value) => {
    setQualifications(prev => {
      const updated = [...prev];
      updated[idx] = value;
      return updated;
    });
  };

  const handleOfferChange = (idx, value) => {
    setOffers(prev => {
      const updated = [...prev];
      updated[idx] = value;
      return updated;
    });
  };

  const handleInputChange = (field, value) => {
    setJobData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateJobData = () => {
    if (!jobData.title) return 'Job title is required';
    if (!jobData.department) return 'Department is required';
    if (!jobData.workSchedule) return 'Work schedule is required';
    if (!jobData.workSetup) return 'Work setup is required';
    if (!jobData.employmentType) return 'Employment type is required';
    if (!jobData.description) return 'Description is required';
    if (!keyResponsibilities.some(resp => resp.trim())) return 'At least one key responsibility is required';
    if (!qualifications.some(qual => qual.trim())) return 'At least one qualification is required';
    if (!offers.some(offer => offer.trim())) return 'At least one offer is required';
    return '';
  };

  const handleSubmit = async () => {
    const validationError = validateJobData();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/jobs', {
        title: jobData.title.trim(),
        department: jobData.department.trim(),
        workSchedule: jobData.workSchedule,
        workSetup: jobData.workSetup,
        employmentType: jobData.employmentType,
        description: [jobData.description.trim()],
        keyResponsibilities: keyResponsibilities.filter(Boolean).map(item => item.trim()),
        qualifications: qualifications.filter(Boolean).map(item => item.trim()),
        whatWeOffer: offers.filter(Boolean).map(item => item.trim()),
      });

      alert('Job created successfully!');
      setShowAddJob(false);
      setCriteriaPage(1);
      setJobData({
        title: '',
        department: '',
        employmentType: '',
        workSchedule: '',
        workSetup: '',
        description: '',
      });
      setKeyResponsibilities(['']);
      setQualifications(['']);
      setOffers(['']);
      setError('');
    } catch (error) {
      console.error('Error creating job:', error);
      setError(error.response?.data?.message || 'Failed to create job');
    }
  };

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      minWidth: '0',
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
      border: '1px solid black',
      textAlign: 'center',
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
        fontSize: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src={profilePic || Placeholder} alt="Profile" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
          <a>Set Criteria</a>
        </div>
        <a onClick={handleReturn} style={{ cursor: 'pointer' }}>Back</a>
      </nav>
      <div>
        <div className="criteria">
          <a onClick={() => setShowAddJob(true)}>Add Job</a>
          <a>Remove Job</a>
        </div>
        <div className='jobslists'>
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
          <div
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', zIndex: 3 }}
            onClick={() => setShowAddJob(false)}
          />
          <div className='criteriascreen'>
            <div className='criteriascreencontent'>
              {error && (
                <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>
              )}
              {criteriaPage === 1 && (
                <div className='page1'>
                  <div className="rowcomponent">
                    <label>Job Name</label>
                    <input
                      type="text"
                      placeholder="Job Name"
                      value={jobData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                  </div>
                  <div className="rowcomponent">
                    <label>Department</label>
                    <input
                      type="text"
                      placeholder="Department"
                      value={jobData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                    />
                  </div>
                  <div className="rowcomponent">
                    <label>Employment Type</label>
                    <Select
                      options={employmentTypeOptions}
                      styles={customSelectStyles}
                      placeholder="Select Employment Type"
                      onChange={(option) => handleInputChange('employmentType', option.label)}
                    />
                  </div>
                  <div className="rowcomponent">
                    <label>Work Schedule</label>
                    <Select
                      options={workingScheduleOptions}
                      styles={customSelectStyles}
                      placeholder="Select Work Schedule"
                      onChange={(option) => handleInputChange('workSchedule', option.label)}
                    />
                  </div>
                  <div className="rowcomponent">
                    <label>Work Setup</label>
                    <Select
                      options={workSetupOptions}
                      styles={customSelectStyles}
                      placeholder="Select Work Setup"
                      onChange={(option) => handleInputChange('workSetup', option.label)}
                    />
                  </div>
                  <label>Description</label>
                  <textarea
                    value={jobData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>
              )}
              {criteriaPage === 2 && (
                <div className='page2'>
                  <div className='page2header'>
                    <h1 style={{ color: 'white' }}>Key Responsibilities</h1>
                  </div>
                  {keyResponsibilities.map((resp, idx) => (
                    <div className='keyresponsibilities' key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        value={resp}
                        onChange={(e) => handleResponsibilityChange(idx, e.target.value)}
                      />
                    </div>
                  ))}
                  <div className='addremovewrap'>
                    <div className='addbuttonwrap'>
                      <a onClick={handleAddResponsibility}>+</a>
                    </div>
                    {keyResponsibilities.length > 1 && (
                      <div className='removebuttonwrap'>
                        <a onClick={() => setKeyResponsibilities(prev => prev.slice(0, -1))}>-</a>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {criteriaPage === 3 && (
                <div className='page3'>
                  <div>
                    <h1>Qualifications</h1>
                  </div>
                  {qualifications.map((qual, idx) => (
                    <div className='qualifications' key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        value={qual}
                        onChange={(e) => handleQualificationChange(idx, e.target.value)}
                      />
                    </div>
                  ))}
                  <div className='addremovewrap'>
                    <div className='addbuttonwrap'>
                      <a onClick={handleAddQualifications}>+</a>
                    </div>
                    {qualifications.length > 1 && (
                      <div className='removebuttonwrap'>
                        <a onClick={() => setQualifications(prev => prev.slice(0, -1))}>-</a>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {criteriaPage === 4 && (
                <div className='page4'>
                  <div>
                    <h1>What we Offer:</h1>
                  </div>
                  {offers.map((offer, idx) => (
                    <div className='offers' key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        value={offer}
                        onChange={(e) => handleOfferChange(idx, e.target.value)}
                      />
                    </div>
                  ))}
                  <div className='addremovewrap'>
                    <div className='addbuttonwrap'>
                      <a onClick={handleAddOffer}>+</a>
                    </div>
                    {offers.length > 1 && (
                      <div className='removebuttonwrap'>
                        <a onClick={handleRemoveOffer}>-</a>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {criteriaPage === 5 && (
                <div className='page5'>
                  <div className="criteriajobcard">
                    <h2 style={{ margin: '20px 20px 16px 20px' }}>
                      {jobData.title || 'Job Title'}
                    </h2>
                    <div className='tags' style={{ marginBottom: '16px' }}>
                      <a>{jobData.department || 'Department'}</a>
                      <a>{jobData.employmentType || 'Employment Type'}</a>
                      <a>{jobData.workSchedule || 'Work Schedule'}</a>
                      <a>{jobData.workSetup || 'Work Setup'}</a>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <b>Description:</b>
                      <div>{jobData.description || 'No description'}</div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <b>Key Responsibilities:</b>
                      <ul>
                        {keyResponsibilities.filter(Boolean).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <b>Qualifications:</b>
                      <ul>
                        {qualifications.filter(Boolean).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <b>What we Offer:</b>
                      <ul>
                        {offers.filter(Boolean).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <button onClick={handleSubmit} style={{ marginTop: '16px' }}>
                      Submit Job
                    </button>
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