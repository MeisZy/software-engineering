  //when using useNavigate, add your component here first. -rzg

  import { Routes, Route } from 'react-router-dom';
  import AdminHome from './components/AdminHome.jsx';
  import HomePage from './components/HomePage.jsx';
  import Registration from './components/Registration.jsx';
  import UserHome from './components/UserHome.jsx';
  import Questions from './components/Questions.jsx'
  import ForgotPassword from './components/ForgotPassword.jsx';
  import Authenticator from './components/Authenticator.jsx';
  import SetCriteria from './components/SetCriteria.jsx';
  import AdminMaintainance from './components/AdminMaintainance.jsx';
  import Help from './components/Help.jsx';
  import NewPass from './components/NewPass.jsx';
  import About from './components/About/About.jsx';
  import './App.css';

  function App() {
    return (
      <>
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/adminhome" element={<AdminHome />} />
            <Route path="/userhome" element={<UserHome />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/authenticator" element={<Authenticator />} />
            <Route path="/setcriteria" element={<SetCriteria />} />
            <Route path="/adminmaintainance" element={<AdminMaintainance />} />
            <Route path="/help" element={<Help />} />
            <Route path="/newpass" element={<NewPass />} />
            <Route path="/about" element={<About />} />

          </Routes>
      </>
    );
  }

  export default App;
