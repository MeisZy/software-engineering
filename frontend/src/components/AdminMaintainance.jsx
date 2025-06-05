import React from 'react'
import './AdminMaintainance.css'
function AdminMaintainance() {
  return (
    <>
      <nav>
        <h1>Collectius</h1>
      </nav>
      <div className="maintainancecomponents">
        <div className='maintainanceleftcomp'>
            <ul>User Management</ul>
            <ul>User Support</ul>{/*should open the inbox of report a problem? */}
            <ul>Data Backup</ul>
        </div>
          <div className='maintainancerightcomp'>
            <div className='backupcontainer'>
                <div className='backupheader'>
                </div>
              {/*applicant mapping */}
              <ul className='maintainanceinstance'>
                <label>Applicant</label>
                <a>download</a>
              </ul>
          </div>  
        </div>
      </div>
    </>
  )
}

export default AdminMaintainance;