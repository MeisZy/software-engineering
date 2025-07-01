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
  const [openDetailIdx, setOpenDetailIdx] = useState(null);
  const [userName, setUserName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [showAddJob, setShowAddJob] = useState(false);
  const [criteriaPage, setCriteriaPage] = useState(1);
  const [keyResponsibilities, setKeyResponsibilities] = useState(['']);
  const [qualifications, setQualifications] = useState(['']);
  const [offers, setOffers] = useState(['']);
  const [keywords, setKeywords] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [gradedQualifications, setGradedQualifications] = useState([{ attribute: '', points: 0 }]);
  const [threshold, setThreshold] = useState('');
  const [jobData, setJobData] = useState({
    title: '',
    department: '',
    employmentType: '',
    workSchedule: '',
    workSetup: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [jobsError, setJobsError] = useState('');

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/jobs');
      setJobs(response.data);
      setJobsError('');
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setJobsError('Failed to load jobs.');
    }
  };

  useEffect(() => {
    fetchJobs();
    const storedUser = localStorage.getItem('userName');
    const storedPic = localStorage.getItem('profilePic');
    if (storedUser) {
      setUserName(storedUser);
      setProfilePic(storedPic);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleRemoveJob = async (jobId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/jobs/${jobId}`);
      setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
      setJobsError('');
      alert(response.data.message || 'Job deleted successfully');
    } catch (err) {
      console.error('Error deleting job:', err);
      setJobsError(err.response?.data?.message || 'Failed to delete job.');
    }
  };

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

  const handleReturn = () => {
    navigate('/adminhome');
  };

  const handlePrevPage = () => {
    setCriteriaPage(prev => (prev - 1 < 1 ? 6 : prev - 1));
    setError('');
  };

  const handleNextPage = () => {
    setCriteriaPage(prev => (prev + 1 > 6 ? 1 : prev + 1));
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

  const handleKeywordsKeyDown = (e) => {
    if (e.key === ' ' || e.key === ',') {
      e.preventDefault();
      const newWord = inputValue.trim();
      if (newWord && !keywords.includes(newWord)) {
        setKeywords([...keywords, newWord]);
        setInputValue('');
      }
    }
  };

  const removeKeyword = (wordToRemove) => {
    setKeywords(keywords.filter(word => word !== wordToRemove));
  };

  const handleGradedQualificationChange = (idx, field, value) => {
    const updatedQualifications = [...gradedQualifications];
    updatedQualifications[idx] = { ...updatedQualifications[idx], [field]: value };
    setGradedQualifications(updatedQualifications);
  };

  const handleAddGradedQualification = () => {
    setGradedQualifications(prev => [...prev, { attribute: '', points: 0 }]);
  };

  const handleRemoveGradedQualification = (idx) => {
    setGradedQualifications(prev => prev.filter((_, i) => i !== idx));
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
    const totalScore = gradedQualifications.reduce((sum, qual) => sum + (qual.points || 0), 0);
    if (totalScore > 20) return 'Total graded qualifications score cannot exceed 20 points';
    if (!threshold || threshold < 0 || threshold > 15) return 'Threshold must be between 0 and 15';
    return '';
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError('');

    const validationError = validateJobData();
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
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
        keywords: keywords,
        gradedQualifications: gradedQualifications.filter(qual => qual.attribute && qual.points > 0),
        threshold,
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
      setKeywords([]);
      setInputValue('');
      setGradedQualifications([{ attribute: '', points: 0 }]);
      setThreshold('');
      setError('');
      fetchJobs();
    } catch (error) {
      console.error('Error creating job:', error);
      setError(error.response?.data?.message || 'Failed to create job. Please try again.');
    } finally {
      setIsSubmitting(false);
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
          <a>Manage Jobs</a>
        </div>
        <a onClick={handleReturn} style={{ cursor: 'pointer' }}>Back</a>
      </nav>
      <div>
        <div className="criteria">
          <a onClick={() => setShowAddJob(true)}>Add Job</a>
          <a style={{ cursor: jobs.length ? 'pointer' : 'not-allowed' }} onClick={() => jobs.length && alert('Select a job to remove from the list below.')}>Remove Job</a>
        </div>
        <div className='jobswrapper'>
          {jobsError && <div style={{ color: 'red', padding: '16px' }}>{jobsError}</div>}
          {jobs.length === 0 ? (
            <div style={{ padding: '16px', color: '#888' }}>No jobs available.</div>
          ) : (
            jobs.map((job, idx) => (
              <div className='jobinstancedarkgreen' key={job._id}>
                <div className='jobinstance'>
                  <h1 className='jobtitle'><a>{job.title}</a></h1>
                  <div className="jobinstance-row">
                    <p className='jobdescription'>{job.department}</p>
                    <p className='jobrequirements'>{job.employmentType}</p>
                    <p className='jobrequirements'>{job.workSchedule}</p>
                    <p className='jobrequirements'>{job.workSetup}</p>
                  </div>
                </div>
                <div className='jobactions'>
                  <a
                    href="#"
                    onClick={e => { e.preventDefault(); setOpenDetailIdx(idx); }}
                    style={{ marginRight: '8px' }}
                  >
                    Details
                  </a>
                  <a
                    href="#"
                    onClick={e => { e.preventDefault(); handleRemoveJob(job._id); }}
                  >
                    Delete
                  </a>
                </div>
{openDetailIdx === idx && (
  <div
    className="jobdetailsmodal"
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.4)',
      zIndex: 20,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}
    onClick={() => setOpenDetailIdx(null)}
  >
    {/*Updated June 30, 2025*/}
    <div className='jobdetailscontent-MainWrapper'> 
    <div className='jobdetailscontentdarkgreen'    >
     <div className='managejobDetailsHeader'>
              <h2 >{job.title}</h2>
                <button
                  onClick={() => setOpenDetailIdx(null)}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '24px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    zIndex: 2,
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: 'black',
                    marginLeft: '24px',

                    lineHeight: '1',
                  }}
                  aria-label="Close"
                >
                  ×
                </button>
      </div>

      <div className="jobdetailscontent" onClick={e => e.stopPropagation()}>

          <p style={{marginTop: '15px'}}><b>Department:</b> {job.department}</p>
          <p><b>Employment Type:</b> {job.employmentType}</p>          
          <p>
            <b>Work Schedule:</b> {job.workSchedule}
          </p>
          <p><b>Work Setup:</b> {job.workSetup}</p>
          <p><b>Description:</b> {Array.isArray(job.description) ? job.description.join(', ') : job.description}</p>

        {Array.isArray(job.keyResponsibilities) && job.keyResponsibilities.length > 0 && (
            <p><b>Key Responsibilities:</b> <ul>
              {job.keyResponsibilities.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul></p>
        )}
        {Array.isArray(job.qualifications) && job.qualifications.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <p>
            <b>Qualifications:</b>
            <ul>
              {job.qualifications.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            </p>
          </div>
        )}
        {Array.isArray(job.whatWeOffer) && job.whatWeOffer.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <p>            <b>What we Offer:</b>
            <ul>
              {job.whatWeOffer.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul></p>

          </div>
        )}
          <p>
            <b>Threshold:</b> {job.threshold}
          </p>
          <p>
            <b>Keywords:</b> {Array.isArray(job.keywords) ? job.keywords.join(', ') : job.keywords}
          </p>
        {Array.isArray(job.gradedQualifications) && job.gradedQualifications.length > 0 && (
            <p>
            <b>Graded Qualifications:</b>
            <ul>
              {job.gradedQualifications.map((qual, i) => (
                <li key={i}>{qual.attribute}: {qual.points}</li>
              ))}
            </ul>
            </p>

        )}
      </div>
    </div>
    </div>
  </div>
)}
              </div>
            ))
          )}
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
                  <div className="scrollable-content">
                    <h1>Customize Criteria</h1>
                    <div className="keywords-textarea">
                      <label>Keywords to Search in Resume</label>
                      <div className="keywords-container">
                        {keywords.map((word, index) => (
                          <WordButton key={index} word={word} onRemove={removeKeyword} />
                        ))}
                      </div>
                      <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeywordsKeyDown}
                        placeholder="Enter keywords separated by space or comma"
                      />
                    </div>
                    <div className="graded-qualifications">
                      <h2>Graded Qualifications</h2>
                      <div className="attribute-header">
                        <label>Attribute and Points (out of 20)</label>
                      </div>
                      {gradedQualifications.map((qual, idx) => (
                        <div className="attribute-row" key={idx}>
                          <input
                            type="text"
                            value={qual.attribute}
                            onChange={(e) => handleGradedQualificationChange(idx, 'attribute', e.target.value)}
                            placeholder="Attribute"
                          />
                          <input
                            type="number"
                            value={qual.points}
                            onChange={(e) =>
                              handleGradedQualificationChange(idx, 'points', Math.min(20, Math.max(0, e.target.value)))
                            }
                            min="0"
                            max="20"
                            placeholder="Points"
                          />
                          {idx > 0 && (
                            <button className="remove-button" onClick={() => handleRemoveGradedQualification(idx)}>
                              -
                            </button>
                          )}
                          {idx === gradedQualifications.length - 1 && (
                            <button className="add-button" onClick={handleAddGradedQualification}>
                              +
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="threshold">
                      <label>Threshold</label>
                      <input
                        type="number"
                        value={threshold}
                        onChange={(e) => setThreshold(e.target.value)}
                        placeholder="Enter threshold score (0-15)"
                      />
                    </div>
                    <div className="button-container">

                    </div>
                  </div>
                </div>
              )}
              {criteriaPage === 6 && (
                <div className='page6'>
                  <div className="criteriajobcard">
                    <h2 style={{ margin: '20px 20px 16px 20px' }}>
                      {jobData.title || 'Job Title'}
                    </h2>
                    <div className='tags' style={{ marginBottom: '16px',marginLeft:"25px" }}>
                      <a>{jobData.department || 'Department'}</a>
                      <a>{jobData.employmentType || 'Employment Type'}</a>
                      <a>{jobData.workSchedule || 'Work Schedule'}</a>
                      <a>{jobData.workSetup || 'Work Setup'}</a>
                    </div>
                    <div style={{marginLeft:"30px"}}>
                      <div style={{ marginBottom: '16px' }}>
                        <b>Description:</b>
                        <div>{jobData.description || 'No description'}</div>
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <b>Key Responsibilities:</b>
                        <ul>
                          {keyResponsibilities.filter(Boolean).map((item, i) => (
                            <li key={i} style={{listStyle:"none"}}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <b>Qualifications:</b>
                        <ul>
                          {qualifications.filter(Boolean).map((item, i) => (
                            <li key={i} style={{listStyle:"none"}}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <b>What we Offer:</b>
                        <ul>
                          {offers.filter(Boolean).map((item, i) => (
                            <li key={i} style={{listStyle:"none"}}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <button
                        onClick={handleSubmit}
                        style={{ marginTop: '16px' }}
                        disabled={isSubmitting}
                        className='submitjob'
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Job'}
                      </button>
                    </div>
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

const WordButton = ({ word, onRemove }) => (
  <button
    onClick={() => onRemove(word)}
    style={{
      backgroundColor: '#A2E494',
      border: '2px solid black',
      margin: '4px',
      padding: '4px 8px',
      borderRadius: '6px',
      cursor: 'pointer',
    }}
  >
    X {word}
  </button>
);

export default SetCriteria;