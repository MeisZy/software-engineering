import './HomePage.css'
import {Link} from 'react-router-dom'

function HomePage() {
  return (
    <>
      <nav className="nav">
        <div className="sorter">
          <a>Collectius</a>
        </div>
      </nav>
      <div className="components">
        <div className='leftcomp'>
         
          <p><h3 style={{fontSize: "50px"}}>New Here?</h3>
          Sign up and discover a great amount of new opportunities!</p>
          <button className='register'>Sign Up</button>
        </div>
        <div className='rightcomp'>
          <form>
          <p style={{
            fontSize: "14px",
            textAlign: "left",
            width: "100%"     
          }}>Login</p>
            <input type="text" placeholder="Email"></input>
            <input type="password" placeholder="Password"></input>
            <a href="{sample link}" style={{
              textDecoration: "none",
              color: "black",
              fontSize: "14px",
              textAlign: "center",
              display: "block"
            }}>
              Forgot Password?
            </a>
            <button className="login"><b>Login</b></button>
          </form>
        </div>
      </div>
    </> 
  )
}

export default HomePage;