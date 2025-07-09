import './Analytics.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Analytics() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/adminhome');
  };

  const reports = [
    "Daily",
    "Weekly",
    "Monthly",
    "Annual"
  ];

  return (
    <>
      <nav>
        <a onClick={handleBack}>Collectius</a>
      </nav>
      <div className='reportscomponents'>
        <div className='statsboard'>
          <div className='statswrap'>
            {reports.map((report, index) => (
              <div key={index} className='statsinstance'>
                <div className='gridoption'>
                  {report} Report
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Analytics;