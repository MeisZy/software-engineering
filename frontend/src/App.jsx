import AdminHome from './components/AdminHome.jsx'
//import Login from './components/Login.jsx'
import {Routes, Route} from 'react-router-dom';
import './App.css'

function App() {

  return (
    <>
     <div className='body'>
        <Routes>
          <Route path ="/" element ={<AdminHome/>}/>
        </Routes>
     </div>
    </>
  )
}

export default App
