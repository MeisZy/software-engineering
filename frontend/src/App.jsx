//for design viewing, add your component here.
import AdminHome from './components/AdminHome.jsx'
import HomePage from './components/HomePage.jsx'
import Registration from './components/Registration'
import UserHome from './components/UserHome'
import {Routes, Route} from 'react-router-dom';
import './App.css'

function App() {

  return (
    <>
     <div className='body'>
        <Routes>
                                      {/*replace this with your component */}
          <Route path ="/" element ={<HomePage/>}/>
        </Routes>
     </div>
    </>
  )
}

export default App
