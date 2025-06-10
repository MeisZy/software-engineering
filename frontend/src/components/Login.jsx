/*per Expected output:


  First time users are meant to first enter their intended login information through the Register module, 
  verified using a third party authenticator, then enter their credentials using the Login module.
  In case the applicant forgot their password, a verification email will be sent to them. 
  Clicking a button on the attachment email will redirect them to the ResetPassword, entering the new password, and once again redirected to the Login module.
  Upon entering their information, they are now headed to the UserHome module, where these applicants can revisit their application and upload their resume in either .docx or .pdf 
  format. Once uploaded on the same module, they can preview them as a magnifiable preview. 

   In the ApplyNow, the third option AdminLogin for the H.R. Recruiter. The AdminLogin part is not meant to be registrable. 
   Instead, the same credentials for the MongoDB database will be the same email for the recruiter. 
   The forgot password email functionality for the applicants will also work the same for the recruiter.
  After entering the proper credentials in the AdminLogin, the recruiter will now be redirected to the AdminHome.


*/
import './Login.css';

function Login() {
  return (
    <>
      <form>
        <input type="text" placeholder="Username"></input>
        <input type="password" placeholder="Password"></input>
      </form>
    </>
  )
}

export default Login;