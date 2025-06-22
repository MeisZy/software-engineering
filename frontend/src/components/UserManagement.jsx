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

    const handleStatusChange = async (email, newStatus) => {
      try {
        const response = await axios.put('http://localhost:5000/update-applicant-status', {
          email,
          status: newStatus,
        });
        setApplicants((prev) =>
          prev.map((applicant) =>
            applicant.email === email ? { ...applicant, status: newStatus } : applicant
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
            <div className="managementheader"></div>
            {error && <div style={{ color: 'red', padding: '16px' }}>{error}</div>}
            {applicants.length === 0 && !error && (
              <div style={{ padding: '16px', color: '#888' }}>No applicants available.</div>
            )}
            {applicants.map((applicant) => (
              <ul className="managementinstance" key={applicant._id}>
                <label>{applicant.email}</label>
                <select
                  value={applicant.status}
                  onChange={(e) => handleStatusChange(applicant.email, e.target.value)}
                >
                  <option value="To Next Interview">To Next Interview</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <a onClick={() => handleDelete(applicant.email)}>Delete</a>
              </ul>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default UserManagement;