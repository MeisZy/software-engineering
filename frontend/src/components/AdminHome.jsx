import { useState, useEffect } from 'react';
import axios from 'axios';
import CreateClient from './CreateClient';
import ConfirmationDialog from './ConfirmationDialog';
import './AdminHome.css';


function AdminHome() {
  const [applicants, setApplicants] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchData = async (position = null) => {
    try {
      const url = position ? `http://localhost:5000/get/${position}` : 'http://localhost:5000/get';
      const response = await axios.get(url);
      const sortedApplicants = response.data.sort((a, b) => b.instance.score - a.instance.score);
      setApplicants(sortedApplicants);
    } catch (error) {
      console.error('Error fetching applicants:', error);
    }
  };

  const handleDelete = (applicant) => {
    setSelectedApplicant(applicant);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/delete/${selectedApplicant._id}`);
      setNotification(response.data.message);
      fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setShowConfirmation(false);
      setSelectedApplicant(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setSelectedApplicant(null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let timeoutId;
    if (notification) {
      timeoutId = setTimeout(() => {
        setNotification(null);
      }, 3000); // 3 seconds
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [notification]); 

  return (
    <div className="home">
      <CreateClient onAdd={fetchData} onFilter={fetchData} />

      {notification && (
        <div className="deletenotice">
          <div className='deletedialog'>{notification}</div> 
        </div>
      )}
      <div className="instances-container">
        {applicants.length === 0 ? (
          <h2>No Records</h2>
        ) : (
          applicants.map(applicant => (
            <div key={applicant._id} className="instance_applicant">
              <div className="instance_formatting">
                <p className="instance_applicantname">
                  Name: {" "}
                  <strong className={selectedApplicant && selectedApplicant._id === applicant._id ? "selected" : ""}>
                    {applicant.instance.name}
                  </strong>
                </p>
                <p className="instance_position">Position: {applicant.instance.position}</p>
                <p className="instance_skillset">Skillset: {applicant.instance.skillset}</p>
                <p className="instance_languages">Languages: {applicant.instance.languages.join(', ')}</p>
                <p className="instance_score">Score: {applicant.instance.score}</p>
                <p className="instance_email">Email: {applicant.instance.email}</p>
                <button className="instance_remove" onClick={() => handleDelete(applicant)}>Remove Applicant</button>
              </div>
            </div>
          ))
        )}
      </div>

      {showConfirmation && (
        <ConfirmationDialog
          message={`Are you sure you want to remove "${selectedApplicant.instance.name}"?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}

export default AdminHome;
