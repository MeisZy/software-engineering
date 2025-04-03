// CreateClient.jsx
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import PropTypes from 'prop-types';
import Logo from './images/logo.png';
import './CreateClient.css';

function CreateClient({ onAdd, onFilter }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleLogout = () => navigate('/');
  const handleImport = () => console.log('Import triggered');

  return (
    <>
      <nav className="nav">
        <div className="sorter">
          <a href="/" className="logo-link">
            <img src={Logo} alt="Logo" className="logo"/>
          </a>
          <span>SE prototype</span>
        </div>
        <div className="navlinks">
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImport}
          />

          <button className="nav-button">Custom Add</button>
          <button className="nav-button" onClick={() => fileInputRef.current?.click()}>
            Import Applicants
          </button>
          <button className="nav-button">Clear List</button>
          <button className="nav-button">Filter</button>
          <button className="nav-button">Set Criteria</button>
          <button className="nav-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
    </>
  );
}

CreateClient.propTypes = {
  onAdd: PropTypes.func.isRequired,
  onFilter: PropTypes.func.isRequired,
};

export default CreateClient;
