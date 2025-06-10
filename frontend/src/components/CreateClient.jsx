import './CreateClient.css';
import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Logo from './images/logo.png';

function CreateClient({ onAdd, onFilter }) {
  const positions = ['Software Developer', 'Cybersecurity Scrum Master', 'Network Engineer', 'Database Administrator'];
  const skillsets = ['Programming', 'Cybersecurity', 'Networking', 'Database Management'];
  const languages = ['JavaScript', 'C/C++', 'Python', 'Java', 'C', 'SQL', 'MongoDB', 'PostgreSQL', 'HTML/CSS'];

  const fileInputRef = useRef(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedSkillset, setSelectedSkillset] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState(['', '', '']);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isFilterFormVisible, setIsFilterFormVisible] = useState(false); 

  const calculateScore = (positionIndex, skillsetIndex, languages) => {
    const baseScore = 10;
    let score = baseScore;

    if (positionIndex !== skillsetIndex) {
      score -= 2;
    }

    const languageScores = {
      [positions[0]]: {
        'HTML/CSS': 3,
        'Python': 2,
        'Java': 1,
      },
      [positions[1]]: {
        'Python': 3,
        'C/C++': 2,
        'C': 1,
      },
      [positions[2]]: {
        'C/C++': 3,
        'C': 2,
        'Python': 1,
      },
      [positions[3]]: {
        'SQL': 3,
        'MongoDB': 2,
        'PostgreSQL': 1,
      }
    };

    languages.forEach(language => {
      const positionScores = languageScores[positions[positionIndex]];
      score += positionScores[language] || -1; // Bonus if match, penalty if not
    });

    if (positionIndex !== skillsetIndex && score === baseScore) {
      score = 7.5;
    }

    return score;
  };

  const handleAdd = async () => {
    if (!name || !selectedPosition || !selectedSkillset || selectedLanguages.some(lang => !lang) || !email) {
      alert('Please fill in all fields.');
      return;
    }
  
    // Check for duplicate languages
    const uniqueLanguages = [...new Set(selectedLanguages)];
    if (uniqueLanguages.length !== selectedLanguages.length) {
      alert('Duplicate entries found.');
      return;
    }
  
    const positionIndex = positions.indexOf(selectedPosition);
    const skillsetIndex = skillsets.indexOf(selectedSkillset);
    const score = calculateScore(positionIndex, skillsetIndex, selectedLanguages);
  
    const instance = {
      name,
      email,
      position: selectedPosition,
      skillset: selectedSkillset,
      languages: selectedLanguages.filter(lang => lang !== ''),
      score,
    };
  
    try {
      // Check if the name already exists
      const nameExistsResponse = await axios.get('http://localhost:5000/checkName/${name}');
      if (nameExistsResponse.data.exists) {
        alert(`Applicant with name '${name}' already exists.`);
        return; // Exit function if name exists
      }
  
      // Proceed to add the applicant
      const addResponse = await axios.post('http://localhost:5000/add', { instance });
      onAdd();
  
      // Check if server responded with a duplicate name error
      if (addResponse.data && addResponse.data.message) {
        alert(addResponse.data.message);
        return; // Exit function if there's an error
      }
  
      try {
        const existingData = JSON.parse(await readFile('./applicants.json', 'utf-8')) || [];
        existingData.push(instance);
        await writeFile('./applicants.json', JSON.stringify(existingData, null, 2));
      } catch (err) {
        console.error('Error writing to JSON file:', err);
      }
  
      setName('');
      setEmail('');
      setSelectedPosition('');
      setSelectedSkillset('');
      setSelectedLanguages(['', '', '']);
      setIsFormVisible(false); // Hide the form after adding an applicant
    } catch (err) {
      console.error('Error adding applicant:', err);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const applicants = JSON.parse(e.target.result);
        for (const applicant of applicants) {                                 
          const { position, skillset, languages, email } = applicant;
          const positionIndex = positions.indexOf(position);
          const skillsetIndex = skillsets.indexOf(skillset);
          const score = calculateScore(positionIndex, skillsetIndex, languages);

          const applicantWithScore = { ...applicant, score };

          try {
            await axios.post('http://localhost:5000/add', { instance: applicantWithScore });
            onAdd();
          } catch (error) {
            console.error('Error adding applicant:', error);
          }
        }
        window.location.reload();
      } catch (err) {
        console.error('Error parsing applicants file:', err);
      }
    };
    reader.readAsText(file);
  };

  const handleClear = async () => {
    try {
      await axios.delete('http://localhost:5000/clear');
      onFilter();
    } catch (err) {
      console.error('Error clearing applicants:', err);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleFilterFormToggle = () => {
    setIsFilterFormVisible(!isFilterFormVisible);
  };

  const handleFilter = () => {
    const position = selectedPosition || null; // Use null to fetch all if no position selected
    onFilter(position);
    setIsFilterFormVisible(false); // Close filter form after applying filter
  };

  const handleLanguageChange = (index, value) => {
    const updatedLanguages = [...selectedLanguages];
    updatedLanguages[index] = value;
    setSelectedLanguages(updatedLanguages);
  };

  const handleCustomAddClick = () => {
    setIsFormVisible(!isFormVisible); // Toggle form visibility
  };

  const handleCloseForm = () => {
    setIsFormVisible(false); // Close the form
  };

  return (
    <>
      <nav className="nav">
        <div className="sorter">
          <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"><img src={Logo} alt="Logo" className="logo"/></a>
          <a>SE prototype</a>
        </div>
        <div className="navlinks">
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImport}
          />

          <a href="#" onClick={handleCustomAddClick}>
            Custom Add
          </a>

          <a href="#" onClick={() => fileInputRef.current.click()}>
            Import Applicants
          </a>

          <a href="#" onClick={handleClear}>
            Clear List
          </a>

          <a href="#" onClick={handleFilterFormToggle}>
            Filter
          </a>
          <a href="#" onClick={handleFilterFormToggle}>
            Set Criteria
          </a>
        </div>
      </nav>

      {isFilterFormVisible && (
        <div className="filter-form">
          <h2>Filter Applicants</h2>
          <div className="formgroup">
            <label htmlFor="filter-position">Position:</label>
            <select id="filter-position" value={selectedPosition} onChange={(e) => setSelectedPosition(e.target.value)}>
              <option value="">-- Select Position --</option>
              {positions.map((position, index) => (
                <option key={index} value={position}>{position}</option>
              ))}
            </select>
          </div>

          <div className="formgroup">
            <label htmlFor="filter-skillset">Skillset:</label>
            <select id="filter-skillset" value={selectedSkillset} onChange={(e) => setSelectedSkillset(e.target.value)}>
              <option value="">-- Select Skillset --</option>
              {skillsets.map((skillset, index) => (
                <option key={index} value={skillset}>{skillset}</option>
              ))}
            </select>
          </div>

          <div className="formgroup">
            <label>Language Priorities:</label>
            <div className="language-priorities">
              {Array.from({ length: 3 }).map((_, index) => (
                <select key={index} value={selectedLanguages[index]} onChange={(e) => handleLanguageChange(index, e.target.value)}>
                  <option value="">-- Select Language --</option>
                  {languages.map((language, idx) => (
                    <option key={idx} value={language}>{language}</option>
                  ))}
                </select>
              ))}
            </div>
          </div>

          <a href="#" className="filter-button" onClick={handleFilter}>
            Apply Filter
          </a>
        </div>
      )}

      {isFormVisible && (
        <div className='appendform'>
          <div className="addapplicantform" style={{ zIndex: 4 }}>
            <h2>Insert Applicant <a href="#" className="close-form-link" onClick={handleCloseForm} style={{fontSize:'10px'}}>X</a></h2>
            <div className="formgroup">
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="formgroup">
              <label htmlFor="email">Email:</label>
              <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="formgroup">
              <label htmlFor="position">Position:</label>
              <select id="position" value={selectedPosition} onChange={(e) => setSelectedPosition(e.target.value)}>
                <option value=""/>
                {positions.map((position, index) => (
                  <option key={index} value={position}>{position}</option>
                ))}
              </select>
            </div>

            <div className="formgroup">
              <label htmlFor="skillset">Skillset:</label>
              <select id="skillset" value={selectedSkillset} onChange={(e) => setSelectedSkillset(e.target.value)}>
                <option value=""/>
                {skillsets.map((skillset, index) => (
                  <option key={index} value={skillset}>{skillset}</option>
                ))}
              </select>
            </div>

            <a href="#" className="add-applicant-button" onClick={handleAdd}>
              Add Applicant
            </a>
          </div>
        </div>
      )}
    </>
  );
}

CreateClient.propTypes = {
  onAdd: PropTypes.func.isRequired,
  onFilter: PropTypes.func.isRequired,
};

export default CreateClient;