import React, { useState } from 'react';
import './Questions.css';
import './userProfile.css';
import { Link, useMatch, useResolvedPath, useNavigate } from 'react-router-dom';

function Questions() {
  const [selectedSection, setSelectedSection] = useState('section1');
  const navigate = useNavigate();

  const handleAbout = () => {
    navigate('/about');
  };

  const textSections = {
    section1: {
      title: 'Frequently Asked Questions',
      body: (
        <div className= "sectiontext">
          <p><strong>What is the purpose of the Applicant Management System (AMS)?</strong></p>
          <p>The AMS is a web-based platform designed to automate and optimize the recruitment process at Collectius Philippines. It streamlines applicant screening, scoring, and interview scheduling, enhances data security, and provides data-driven insights to improve hiring decisions.</p>
          <p><strong>Who can access the AMS?</strong></p>
          <p>The system has two access levels:</p>
          <ul>
            <li><strong>Admin:</strong> Human Resource personnel who manage applicant data, set scoring criteria, schedule interviews, and generate reports.</li>
            <li><strong>Applicant:</strong> Job seekers who can create accounts, submit applications, upload resumes, and manage their profiles.</li>
          </ul>
          <p><strong>How does the AMS ensure data security?</strong></p>
          <p>The AMS includes a Security module with:</p>
          <ul>
            <li><strong>Login and Sign-Up:</strong> Requires username and password for secure access.</li>
            <li><strong>Forgot Password:</strong> Uses a one-time six-digit pin (OTP) sent via email to reset passwords.</li>
            <li><strong>User Logs:</strong> Tracks user activity to enhance security.</li>
            <li>Data is stored securely in MongoDB hosted on Atlas, reducing the risk of unauthorized access compared to spreadsheet-based systems.</li>
          </ul>
          <p><strong>What file formats are accepted for resume uploads?</strong></p>
          <p>The AMS accepts resumes in .docx and .pdf formats only. Image-based formats like .jpeg, .jpg, or .png are not supported.</p>
          <p><strong>How does the scoring system work?</strong></p>
          <p>The Scoring module uses a Distance-based Scoring Algorithm to evaluate applicants based on:</p>
          <ul>
            <li>Job title keywords.</li>
            <li>Relevant skills or qualifications.</li>
            <li>Years of experience (optional).</li>
          </ul>
          <p>The system calculates an aptitude score out of 10 by averaging scores from these criteria. Admins can set specific criteria for each job opening, and a bubble sort algorithm filters applicants based on their scores.</p>
          <p><strong>Is the AMS accessible on mobile devices?</strong></p>
          <p>No, the AMS is designed for desktop browsers only and does not support mobile responsiveness or access on smartphones and tablets.</p>
          <p><strong>Does the AMS integrate with third-party job platforms like LinkedIn or Indeed?</strong></p>
          <p>No, the AMS is a standalone system that collects first-time applications directly from applicants. It does not integrate with external recruitment platforms.</p>
          <p><strong>What happens if I forget my password?</strong></p>
          <p>Use the Forgot Password submodule in the Security module. Enter your email address to receive a six-digit OTP. After verifying the OTP, you can enter and confirm a new password, which will update your account credentials in the database.</p>
          <p><strong>How does the AMS improve the recruitment process?</strong></p>
          <p>The AMS automates:</p>
          <ul>
            <li>Resume parsing and applicant scoring.</li>
            <li>Candidate shortlisting and filtering.</li>
            <li>Interview scheduling and feedback recording.</li>
          </ul>
          <p>This reduces manual effort, minimizes errors, and speeds up the hiring process, allowing HR to focus on strategic decision-making.</p>
          <p><strong>Can admins generate reports?</strong></p>
          <p>Yes, the Report and Analysis Module allows admins to:</p>
          <ul>
            <li>Collect application data and interview feedback.</li>
            <li>Generate performance reports, custom reports, and scheduled reports for data-driven insights.</li>
          </ul>
          <p><strong>What should I do if I encounter issues with the system?</strong></p>
          <p>The Help Module provides:</p>
          <ul>
            <li><strong>FAQs and User Guides:</strong> Instructions and graphics for using the system.</li>
            <li><strong>Support Contact Information:</strong> Email-based support for applicants and admins.</li>
            <li><strong>User Roles:</strong> Explains the differences between Applicant and Admin access levels.</li>
          </ul>
          <p><strong>Does the AMS support multilingual interfaces?</strong></p>
          <p>No, the AMS does not include multilingual support as part of its base design. The interface is available in English only.</p>
          <p><strong>What is the role of the AdminHome Module?</strong></p>
          <p>The AdminHome Module includes:</p>
          <ul>
            <li><strong>User Management:</strong> Add, edit, or view user accounts.</li>
            <li><strong>Reports:</strong> Generate system and user activity reports.</li>
            <li><strong>Interview Management:</strong> Schedule and record interview feedback.</li>
            <li><strong>Filtering Applicants:</strong> Search and filter applicants by job title, skills, or experience.</li>
            <li><strong>Settings:</strong> Manage system settings and user permissions.</li>
          </ul>
          <p><strong>How can I learn more about Collectius Philippines?</strong></p>
          <p>The About Module provides company information, contact details, and legal information, accessible to all users regardless of access level.</p>
        </div>
      ),
    },
    section2: {
      title: 'User Guides',
      body: (
        <div className= "sectiontext">
          <p><strong>How to Create an Account</strong></p>
          <ol>
            <li>Click the "Sign Up" button on the top right corner.</li>
            <li>Fill in your name, email, and password.</li>
            <li>Click "Register" and check your email for verification.</li>
            <li>Log in using your new credentials.</li>
          </ol>
          <p><strong>How to Post a Comment</strong></p>
          <ol>
            <li>Log in to your account.</li>
            <li>Navigate to the article or post.</li>
            <li>Scroll down to the comment section.</li>
            <li>Type your message and click "Post Comment."</li>
          </ol>
          <p><strong>How to Change Your Profile Picture</strong></p>
          <ol>
            <li>Go to "My Profile."</li>
            <li>Click the current profile picture or the "Edit" icon.</li>
            <li>Upload a new image and save changes.</li>
          </ol>
        </div>
      ),
    },
    section3: {
      title: 'Contact Information',
      body: (
        <div className= "sectiontext">
          <p><strong>Email:</strong> philippines@collectius.com</p>
          <p><strong>Landline:</strong> +63-2-82499077</p>
          <p><strong>Mobile Phone:</strong> +63-919-0846401</p>
          <p><strong>Address:</strong> Collectius Philippines, 12/F Unit L to U, Eastwood Cyberone Building, Eastwood City Cyberpark, Brgy. Bagumbayan, Quezon City 1110, Philippines</p>
        </div>
      ),
    },
    section4: {
      title: 'User Roles',
      body: (
        <div className= "sectiontext">
          <p><strong>Admin</strong></p>
          <p>Full access to all features and settings. Can add/remove users, manage roles, and edit site content.</p>
          <p><strong>Moderator</strong></p>
          <p>Can review and moderate user-generated content. Limited access to user management.</p>
          <p><strong>Registered User</strong></p>
          <p>Can view and post content, comment, and update profile. Cannot access admin or moderation features.</p>
          <p><strong>Guest</strong></p>
          <p>Can browse public content. Cannot post, comment, or access user-only sections.</p>
        </div>
      ),
    },
  };

  return (
    <div className= "sectiontext">
      <Navbar />
      <div className="Main-Container">
        <Sidebar setSelectedSection={setSelectedSection} selectedSection={selectedSection} />
          <div className="content-box">
            <div className={`text-header ${selectedSection === 'section1' ? 'faq-header' : ''}`}>
              <h2>{textSections[selectedSection].title}</h2>
            </div>
            <div className={`text-body ${selectedSection === 'section1' ? 'faq-body' : ''}`}>
              {textSections[selectedSection].body}
            </div>
          </div>
      </div>
      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <nav className="nav">
      <a href='/userhome'>Collectius</a>
      <ul>

        <CustomLink to='/about'>About</CustomLink>
      </ul>
    </nav>
  );
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}

