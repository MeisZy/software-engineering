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
  try {
    await axios.put('http://localhost:5000/update-applicant-status', {
      email,
      jobTitle,
      status: newStatus,
    });
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
    setError('');
  } catch (err) {
    console.error('Error updating status:', err);
    setError(err.response?.data?.message || 'Failed to update applicant status.');
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
    <a onClick={handleDownloadAll} style={{ cursor: 'pointer', color: '#13714C', textDecoration: 'none', fontWeight: '600' }}>
      Download All Applicants
    </a>
  </div>
  {error && <div style={{ color: 'red', padding: '16px' }}>{error}</div>}
  {applicants.length === 0 && !error && (
    <div style={{ padding: '16px', color: '#888' }}>No applicants available.</div>
  )}
<table style={{ width: '1200px', borderCollapse: 'collapse', marginTop: '16px',marginLeft:'50px' }}>
  <thead>
    <tr>
      <th style={{ padding: '8px', border: '1px solid #13714C' }}>Email</th>
      <th style={{ padding: '8px', border: '1px solid #13714C' }}>Position Applied</th>
      <th style={{ padding: '8px', border: '1px solid #13714C' }}>Score</th>
      <th style={{ padding: '8px', border: '1px solid #13714C' }}>Status</th>
      <th style={{ padding: '8px', border: '1px solid #13714C' }}>Action</th>
    </tr>
  </thead>
  <tbody>
    {applicants.map(applicant =>
      (applicant.positionAppliedFor || []).map((pos, idx) => (
<tr key={applicant._id + pos.jobTitle}>
  <td></td>
  {idx === 0 && (
    <td rowSpan={applicant.positionAppliedFor.length} style={{ padding: '8px', border: '1px solid #13714C', verticalAlign: 'middle' }}>
      {applicant.email}
    </td>
  )}
  <td style={{ padding: '8px', border: '1px solid #13714C' }}>{pos.jobTitle}</td>
  <td style={{ padding: '8px', border: '1px solid #13714C' }}>
    {(applicant.scores && applicant.scores[pos.jobTitle]) || '-'}
  </td>
  <td style={{ padding: '8px', border: '1px solid #13714C' }}>
    <select
      value={pos.status}
      onChange={e => handleStatusChange(applicant.email, pos.jobTitle, e.target.value)}
    >
      <option value="To Next Interview">To Next Interview</option>
      <option value="Rejected">Rejected</option>
    </select>
  </td>
{idx === 0 && (
  <td rowSpan={applicant.positionAppliedFor.length} style={{ padding: '8px', border: '1px solid #13714C', verticalAlign: 'middle',marginop:'30px' }}>
  </td>
)}
{idx !== 0 && <td style={{ display: 'none' }}></td>}
      <a
        onClick={() => handleDelete(applicant.email)}
        style={{ cursor: 'pointer', color: '#13714C', textDecoration: 'underline',marginRight:'30px' }}
      >
        Delete
      </a>
</tr>
      ))
    )}
  </tbody>
</table>
</div>
        </div>
      </div>
    </>
  );
}

export default UserManagement;