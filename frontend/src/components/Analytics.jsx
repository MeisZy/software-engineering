import './Analytics.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PieChart } from '@mui/x-charts/PieChart';

function Analytics() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobStatistics, setJobStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleBack = () => {
    navigate('/adminhome');
  };

  const reports = [
    "Job Acceptance Rate"
  ];

  const handleTestClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchJobStatistics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/jobs');
        const jobs = response.data;

        const statistics = await Promise.all(jobs.map(async (job) => {
          const applicantsResponse = await axios.get(`http://localhost:5000/applicants`);
          const applicants = applicantsResponse.data;

          const acceptedCount = applicants.filter(applicant => 
            applicant.positionAppliedFor.some(pos => pos.jobTitle === job.title && pos.status === 'Accepted')
          ).length;

          const rejectedCount = applicants.filter(applicant => 
            applicant.positionAppliedFor.some(pos => pos.jobTitle === job.title && pos.status === 'Rejected')
          ).length;

          return {
            title: job.title,
            accepted: acceptedCount,
            rejected: rejectedCount,
          };
        }));

        setJobStatistics(statistics);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching job statistics:', error);
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };

    fetchJobStatistics();
  }, []);

  return (
    <>
      <nav>
        <a onClick={handleBack}>Collectius</a>
      </nav>
      <div className='reportscomponents'>
        <div className='statsboard'>
          <div className='statswrap'>
            {reports.map((report, index) => (
              <div key={index} className='statsinstance'>
                <div className='gridoption'>
                  {report} Report
                  <button className='viewbutton' onClick={handleTestClick}>test</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className='modal'>
          <div className='modal-content' style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <span><h1 style={{ color: "black" }}>Job Acceptance Reports</h1></span>
            <span className='close' onClick={closeModal}>&times;</span>
            {loading ? (
              <p>Loading job statistics...</p>
            ) : error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : (
              jobStatistics.map((job) => (
                <div key={job.title}>
                  <h3>{job.title}</h3>
                  <p>Accepted: {job.accepted}</p>
                  <p>Rejected: {job.rejected}</p>
                  <PieChart
                    series={[
                      { data: [job.accepted, job.rejected] }
                    ]}
                    height={290}
                    xAxis={[
                      { data: ['Accepted', 'Rejected'] }
                    ]}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Analytics;