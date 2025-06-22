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

  // Fetch profile picture from localStorage on component mount
  useEffect(() => {
    const storedPic = localStorage.getItem("profilePic");
    setProfilePic(storedPic || null);
  }, []);

  // Helper function to calculate age
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

  // Helper function to determine email display
  const getEmailDisplay = () => {
    if (!userEmail) return "Please log in";

    const hasFirstName = profileData?.firstName?.trim();
    const hasMiddleName = profileData?.middleName?.trim();
    const hasLastName = profileData?.lastName?.trim();

    if (!hasFirstName && !hasMiddleName && !hasLastName) {
      if (userEmail.toLowerCase().endsWith("@gmail.com")) {
        return userEmail.split("@")[0];
      }
    }

    return userEmail;
  };

  // Fetch profile and applicant data
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

      console.log("Profile response:", profileRes.data);
      console.log("Applicant response:", applicantRes.data);
      console.log("Resume data:", applicantRes.data?.resume);
      console.log("Expected file path:", applicantRes.data?.resume?.filePath ? `http://localhost:5173${applicantRes.data.resume.filePath}` : "No file path");

      setProfileData(profileRes.data || null);
      setApplicantData(applicantRes.data || null);
      setUploadError(null);
      setFileAccessible(null); // Reset accessibility check
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setUploadError("Failed to load profile data. Please try again.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [userEmail, navigate]);

  // Verify file accessibility
  useEffect(() => {
    if (applicantData?.resume?.filePath) {
      const url = `http://localhost:5173${applicantData.resume.filePath}`;
      console.log("Verifying file at:", url);

      fetch(url, { method: "HEAD" })
        .then((res) => {
          console.log(`File accessibility check: HTTP ${res.status} ${res.statusText}`);
          setFileAccessible(res.ok);
          if (!res.ok) {
            console.error(`File not accessible: HTTP ${res.status} ${res.statusText}`);
          }
        })
        .catch((err) => {
          console.error("File accessibility check failed:", err);
          setFileAccessible(false);
        });
    } else {
      console.log("No resume file path, setting fileAccessible to null");
      setFileAccessible(null);
    }
  }, [applicantData?.resume?.filePath]); // Depend on filePath to re-check on change

  // Handle file upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setUploadError("No file selected");
      return;
    }

    // Validate file type client-side
    if (file.type !== "application/pdf") {
      setUploadError("Only PDF files are allowed");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("email", userEmail);

    try {
      const res = await axios.post("http://localhost:5000/upload-resume", formData);
      console.log("Upload response:", res.data);
      console.log("Uploaded file path:", res.data.resume?.filePath);

      setUploadError(null);
      await fetchData(); // Refresh data after upload
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError(err.response?.data?.message || "Failed to upload file. Please try again.");
    }
  };

  // Manual refresh data
  const handleRefresh = () => {
    console.log("Refreshing data for email:", userEmail);
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
              fileAccessible === true ? (
                <div className="resume-display">
                  <iframe
                    key={applicantData.resume.filePath} // Force re-render on path change
                    src={`http://localhost:5173${applicantData.resume.filePath}?t=${Date.now()}`} // Cache-busting
                    title="Resume Preview"
                    style={{ width: "100%", height: "500px", border: "1px solid #ccc" }}
                  />
                </div>
              ) : fileAccessible === false ? (
                <p className="error">File not accessible. Please re-upload your resume.</p>
              ) : (
                <p>Checking file availability...</p>
              )
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