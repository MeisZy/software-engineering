import Placeholder from '../components/images/pfp_placeholder.png'
import './UserHome.css'

function UserHome() {
  return (
    <>
    
    <nav>
        <img src={Placeholder}></img>
        <a>Admin</a>
        <a>Message</a>
        <a>Community</a>
        <a>FAQs</a>

    </nav>
      <div className='proper'>
        <div className='container'>
          <h4>Human Resources</h4>
          <div className='joblength'>Part-time</div>
          <p className='jobdescription'>Insert description here</p>
          <div className='moreinfo'>
            <button className='infobutton'>Details</button>
          </div>
        </div>
        <div className='container'> 
          <h4>Recruiter</h4>
          <div className='joblength'>Full-time</div>
          <p className='jobdescription'>another desciption here</p>
        </div>
      </div>
    </>
  )
}

export default UserHome