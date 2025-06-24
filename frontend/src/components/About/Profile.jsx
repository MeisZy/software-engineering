import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./Profile.css";
import axios from "axios";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [applicantData, setApplicantData] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [fileAccessible, setFileAccessible] = useState(null);
  const { state } = useLocation();
  const navigate = useNavigate();
  const userEmail = state?.email || localStorage.getItem("userEmail");

  useEffect(() => {
    const storedPic = localStorage.getItem("profilePic");
    setProfilePic(storedPic || null);
  }, []);

  const getAge = (birthdate) => {
    if (!birthdate) return "N/A";
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getEmailDisplay = () => {
    if (!userEmail) return "Please log in";
    return userEmail;
  };

  const fetchData = async () => {
    if (!userEmail) {
      console.error("No userEmail found, redirecting to login");
      navigate("/");
      return;
    }

    try {
      const [profileRes, applicantRes] = await Promise.all([
        axios.get(`http://localhost:5000/applied-jobs/${encodeURIComponent(userEmail)}`),
        axios.get(`http://localhost:5000/applicants/${encodeURIComponent(userEmail)}`)
      ]);
      setProfileData(profileRes.data || null);
      setApplicantData(applicantRes.data || null);
      setUploadError(null);
      setFileAccessible(null);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setUploadError("Failed to load profile data. Please try again.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [userEmail, navigate]);

  useEffect(() => {
    if (applicantData?.resume?.filePath) {
      const url = `http://localhost:5173${applicantData.resume.filePath}`;
      fetch(url, { method: "HEAD" })
        .then((res) => {
          setFileAccessible(res.ok);
        })
        .catch(() => {
          setFileAccessible(false);
        });
    } else {
      setFileAccessible(null);
    }
  }, [applicantData?.resume?.filePath]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setUploadError("No file selected");
      return;
    }

    if (file.type !== "application/pdf") {
      setUploadError("Only PDF files are allowed");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("email", userEmail);

    try {
      await axios.post("http://localhost:5000/upload-resume", formData);
      setUploadError(null);
      await fetchData();
    } catch (err) {
      setUploadError(err.response?.data?.message || "Failed to upload file. Please try again.");
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-card">
          <div className="profile-main">
            <div className="profile-left">
              <img src={profilePic || "/images/pfp_placeholder.png"} alt="Profile" className="profile-pic" />
              <div className="profile-info">
                <h2>{profileData?.fullName || "No Name"}</h2>
                <p>Email: {getEmailDisplay()}</p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  id="file-upload"
                />
                <button
                  className="resume-button"
                  onClick={() => document.getElementById("file-upload").click()}
                >
                  Upload File
                </button>
                {uploadError && <p className="error">{uploadError}</p>}
                <button
                  className="refresh-button"
                  onClick={handleRefresh}
                  style={{ marginTop: "10px", padding: "8px", cursor: "pointer" }}
                >
                  Refresh Data
                </button>
              </div>
            </div>
            <div className="profile-right">
              <button className="edit-button">✏️</button>
              <p><strong>Age:</strong> {profileData?.birthdate ? getAge(profileData.birthdate) : "N/A"}</p>
              <p><strong>Gender:</strong> {profileData?.gender || "N/A"}</p>
              <p><strong>Birthday:</strong> {profileData?.birthdate ? new Date(profileData.birthdate).toISOString().slice(0, 10) : "N/A"}</p>
              <p><strong>Location:</strong> {profileData?.city || "N/A"}, {profileData?.stateProvince || "N/A"}</p>
              <p><strong>Phone:</strong> {profileData?.mobileNumber || "N/A"}</p>
            </div>
          </div>
          <div className="preview-container">
            <h3>Resume</h3>
            {applicantData?.resume?.filePath ? (
              <>
                <p>Current resume: {applicantData.resume.originalFileName || 'Unknown'}</p>
                {fileAccessible === true ? (
                  <div className="resume-display">
                    <iframe
                      key={applicantData.resume.filePath}
                      src={`http://localhost:5173${applicantData.resume.filePath}?t=${Date.now()}`}
                      title="Resume Preview"
                      style={{ width: "100%", height: "500px", border: "1px solid #ccc" }}
                    />
                  </div>
                ) : fileAccessible === false ? (
                  <p className="error">File not accessible. Please re-upload your resume.</p>
                ) : (
                  <p>Checking file availability...</p>
                )}
                {applicantData?.extractedSkills?.length > 0 ? (
                  <div className="skills-container">
                    <h4>Extracted Skills</h4>
                    <ul>
                      {applicantData.extractedSkills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>No skills extracted from resume</p>
                )}
              </>
            ) : (
              <p>No resume uploaded</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;