import Placeholder from '../components/images/pfp_placeholder.png';
import './UserHome.css';

function UserHome() {
  return (
    <>
      <nav>
        <img src={Placeholder} alt="Profile" />
        <a>Admin</a>
        <a>Message</a>
        <a>Community</a>
        <a>FAQs</a>
      </nav>
      <div className='proper'>
        <div className='container'>
          <h4>Human Resources</h4>
          <div className='joblength'>Part-time</div>
          <p className='jobdescription'>
          We are seeking a creative and talented Graphic Designer to join our dynamic team. As a Graphic Designer, you will be responsible for creating visually stunning designs that effectively communicate our brand message across various platforms. You will work closely with our marketing and product teams to develop engaging graphics for digital and print media.
          </p>
          <div className='moreinfo'>
            <div className='infobutton'>
              <a href=''>Details</a>
              </div>
          </div>
        </div>
        <div className='container'> 
          <h4>Recruiter</h4>
          <div className='joblength'>Full-time</div>
          <p className='jobdescription'>
          We are seeking a creative and talented Graphic Designer to join our dynamic team. As a Graphic Designer, you will be responsible for creating visually stunning designs that effectively communicate our brand message across various platforms. You will work closely with our marketing and product teams to develop engaging graphics for digital and print media.
            </p>
        </div>
      </div>
    </>
  );
}

export default UserHome;
