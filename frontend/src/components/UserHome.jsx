import { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios
import { useNavigate } from 'react-router-dom';
import './UserHome.css';

function UserHome() {
  const [userName, setUserName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [jobOpenings, setJobOpenings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('userName');
    const storedPic = localStorage.getItem('profilePic');
    if (storedUser) {
      setUserName(storedUser);
      setProfilePic(storedPic);
    } else {
      navigate('/');
    }
    fetchJobs();
  }, [navigate]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/jobs'); // Endpoint to retrieve jobs
      setJobOpenings(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  return (
    <>
      <div className='jobscontainer'>
        {jobOpenings.map(job => (
          <div className='jobscardwrapper' key={job.title}>
            <div className="jobcard">
              <h2>{job.title}</h2>
              <p><b>Department:</b> {job.department}</p>
              <p><b>Work Schedule:</b> {job.workSchedule}</p>
              <p><b>Work Setup:</b> {job.workSetup}</p>
              <p><b>Employment Type:</b> {job.employmentType}</p>
              <p><b>Description:</b> {job.description.join(', ')}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default UserHome;