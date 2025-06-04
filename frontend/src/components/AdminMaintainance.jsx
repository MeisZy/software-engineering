import React from 'react'
import './AdminMaintainance.css'
function AdminMaintainance() {
  return (
    <>
      <nav>

      </nav>
      <div className="maintainancecomponents">
        <div className='maintainanceleftcomp'>
            <ul>User Management</ul>
            <ul>User Support</ul>{/*should open the inbox of report a problem? */}
            <ul>Data Backup</ul>
        </div>
        <div className='maintainancerightcomp'>

        </div>
      </div>
    </>
  )
}

export default AdminMaintainance;