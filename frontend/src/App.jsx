import { Routes, Route } from 'react-router-dom';
import AdminHome from './components/AdminHome.jsx';
import HomePage from './components/HomePage.jsx';
import Registration from './components/Registration.jsx';
import UserHome from './components/UserHome.jsx';
import './App.css';

function App() {
  return (
    <>
      <div className='body'>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/userhome" element={<UserHome />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
