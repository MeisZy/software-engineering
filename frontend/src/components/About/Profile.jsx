import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import Navbar from './Navbar.jsx';

function Profile() {
  const [applicantData, setApplicantData] = useState(null);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [editableFields, setEditableFields] = useState({
    birthdate: '',
    gender: '',
    city: '',
    stateProvince: '',
    mobileNumber: '',
  });
  const [isEditing, setIsEditing] = useState({
    birthdate: false,
    gender: false,
    city: false,
    stateProvince: false,
    mobileNumber: false,
  });

  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName') || 'Unknown User';
  const profilePic = localStorage.getItem('profilePic');

  useEffect(() => {
    const fetchApplicantData = async () => {
      if (!userEmail) {
        setError('No user logged in. Please log in again.');
        navigate('/');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/applicants/${userEmail}`);
        if (response.data) {
          const data = response.data;
          data.extractedSkills = data.extractedSkills
            ? data.extractedSkills.map(skill => skill.replace(/^[•\-\u2022\s]+/, '').replace(/[^\w\s]/g, '').trim()).filter(skill => skill.length > 0)
            : [];
          data.fullName = data.fullName || 'Unknown User';

          setApplicantData(data);
          setEditableFields({
            birthdate: data.birthdate || '',
            gender: data.gender || '',
            city: data.city || '',
            stateProvince: data.stateProvince || '',
            mobileNumber: data.mobileNumber || '',
          });
          setError('');
        } else {
          setApplicantData(null);
          setError('No applicant data found.');
        }
      } catch (err) {
        console.error('Error fetching applicant data:', err);
        setError('Failed to load profile data. Please try again.');
        setApplicantData(null);
      }
    };

    fetchApplicantData();
  }, [userEmail, navigate]);

  const handleSendFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      const formData = new FormData();
      formData.append('resume', selectedFile);
      formData.append('email', userEmail);

      try {
        const response = await axios.post('http://localhost:5000/upload-resume', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (response.data && response.data.applicant) {
          setApplicantData(response.data.applicant);
          setError('');
        }
      } catch (err) {
        console.error('Error uploading resume:', err);
        setError('Failed to upload resume. Please try again.');
      }
    } else {
      setError('Please select a valid PDF file.');
    }
  };

  const handleToggleEdit = (field) => {
    setIsEditing(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
    if (isEditing[field]) {
      setEditableFields(prev => ({
        ...prev,
        [field]: applicantData[field] || '',
      }));
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/applicants/${userEmail}`, editableFields);
      setApplicantData(response.data);
      alert('Information updated successfully.');
      setIsEditing({
        birthdate: false,
        gender: false,
        city: false,
        stateProvince: false,
        mobileNumber: false,
      });
    } catch (err) {
      console.error('Error updating information:', err);
      setError('Failed to update information.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('profilePic');
    setApplicantData(null);
    setFile(null);
    setError('');
    navigate('/');
  };

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-card">
          <div className="profile-main">
            <div className="profile-left">
              {profilePic && <img src={profilePic} alt="Profile" className="profile-pic" />}
              <div className="profile-info">
                <h2>{applicantData?.fullName || userName}</h2>
                <p>{userEmail || 'No email available'}</p>
                <button className="resume-button" onClick={() => document.getElementById('resume-upload').click()}>
                  Upload Resume
                </button>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleSendFileChange}
                  style={{ display: 'none' }}
                />
                <button className="refresh-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
            <div className="profile-right">
              {error && <p className="error">{error}</p>}
              {file && <p>Selected file: {file.name}</p>}
              {applicantData && (
                <div className="profile-right-content">
                  <div className="fields-column">
                    {['birthdate', 'gender', 'city', 'stateProvince', 'mobileNumber'].map((field) => (
                      <div key={field} className="field-row">
                        <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>
                        <input
                          type="text"
                          value={editableFields[field] || applicantData[field] || 'Not provided'}
                          onChange={(e) => setEditableFields(prev => ({ ...prev, [field]: e.target.value }))}
                          readOnly={!isEditing[field]}
                          style={{ 
                            padding: '5px', 
                            border: isEditing[field] ? '2px solid black' : 'none', 
                            background: isEditing[field] ? '#fff' : 'transparent',
                            marginLeft: '10px',
                            width: '120px', 
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="buttons-column">
                    {['birthdate', 'gender', 'city', 'stateProvince', 'mobileNumber'].map((field) => (
                      <button
                        key={field}
                        className="edit-button"
                        onClick={() => handleToggleEdit(field)} style={{marginLeft:"20px"}}
                      >
                        {isEditing[field] ? 'Cancel' : 'Edit'}
                      </button>
                    ))}
                  </div>
                  <button className="resume-button save-button" onClick={handleSave}>Save</button>
                </div>
              )}
            </div>
          </div>
          <div className="preview-container">
            <h3>Resume Preview</h3>
            {applicantData && applicantData.resume ? (
              <div className="resume-display">
                <p>Resume: {applicantData.resume.originalFileName}</p>
                {applicantData.resume.filePath && (
                  <iframe
                    src={`http://localhost:5000${applicantData.resume.filePath}`}
                    title="Resume Preview"
                    className="resume-display"
                  />
                )}
                {applicantData.extractedSkills && applicantData.extractedSkills.length > 0 ? (
                  <div className="skills-container">
                    <h4>Extracted Skills</h4>
                    <ul>
                      {applicantData.extractedSkills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>No skills extracted from resume.</p>
                )}
              </div>
            ) : (
              <p>No resume uploaded.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;