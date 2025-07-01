import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DataBackup.css';
import axios from 'axios';

function DataBackup() {
  const [applicants, setApplicants] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch applicants
        const applicantsResponse = await axios.get('http://localhost:5000/applicants');
        setApplicants(applicantsResponse.data);

        // Fetch interviews
        const interviewsResponse = await axios.get('http://localhost:5000/interviews');
        setInterviews(interviewsResponse.data);

        // Fetch jobs
        const jobsResponse = await axios.get('http://localhost:5000/jobs');
        setJobs(jobsResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data.');
      }
    };
    fetchData();
  }, []);

  const handleAdminMaintainance = () => {
    navigate('/adminmaintainance');
  };

  const handleDownloadApplicants = () => {
    const jsonData = JSON.stringify(applicants, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'applicants.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadInterviews = () => {
    const jsonData = JSON.stringify(interviews, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'interviews.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadJobs = () => {
    const jsonData = JSON.stringify(jobs, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'jobs.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <nav>
        <a onClick={handleAdminMaintainance}>Collectius</a>
      </nav>
      <div className='maintainanceleftcomp'>
        <li onClick={handleAdminMaintainance}>Back</li>
      </div>
      <div className='maintainancerightcomp'>
        <div className='backupcontainer' style={{}} >
          <div className='backupheader'>
            <h2>Data Backup</h2>
          </div>
          <div className='backupContent'style={{marginLeft:"10px"}}>
            {error && <div style={{ color: 'red', padding: '16px' }}>{error}</div>}
            
            <h3>Applicants</h3>
            <button
              onClick={handleDownloadApplicants}
              className="download-btn"
            >
              Download Applicants
            </button>
            {applicants.length === 0 && !error && (
              <div style={{ padding: '16px', color: '#888' }}>No applicants available.</div>
            )}
            {applicants.map((applicant) => (
              <ul className='maintainanceinstance' key={applicant._id}>
                <label>{applicant.email}</label>
                <span>Positions: {(applicant.positionAppliedFor || []).map(pos => pos.jobTitle).join(', ')}</span>
              </ul>
            ))}

            <h3>Interviews</h3>
            <button
              onClick={handleDownloadInterviews}
              className="download-btn"
            >
              Download Interviews
            </button>
            {interviews.length === 0 && !error && (
              <div style={{ padding: '16px', color: '#888' }}>No interviews available.</div>
            )}
            {interviews.map((interview) => (
              <ul className='maintainanceinstance' key={interview._id}>
                <label>{interview.email} - {interview.jobTitle}</label>
                <span>Date: {new Date(interview.date).toLocaleDateString()}</span>
                <span>Type: {interview.type}</span>
                <span>Notified: {interview.notified ? 'Yes' : 'No'}</span>
              </ul>
            ))}

            <h3>Jobs</h3>
            <button
              onClick={handleDownloadJobs}
              className="download-btn"
            >
              Download Jobs
            </button>
            {jobs.length === 0 && !error && (
              <div style={{ padding: '16px', color: '#888' }}>No jobs available.</div>
            )}
            {jobs.map((job) => (
              <ul className='maintainanceinstance' key={job._id}>
                <label>{job.title}</label>
                <span>Department: {job.department}</span>
              </ul>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default DataBackup;