import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserManagement.css';
import axios from 'axios';

function UserManagement() {
  const [applicants, setApplicants] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        // Call fix-applicant-scores endpoint to ensure data consistency
        await axios.get('http://localhost:5000/fix-applicant-scores');
        const response = await axios.get('http://localhost:5000/applicants');
        setApplicants(response.data);
      } catch (err) {
        console.error('Error fetching applicants:', err);
        setError('Failed to load applicants.');
      }
    };
    fetchApplicants();
  }, []);

const handleStatusChange = async (email, jobTitle, newStatus) => {
  console.log('Updating status to:', newStatus); // Debug log
  try {
    const response = await axios.put('http://localhost:5000/update-applicant-status', {
      email,
      jobTitle,
      status: newStatus,
    });

    if (response.status === 200) {
      setApplicants(prev =>
        prev.map(applicant =>
          applicant.email === email
            ? {
                ...applicant,
                positionAppliedFor: applicant.positionAppliedFor.map(pos =>
                  pos.jobTitle === jobTitle ? { ...pos, status: newStatus } : pos
                ),
              }
            : applicant
        )
      );
    }
  } catch (error) {
    console.error('Error updating status:', error);
    setError('Failed to update status. Please try again.');
    setTimeout(() => setError(''), 3000);
  }
};

  const handleDelete = async (email) => {
    try {
      await axios.delete('http://localhost:5000/delete-applicant', {
        data: { email },
      });
      setApplicants((prev) => prev.filter((applicant) => applicant.email !== email));
      setError('');
    } catch (err) {
      console.error('Error deleting applicant:', err);
      setError('Failed to delete applicant.');
    }
  };

  const handleBack = () => {
    navigate('/adminmaintainance');
  };

  useEffect(() => {
    if (applicants.length) {
      console.log('Applicants:', applicants);
    }
  }, [applicants]);

  const handleDownloadAll = () => {
    const jsonData = JSON.stringify(applicants, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'all_applicants.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleDeleteJobApplication = async (email, jobTitle) => {
  try {
    await axios.put('http://localhost:5000/delete-job-application', {
      email,
      jobTitle,
    });
    setApplicants(prev =>
      prev.map(applicant =>
        applicant.email === email
          ? {
              ...applicant,
              positionAppliedFor: applicant.positionAppliedFor.filter(
                pos => pos.jobTitle !== jobTitle
              ),
            }
          : applicant
      ).filter(applicant => applicant.positionAppliedFor.length > 0)
    );
    setError('');
  } catch (err) {
    console.error('Error deleting job application:', err);
    setError('Failed to delete job application.');
  }
};

  return (
    <>
      <nav>
        <h1>Collectius</h1>
      </nav>
      <div className="usermanagementcomponents">
        <div className="usermanagementleftcomp">
          <li onClick={handleBack}>Back to Admin Maintenance</li>
        </div>
        <div className="usermanagementrightcomp">
          <div className="managementcontainer">
            <div className="managementheader">
              <a
                onClick={handleDownloadAll}
                style={{ cursor: 'pointer', color: '#13714C', textDecoration: 'none', fontWeight: '600' }}
              >
                Download All Applicants
              </a>
            </div>
    
    <div className='table-applicants'>
            {error && <div style={{ color: 'red', padding: '16px' }}>{error}</div>}
            {applicants.length === 0 && !error && (
              <div style={{ padding: '16px', color: '#888' }}>No applicants available.</div>
            )}
            <table className="table-header">
              <thead>
                <tr>
                  <th style={{ padding: '8px', border: '1px solid #13714C' }}>Email</th>
                  <th style={{ padding: '8px', border: '1px solid #13714C' }}>Position Applied</th>
                  <th style={{ padding: '8px', border: '1px solid #13714C' }}>Score</th>
                  <th style={{ padding: '8px', border: '1px solid #13714C', width: '130px' }}>Status</th>
                  <th style={{ padding: '8px', border: '1px solid #13714C', width: '120px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map(applicant =>
                 (applicant.positionAppliedFor || []).map((pos, idx) => (
                   <tr key={`${applicant._id}-${pos.jobTitle}`}>
                     {idx === 0 ? (
                   <td
                       rowSpan={applicant.positionAppliedFor.length}
                       style={{ padding: '8px', border: '1px solid #13714C', verticalAlign: 'middle',fontSize:"14px" }}
                     >
          {applicant.email}
        </td>
      ) : null}
      <td style={{ padding: '8px', border: '1px solid #13714C' }}>{pos.jobTitle}</td>
      <td style={{ padding: '8px', border: '1px solid #13714C' }}>
        {applicant.scores && applicant.scores[pos.jobTitle.trim().toLowerCase()] !== undefined
          ? applicant.scores[pos.jobTitle.trim().toLowerCase()]
          : '-'}
      </td>
<td style={{ padding: '8px', border: '1px solid #13714C', verticalAlign: 'middle' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '75px' }}>
    <select
      value={pos.status}
      onChange={e => handleStatusChange(applicant.email, pos.jobTitle, e.target.value)}
      style={{ width: '100px' }}
    >
      <option value="Accepted">Accepted</option>
      <option value="Rejected">Rejected</option>
      <option value="Pending">Pending</option>
    </select>
    <a
      onClick={() => handleDeleteJobApplication(applicant.email, pos.jobTitle)}
      style={{ cursor: 'pointer', color: '#13714C', textDecoration: 'underline' }}
    >
      Delete
    </a>
  </div>
</td>
    </tr>
  ))
)}
              </tbody>
            </table>
    </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default UserManagement;