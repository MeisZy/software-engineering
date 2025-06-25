import React, { useState } from 'react'
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import "./Sidebar.css"



function Help({sections}) {

    const [selectedSection, setSelectedSection] = useState('section1');

const textSections = {
  section1: {
    title: "Frequently Asked Questions",
    body: (
      <>
        <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
            <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
            <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
      </>
    )
  },
  section2: {
    title: "User Guides",
    body: (
      <>
        <p>This section dives into more detail...</p>
               <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
      </>
    )
  },
  section3: {
    title: "Contact Information",
    body: (
      <>
        <p>React is a flexible...</p>
               <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
                <p>This is the first section...</p>
        <p>React makes it painless...</p>
      </>
    )
  },


  section4: {
    title: "User Roles",
    body: (
      <>
        <p>Q: What is React?</p>
        <p>A: A JavaScript library for building UIs.</p>
        <p>Q: Is it hard to learn?</p>
        <p>A: Not if you're familiar with JavaScript.</p>
      </>
    )
  }
};

  return (
<>

<Navbar/>

<>
<div className="Main-Container">
  <Sidebar 
  setSelectedSection={setSelectedSection} 
  selectedSection={selectedSection}
/>
  
    <div className="content-box">
        <div className="text-header">
                <h2>{textSections[selectedSection].title}</h2>
        </div>
        <div className="text-body">
        {textSections[selectedSection].body}
        </div>
    </div>

</div>

</>



</>
  );

}
export default Help