function Sidebar({ setSelectedSection, selectedSection }) {
  return (
    <aside className="sidebarwrap">
      <div>
        <button className={selectedSection === "section1" ? "selected" : ""} onClick={() => setSelectedSection("section1")}>
          Frequently Asked Questions
        </button>
        <button className={selectedSection === "section2" ? "selected" : ""} onClick={() => setSelectedSection("section2")}>
          User Guides
        </button>
        <button className={selectedSection === "section3" ? "selected" : ""} onClick={() => setSelectedSection("section3")}>
          Contact Information
        </button>
        <button className={selectedSection === "section4" ? "selected" : ""} onClick={() => setSelectedSection("section4")}>
          User Roles
        </button>
      </div>
    </aside>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>Follow us on social media:</p>
      <ul className="social-links">
        <li>
          <a href="https://www.facebook.com/collectiuswayofcollections" target="_blank" rel="noopener noreferrer">Facebook</a>
        </li>
        <li>
          <a href="https://twitter.com/yourwebsite" target="_blank" rel="noopener noreferrer">Twitter</a>
        </li>
        <li>
          <a href="https://instagram.com/yourwebsitehelp" target="_blank" rel="noopener noreferrer">Instagram</a>
        </li>
      </ul>
    </footer>
  );
}

export default Questions;