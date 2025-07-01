import React from 'react'
import {useNavigate} from 'react-router-dom'
import "./DataBackup.css"


function DataBackup() {
  
  const navigate = useNavigate();

  const handleAdminMaintainance = () => {
    navigate('/adminmaintainance');
  };
  return (
    <>
        <nav>
            <a onClick={handleAdminMaintainance}>Collectius  </a>
        </nav>
        <div className='maintainanceleftcomp'>
            <li onClick={handleAdminMaintainance}>Back</li>
        </div>
        <div className='maintainancerightcomp'>
            test
        </div>

    </>
  )
}

export default DataBackup;