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
        <div className='proper'>
          <div className='instance'>
            <p>test</p>
          </div>
        </div>
    </>
  )
}

export default Questions;