import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminMaintainance.css';
import axios from 'axios';

function AdminMaintainance() {
  const [applicants, setApplicants] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get('http://localhost:5000/applicants');
        setApplicants(response.data);
      } catch (err) {
        console.error('Error fetching applicants:', err);
        setError('Failed to load applicants.');
      }
    };
    fetchApplicants();
  }, []);

  const handleUserManagement = () => {
    navigate('/usermanagement');
  }
  const handleAdminAddAccount = () => {
    navigate('/adminaddaccount');
  }
  const handleDataBackup = () => {
    navigate('/databackup');
  }

  const handleDownload = (applicant) => {
    const jsonData = JSON.stringify(applicant, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${applicant.email.replace('@', '_').replace('.', '_')}_applicant.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <nav>
        <h1>Collectius</h1>
      </nav>
      <div className="maintainancecomponents">
        <div className='maintainanceleftcomp'>
          <li onClick={handleUserManagement}>User Management</li>
          <li>User Support</li>
          <li onClick={handleDataBackup}>Data Backup</li>
        </div>

        {/*Updated June 29, 2025*/}
        <div className='maintainancerightcomp'>
          <div className='backupcontainer'>
            <div className='backupheader'>
            
             <h2>Applicant</h2>
              <h2 style={{marginRight: '60px'}}>Operation</h2>
            </div>
            <div className='backupContent'>
            {error && <div style={{ color: 'red', padding: '16px' }}>{error}</div>}
            {applicants.length === 0 && !error && <div style={{ padding: '16px', color: '#888' }}>No applicants available.</div>}
            {applicants.map((applicant) => (
              <ul className='maintainanceinstance' key={applicant._id}>
                <label>{applicant.email}</label>

             {/* <a onClick={() => handleDownload(applicant)}>Download</a>*/}  

                  <button
                    onClick={() => handleDownload(applicant)}
                    className="download-btn"
                  >
                    Download
                  </button>
              </ul>
            ))}
             </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminMaintainance;