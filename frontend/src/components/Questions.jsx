import React from 'react';
import './Questions.css'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Questions() {
    const navigate = useNavigate();

    const handleReturn = () => {
        navigate('/userhome');
    }

  return (
    <>
        <nav>
            <a href="#" onClick={handleReturn}>Back</a>
        </nav>
        <div className='questionscontainer'>
          <div className='questionsleftcomp'>
            <ul>FAQs</ul>
            <ul>User Guides</ul>
            <ul>Contact Information</ul>
            <ul>User Roles</ul>
          </div>
          <div className='questionsrightcomp'>
            <div className='instance'>
              <h5>Frequently Asked Questions</h5>
            </div>
          </div>
        </div>
    </>
  )
}

export default Questions;