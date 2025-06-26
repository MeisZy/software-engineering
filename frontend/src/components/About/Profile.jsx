// ...existing imports...
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import Navbar from './Navbar.jsx';

function Profile() {
  const [applicantData, setApplicantData] = useState(null);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  // Get current user's data from localStorage
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName');
  const profilePic = localStorage.getItem('profilePic');

  useEffect(() => {
    const fetchApplicantData = async () => {
      if (!userEmail) {
        setError('No user logged in. Please log in again.');
        navigate('/'); // Redirect to login if no user email
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/applicants/${userEmail}`);
        // Clean extractedSkills to remove bullets and non-word characters
        if (response.data && response.data.extractedSkills) {
          response.data.extractedSkills = response.data.extractedSkills.map(skill =>
            skill.replace(/^[•\-\u2022\s]+/, '').replace(/[^\w\s]/g, '').trim()
          ).filter(skill => skill.length > 0);
        }
        setApplicantData(response.data);
        setError('');
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
      formData.append('email', userEmail); // Ensure email is sent to associate resume

      try {
        const response = await axios.post('http://localhost:5000/upload-resume', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        // Clean extractedSkills to remove bullets and non-word characters
        if (response.data && response.data.applicant && response.data.applicant.extractedSkills) {
          response.data.applicant.extractedSkills = response.data.applicant.extractedSkills.map(skill =>
            skill.replace(/^[•\-\u2022\s]+/, '').replace(/[^\w\s]/g, '').trim()
          ).filter(skill => skill.length > 0);
        }
        setApplicantData(response.data.applicant);
        setError('');
      } catch (err) {
        console.error('Error uploading resume:', err);
        setError('Failed to upload resume. Please try again.');
      }
    } else {
      setError('Please select a valid PDF file.');
    }
  };

  const handleLogout = () => {
    // Clear localStorage to prevent data leakage
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('profilePic');
    setApplicantData(null);
    setFile(null);
    setError('');
    navigate('/'); // Redirect to login page
  };

  return (
    <>
    <Navbar/>
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-main">
          <div className="profile-left">
            {profilePic && (
              <img src={profilePic} alt="Profile" className="profile-pic" />
            )}
            <div className="profile-info">
              <h2>{userName || 'User'}</h2>
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