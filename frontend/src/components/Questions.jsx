import React, { useState } from 'react';
import './Questions.css';
import './userProfile.css';
import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom";

function Questions() {
  const [selectedSection, setSelectedSection] = useState('section1');
  const navigate = useNavigate();

  const handleHelp = () => {
    navigate('/help');
  }

  const textSections = {
    section1: {
      title: "Frequently Asked Questions",
      body: (
        <>
          <p>What is React?</p>
          <p>React is a JavaScript library for building user interfaces.</p>
          <p>How do I create a component?</p>
          <p>You can create a component using a JavaScript function or a class.</p>
          <p>What is JSX?</p>
          <p>JSX is a syntax extension for JavaScript that looks similar to HTML.</p>
          <p>What is React?</p>
          <p>React is a JavaScript library for building user interfaces.</p>
          <p>How do I create a component?</p>
          <p>You can create a component using a JavaScript function or a class.</p>
          <p>What is JSX?</p>
          <p>JSX is a syntax extension for JavaScript that looks similar to HTML.</p>
          <p>What is React?</p>
          <p>React is a JavaScript library for building user interfaces.</p>
          <p>How do I create a component?</p>
          <p>You can create a component using a JavaScript function or a class.</p>
          <p>What is JSX?</p>
          <p>JSX is a syntax extension for JavaScript that looks similar to HTML.</p>
          <p>What is React?</p>
          <p>React is a JavaScript library for building user interfaces.</p>
          <p>How do I create a component?</p>
          <p>You can create a component using a JavaScript function or a class.</p>
          <p>What is JSX?</p>
          <p>JSX is a syntax extension for JavaScript that looks similar to HTML.</p>
        </>
      ),
    },
    section2: {
      title: "User Guides",
      body: (
        <>
          <p>To get started with React, create a new project using Create React App.</p>
          <p>Follow the official documentation for detailed instructions.</p>
        </>
      ),
    },
    section3: {
      title: "Contact Information",
      body: (
        <>
          <p>If you have any questions, feel free to reach out to support@example.com.</p>
        </>
      ),
    },
    section4: {
      title: "User Roles",
      body: (
        <>
          <p>Admin: Full access to all features.</p>
          <p>User: Limited access to specific features.</p>
        </>
      ),
    },
  };

  return (
    <>
      <Navbar />
      <div className="Main-Container">
        <Sidebar setSelectedSection={setSelectedSection} selectedSection={selectedSection} />
        <div className="content-wrapper">
          <div className="content-box">
            <div className="text-header">
              <h2>{textSections[selectedSection].title}</h2>
            </div>
            <div className="text-body">
              {textSections[selectedSection].body}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Navbar() {
  return (
    <nav className="nav">
      <h1>Collectius</h1>
      <ul>
        <CustomLink to='/Help'>Help</CustomLink>
        <CustomLink to='/About'>About</CustomLink>
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
    </aside>
  );
}

export default Questions;