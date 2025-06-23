import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './SetCriteria.css';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const SetCriteria = () => {
  const [showAddJob, setShowAddJob] = useState(false);
  const [criteriaPage, setCriteriaPage] = useState(1);
  const [jobData, setJobData] = useState({
    title: '',
    department: '',
    workSchedule: '',
    workSetup: '',
    employmentType: '',
    description: [''],
  });
  const [keyResponsibilities, setKeyResponsibilities] = useState(['']);
  const [qualifications, setQualifications] = useState(['']);
  const [whatWeOffer, setWhatWeOffer] = useState(['']);
  const [inputValue, setInputValue] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [gradedQualifications, setGradedQualifications] = useState([{ attribute: '', points: 0 }]);
  const [threshold, setThreshold] = useState(10);
  const [error, setError] = useState('');
  const [jobs, setJobs] = useState([]);

  const departmentOptions = [
    { value: 'IT', label: 'IT' },
    { value: 'HR', label: 'HR' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Operations', label: 'Operations' },
  ];

  const workScheduleOptions = [
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Contract', label: 'Contract' },
  ];

  const workSetupOptions = [
    { value: 'On-site', label: 'On-site' },
    { value: 'Hybrid', label: 'Hybrid' },
    { value: 'Remote', label: 'Remote' },
  ];

  const employmentTypeOptions = [
    { value: 'Permanent', label: 'Permanent' },
    { value: 'Temporary', label: 'Temporary' },
    { value: 'Freelance', label: 'Freelance' },
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/jobs');
        setJobs(response.data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs.');
      }
    };
    fetchJobs();
  }, []);

  const handleInputChange = (e, field) => {
    setJobData({ ...jobData, [field]: e.target.value });
  };

  const handleSelectChange = (selectedOption, field) => {
    setJobData({ ...jobData, [field]: selectedOption ? selectedOption.value : '' });
  };

  const handleAddItem = (setItems, items) => {
    setItems([...items, '']);
  };

  const handleItemChange = (index, value, setItems, items) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const handleRemoveItem = (index, setItems, items) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleAddGradedQualification = () => {
    setGradedQualifications([...gradedQualifications, { attribute: '', points: 0 }]);
  };

  const handleGradedQualificationChange = (index, field, value) => {
    const newQuals = [...gradedQualifications];
    newQuals[index][field] = field === 'points' ? Math.min(20, Math.max(0, Number(value))) : value;
    setGradedQualifications(newQuals);
  };

  const handleRemoveGradedQualification = (index) => {
    setGradedQualifications(gradedQualifications.filter((_, i) => i !== index));
  };

  const handleKeywordsKeyDown = (e) => {
    if (e.key === ' ' || e.key === ',') {
      e.preventDefault();
      const trimmedValue = inputValue.trim();
      if (trimmedValue && !keywords.includes(trimmedValue)) {
        setKeywords([...keywords, trimmedValue]);
        setInputValue('');
      }
    }
  };

  const removeKeyword = (wordToRemove) => {
    setKeywords(keywords.filter(word => word !== wordToRemove));
  };

  const validateJobData = () => {
    if (!jobData.title || !jobData.department || !jobData.workSchedule || !jobData.workSetup || !jobData.employmentType) {
      setError('All fields are required.');
      return false;
    }
    if (jobData.description.some(item => !item.trim()) || jobData.description.length === 0) {
      setError('Description cannot be empty.');
      return false;
    }
    if (keyResponsibilities.some(item => !item.trim()) || keyResponsibilities.length === 0) {
      setError('Key responsibilities cannot be empty.');
      return false;
    }
    if (qualifications.some(item => !item.trim()) || qualifications.length === 0) {
      setError('Qualifications cannot be empty.');
      return false;
    }
    if (whatWeOffer.some(item => !item.trim()) || whatWeOffer.length === 0) {
      setError('What we offer cannot be empty.');
      return false;
    }
    const totalPoints = gradedQualifications.reduce((sum, qual) => sum + (qual.points || 0), 0);
    if (totalPoints > 20) {
      setError('Total graded qualifications points cannot exceed 20.');
      return false;
    }
    if (threshold < 0 || threshold > 15) {
      setError('Threshold must be between 0 and 15.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateJobData()) return;

    try {
      const response = await axios.post('http://localhost:5000/jobs', {
        title: jobData.title,
        department: jobData.department,
        workSchedule: jobData.workSchedule,
        workSetup: jobData.workSetup,
        employmentType: jobData.employmentType,
        description: jobData.description,
        keyResponsibilities,
        qualifications,
        whatWeOffer,
        keywords,
        gradedQualifications,
        threshold,
      });
      setJobs([...jobs, response.data.job]);
      setShowAddJob(false);
      setCriteriaPage(1);
      setJobData({
        title: '',
        department: '',
        workSchedule: '',
        workSetup: '',
        employmentType: '',
        description: [''],
      });
      setKeyResponsibilities(['']);
      setQualifications(['']);
      setWhatWeOffer(['']);
      setKeywords([]);
      setGradedQualifications([{ attribute: '', points: 0 }]);
      setThreshold(10);
      setError('');
    } catch (err) {
      console.error('Error submitting job:', err);
      setError(err.response?.data?.message || 'Failed to create job.');
    }
  };

  const handlePrevPage = () => {
    setCriteriaPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCriteriaPage(prev => Math.min(6, prev + 1));
  };

  const handleKeyDown = (e) => {
    if (!showAddJob) return;
    if (e.key === 'ArrowLeft' && criteriaPage > 1) {
      handlePrevPage();
    } else if (e.key === 'ArrowRight' && criteriaPage < 6) {
      handleNextPage();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [criteriaPage, showAddJob]);

  const WordButton = ({ word, onRemove }) => (
    <div className='wordbutton'>
      {word}
      <button onClick={() => onRemove(word)} style={{ marginLeft: '5px', color: 'red' }}>X</button>
    </div>
  );

  return (
    <div className='setcriteriacontainer'>
      <nav>
        <h1>Collectius</h1>
      </nav>
      <div className='setcriteriacomponents'>
        <div className='setcriteriamenu'>
          <button onClick={() => setShowAddJob(true)}>Add New Job</button>
        </div>
        <div className='setcriteriajobs'>
          {jobs.map(job => (
            <div key={uuidv4()} className='jobinstance'>
              <h3>{job.title}</h3>
              <p>Department: {job.department}</p>
              <p>Schedule: {job.workSchedule}</p>
              <p>Setup: {job.workSetup}</p>
              <p>Type: {job.employmentType}</p>
            </div>
          ))}
        </div>
      </div>
      {showAddJob && (
        <div className='addjobcontainer'>
          {criteriaPage === 1 && (
            <div className='page1'>
              <h1>Add New Job</h1>
              <label>Job Title</label>
              <input
                type='text'
                value={jobData.title}
                onChange={(e) => handleInputChange(e, 'title')}
                placeholder='Enter job title'
              />
              <label>Department</label>
              <Select
                options={departmentOptions}
                onChange={(option) => handleSelectChange(option, 'department')}
                placeholder='Select department'
              />
              <label>Work Schedule</label>
              <Select
                options={workScheduleOptions}
                onChange={(option) => handleSelectChange(option, 'workSchedule')}
                placeholder='Select work schedule'
              />
              <label>Work Setup</label>
              <Select
                options={workSetupOptions}
                onChange={(option) => handleSelectChange(option, 'workSetup')}
                placeholder='Select work setup'
              />
              <label>Employment Type</label>
              <Select
                options={employmentTypeOptions}
                onChange={(option) => handleSelectChange(option, 'employmentType')}
                placeholder='Select employment type'
              />
              <label>Description</label>
              {jobData.description.map((desc, index) => (
                <div className='descriptioncontainer' key={index}>
                  <input
                    type='text'
                    value={desc}
                    onChange={(e) => {
                      const newDesc = [...jobData.description];
                      newDesc[index] = e.target.value;
                      setJobData({ ...jobData, description: newDesc });
                    }}
                    placeholder='Enter description'
                  />
                  {index > 0 && (
                    <div className='removebuttonwrap'>
                      <a onClick={() => handleRemoveItem(index, setJobData, jobData.description, { ...jobData, description: jobData.description.filter((_, i) => i !== index) })}>
                        Remove
                      </a>
                    </div>
                  )}
                </div>
              ))}
              <div className='addbuttonwrap'>
                <a onClick={() => handleAddItem(setJobData, jobData.description, { ...jobData, description: [...jobData.description, ''] })}>
                  +
                </a>
              </div>
            </div>
          )}
          {criteriaPage === 2 && (
            <div className='page2'>
              <h1>Key Responsibilities</h1>
              {keyResponsibilities.map((resp, index) => (
                <div className='descriptioncontainer' key={index}>
                  <input
                    type='text'
                    value={resp}
                    onChange={(e) => handleItemChange(index, e.target.value, setKeyResponsibilities, keyResponsibilities)}
                    placeholder='Enter responsibility'
                  />
                  {index > 0 && (
                    <div className='removebuttonwrap'>
                      <a onClick={() => handleRemoveItem(index, setKeyResponsibilities, keyResponsibilities)}>Remove</a>
                    </div>
                  )}
                </div>
              ))}
              <div className='addbuttonwrap'>
                <a onClick={() => handleAddItem(setKeyResponsibilities, keyResponsibilities)}>+</a>
              </div>
            </div>
          )}
          {criteriaPage === 3 && (
            <div className='page3'>
              <h1>Qualifications</h1>
              {qualifications.map((qual, index) => (
                <div className='descriptioncontainer' key={index}>
                  <input
                    type='text'
                    value={qual}
                    onChange={(e) => handleItemChange(index, e.target.value, setQualifications, qualifications)}
                    placeholder='Enter qualification'
                  />
                  {index > 0 && (
                    <div className='removebuttonwrap'>
                      <a onClick={() => handleRemoveItem(index, setQualifications, qualifications)}>Remove</a>
                    </div>
                  )}
                </div>
              ))}
              <div className='addbuttonwrap'>
                <a onClick={() => handleAddItem(setQualifications, qualifications)}>+</a>
              </div>
            </div>
          )}
          {criteriaPage === 4 && (
            <div className='page4'>
              <h1>What We Offer</h1>
              {whatWeOffer.map((offer, index) => (
                <div className='descriptioncontainer' key={index}>
                  <input
                    type='text'
                    value={offer}
                    onChange={(e) => handleItemChange(index, e.target.value, setWhatWeOffer, whatWeOffer)}
                    placeholder='Enter offer'
                  />
                  {index > 0 && (
                    <div className='removebuttonwrap'>
                      <a onClick={() => handleRemoveItem(index, setWhatWeOffer, whatWeOffer)}>Remove</a>
                    </div>
                  )}
                </div>
              ))}
              <div className='addbuttonwrap'>
                <a onClick={() => handleAddItem(setWhatWeOffer, whatWeOffer)}>+</a>
              </div>
            </div>
          )}
          {criteriaPage === 5 && (
            <div className='page5'>
              <h1>Preview Job Details</h1>
              <h3>{jobData.title}</h3>
              <p><strong>Department:</strong> {jobData.department}</p>
              <p><strong>Work Schedule:</strong> {jobData.workSchedule}</p>
              <p><strong>Work Setup:</strong> {jobData.workSetup}</p>
              <p><strong>Employment Type:</strong> {jobData.employmentType}</p>
              <p><strong>Description:</strong></p>
              <ul>
                {jobData.description.map((desc, index) => (
                  <li key={index}>{desc}</li>
                ))}
              </ul>
              <p><strong>Key Responsibilities:</strong></p>
              <ul>
                {keyResponsibilities.map((resp, index) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>
              <p><strong>Qualifications:</strong></p>
              <ul>
                {qualifications.map((qual, index) => (
                  <li key={index}>{qual}</li>
                ))}
              </ul>
              <p><strong>What We Offer:</strong></p>
              <ul>
                {whatWeOffer.map((offer, index) => (
                  <li key={index}>{offer}</li>
                ))}
              </ul>
              <p><strong>Keywords:</strong> {keywords.join(', ')}</p>
              <p><strong>Graded Qualifications:</strong></p>
              <ul>
                {gradedQualifications.map((qual, index) => (
                  <li key={index}>{qual.attribute}: {qual.points} points</li>
                ))}
              </ul>
              <p><strong>Threshold:</strong> {threshold}</p>
              <button onClick={handleSubmit}>Submit Job</button>
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
          )}
          {criteriaPage === 6 && (
            <div className='page6'>
              <h1>Customize Criteria</h1>
              <div className="keywords-textarea">
                <label>Which words to look out for in the applicant's resume?</label>
                <div style={{ display: 'flex', padding: '10px', backgroundColor: 'white', flexWrap: 'wrap' }}>
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
                <label>Attribute</label>
                <label>Points (out of 20)</label>
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
                      onChange={(e) => handleGradedQualificationChange(idx, 'points', e.target.value)}
                      min="0"
                      max="20"
                      placeholder="Points"
                    />
                    {idx > 0 && (
                      <div className='removebuttonwrap'>
                        <a onClick={() => handleRemoveGradedQualification(idx)}>-</a>
                      </div>
                    )}
                  </div>
                ))}
                <div className='addbuttonwrap'>
                  <a onClick={handleAddGradedQualification}>+</a>
                </div>
                <label>Score Threshold (0-15)</label>
                <input
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(Math.min(15, Math.max(0, Number(e.target.value))))}
                  min="0"
                  max="15"
                  placeholder="Enter threshold"
                />
              </div>
            </div>
          )}
          <div className='navigationbuttons'>
            <button onClick={handlePrevPage} disabled={criteriaPage === 1}>
              Previous
            </button>
            <button onClick={handleNextPage} disabled={criteriaPage === 6}>
              Next
            </button>
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default SetCriteria;