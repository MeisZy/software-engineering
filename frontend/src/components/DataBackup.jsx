import React from 'react'
import {useNavigate} from 'react-router-dom'
import "./DataBackup.css"


function DataBackup() {
  
  const navigate = useNavigate();

  const handleHomePage = () => {
    navigate('/');
  };

  return (
    <>
        <nav>
            <a onClick={handleHomePage}>Collectius  </a>
        </nav>
        <div className='maintainanceleftcomp'>
            <li onClick={handleHomePage}>Back</li>
        </div>

    </>
  )
}

export default DataBackup;