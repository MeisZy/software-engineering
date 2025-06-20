import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import "./Profile.css";
import profilePic from "../images/image.png";
import axios from "axios";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState(null);
  const userEmail = localStorage.getItem("userEmail");
useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/applicants?email=${userEmail}`);
      console.log('Fetched data:', res.data);
      setProfileData(res.data);
    } catch (err) {
      console.error("Failed to fetch profile data", err);
    } 
  };
  console.log('userEmail:', userEmail); // Add this
  if (userEmail) {
    fetchProfile();
  } else {
    console.log('No userEmail found in localStorage');
  }
}, [userEmail]);

return (
  <>
    <Navbar />
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-main">
          <div className="profile-left">
            <img src={profilePic} alt="Profile" className="profile-pic" />
            <div className="profile-info">
              <h2>{profileData?.firstName || 'No First Name'} {profileData?.lastName || 'No Last Name'}</h2>
              <p>Email: {profileData?.email || 'No Email'}</p>
              <button className="resume-button">Resume</button>
            </div>
          </div>
          <div className="profile-right">
            <button className="edit-button">✏️</button>
            <p><strong>Age:</strong> {profileData?.birthdate ? getAge(profileData.birthdate) : 'N/A'}</p>
            <p><strong>Gender:</strong> {profileData?.gender || 'N/A'}</p>
            <p><strong>Birthday:</strong> {profileData?.birthdate?.slice(0, 10) || 'N/A'}</p>
            <p><strong>Location:</strong> {profileData?.city || 'N/A'}, {profileData?.stateProvince || 'N/A'}</p>
            <p><strong>Phone:</strong> {profileData?.mobileNumber || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  </>
);
};

export default Profile;
