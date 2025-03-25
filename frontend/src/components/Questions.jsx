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
            <p>I forgot my password. How can I reset it?
            Click the “Forgot Password” link on the login page, enter your email, and follow the instructions to reset your password</p>
            <p>The system is not letting me upload my resume. What should I do?
Ensure your resume is in the required format (e.g., PDF, DOCX)
Check the file size limit
Try using a different browser or device
If the issue persists, contact the company’s HR support</p>
            <p></p>
            <p></p>
            <p></p>
            <p></p>
        </nav>
    </>
  )
}

export default Questions;