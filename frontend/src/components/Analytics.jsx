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

  const handleCriteria = () => {
    navigate('/setcriteria')
  }

  const reports = ["Job Acceptance Rate","Another one"];

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

          const pendingCount = applicants.filter(applicant => 
            applicant.positionAppliedFor.some(pos => pos.jobTitle === job.title && pos.status === 'Pending')
          ).length;

          return {
            title: job.title,
            accepted: acceptedCount,
            rejected: rejectedCount,
            pending: pendingCount // Add pending count
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
                  <button className='viewbutton' onClick={handleTestClick}>View</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

{isModalOpen && (
  <div className={`modal ${isModalOpen ? 'open' : ''}`}>
    <div className='modal-content'>
      <span style={{ padding: 0, margin: 0 }}>
        <h1 style={{ color: "white", margin: 0, padding: "10px", backgroundColor: "#13714C", borderRadius: "8px 8px 0 0", fontWeight:"400" }}>
          Job Acceptance Reports
        </h1>
      </span>
      <span className='close' onClick={closeModal}>&times;</span>
      {loading ? (
        <p>Loading job statistics...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        jobStatistics.map((job) => (
          <div key={job.title} style={{ marginBottom: '30px' }}>
            <a className='redirectcriteria' onClick={handleCriteria}>{job.title}</a>
            <div className='chartwrapper'>
              <PieChart
                series={[{
                  data: [
                    { id: 0, value: job.accepted, label: 'Accepted', color: '#4CAF50' },
                    { id: 1, value: job.rejected, label: 'Rejected', color: '#F44336' },
                    { id: 2, value: job.pending, label: 'Pending', color: '#FF9800' }
                  ],
                  innerRadius: 30,
                  outerRadius: 100,
                  paddingAngle: 5,
                  cornerRadius: 0,
                }]}
                width={200}
                height={200}
                slotProps={{
                  legend: { hidden: false },
                  tooltip: {
                    trigger: 'item',
                    itemContent: {
                      style: {
                        maxWidth: '150px',
                        whiteSpace: 'normal',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }
                    }
                  }
                }}
              />
            </div>
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