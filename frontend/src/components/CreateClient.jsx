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
          <span>Collectius</span>
        </div>
        <div className="navlinks">
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImport}
          />

          <a className="navbutton">Custom Add</a>
          <a className="navbutton" onClick={() => fileInputRef.current?.click()}>
            Import Applicants
          </a>
          <a className="navbutton">Clear List</a>
          <a className="navbutton">Filter</a>
          <a className="navbutton">Set Criteria</a>
          <a className="navbutton" onClick={handleLogout}>
            Logout
          </a>
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
