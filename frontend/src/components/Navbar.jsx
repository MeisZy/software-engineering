import React from 'react'
import './userProfile.css'
import {Link, useMatch, useResolvedPath, useNavigate} from "react-router-dom"

function Navbar() {
  const navigate = useNavigate();

  
  return (
  <>
    <nav className="nav">
    <a>Collectius</a>
   </nav>
    </>
  )
}

function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });
  
    return (
      <li className={isActive ? "active" : ""}>
        <Link to={to} {...props}>
          {children}
        </Link>
      </li>
    );
  }

export default Navbar
