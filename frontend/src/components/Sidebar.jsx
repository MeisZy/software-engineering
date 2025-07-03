import React from 'react'
import "./Sidebar.css"
import { useState } from 'react';


function Sidebar({ setSelectedSection, selectedSection }) {
  return (
    <aside className="sidebarwrap">
      <div>

        <button
          className={selectedSection === "section1" ? "selected" : ""}
          onClick={() => setSelectedSection("section1")}
        >
          Frequently Ask Questions
        </button>
        <button
          className={selectedSection === "section2" ? "selected" : ""}
          onClick={() => setSelectedSection("section2")}
        >
          User Guides
        </button>
        <button
          className={selectedSection === "section3" ? "selected" : ""}
          onClick={() => setSelectedSection("section3")}
        >
          Contact Information
        </button>
        <button
          className={selectedSection === "section4" ? "selected" : ""}
          onClick={() => setSelectedSection("section4")}
        >
          User Roles
        </button>
      </div>
    </aside>
  );
}

export default Sidebar

{/*
  
       <div className='components'>
        <div className='leftcomp'>
          <h3>leftcomp</h3>
        </div>
        <div className='rightcomp'>
          <h3>rightcomp</h3>
        </div>
      </div> */}
