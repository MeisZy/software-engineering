import React from 'react'
import '../userProfile.css'
import {Link, useMatch, useResolvedPath} from "react-router-dom"

function Navbar() {
  return (
  <>
    <nav className="nav">
    <h1>Collectius</h1>
      <ul>
      <CustomLink to ='/Help'>Help</CustomLink>
      <CustomLink to ='/About'>About</CustomLink>
      </ul>
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
