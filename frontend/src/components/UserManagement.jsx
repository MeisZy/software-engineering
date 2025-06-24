import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserManagement.css';
import Placeholder from './images/pfp_placeholder.png';

const UserManagement = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('userName');
    const storedPic = localStorage.getItem('profilePic');
    if (storedUser) {
      setUserName(storedUser);
      setProfilePic(storedPic || Placeholder);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const fetchApplicants = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/applicants');
      console.log('Applicants fetched:', response.data);
      setApplicants(response.data || []);
    } catch (err) {
      console.error('Error fetching applicants:', err);
      setError('Failed to load applicants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleStatusChange = async (email, status) => {
    try {
      const response = await axios.put('http://localhost:5000/update-applicant-status', { email, status });
      console.log('Status updated:', response.data);
      setApplicants(prev =>
        prev.map(applicant =>
          applicant.email === email ? { ...applicant, status } : applicant
        )
      );
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status. Please try again.');
    }
  };

  const handleDeleteApplicant = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/applicants/${id}`);
      console.log(`Applicant ${id} deleted`);
      setApplicants(prev => prev.filter(applicant => applicant._id !== id));
    } catch (err) {
      console.error('Error deleting applicant:', err);
      setError('Failed to delete applicant. Please try again.');
    }
  };

  const handleReturn = () => {
    navigate('/adminhome');
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
          <img src={profilePic} alt="Profile" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
          <a>Manage Applicants</a>
        </div>
        <a onClick={handleReturn} style={{ cursor: 'pointer' }}>Back</a>
      </nav>
      <div className="user-management">
        <h2>Applicants</h2>
        {error && <div style={{ color: 'red', padding: '16px' }}>{error}</div>}
        {loading ? (
          <div>Loading applicants...</div>
        ) : applicants.length === 0 ? (
          <div style={{ padding: '16px', color: '#888' }}>No applicants found.</div>
        ) : (
          <div className="applicant-list">
            <div className="applicant-header">
              <div>Name</div>
              <div>Email</div>
              <div>Position</div>
              <div>Score</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            {applicants.map(applicant => (
              <div className="applicant-row" key={applicant._id}>
                <div>{applicant.fullName || 'N/A'}</div>
                <div>{applicant.email}</div>
                <div>{applicant.positionAppliedFor.join(', ') || 'N/A'}</div>
                <div>
                  {applicant.scores
                    ? Array.from(applicant.scores.entries()).map(([job, score]) => `${job}: ${score}`).join(', ')
                    : 'N/A'}
                </div>
                <div>
                  <select
                    value={applicant.status || 'To Next Interview'}
                    onChange={(e) => handleStatusChange(applicant.email, e.target.value)}
                  >
                    <option value="To Next Interview">To Next Interview</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteApplicant(applicant._id);
                    }}
                  >
                    Delete
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default UserManagement;