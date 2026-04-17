import { NavLink, useLocation } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { useContext } from 'react'

export default function Subnav() {
  const location = useLocation()
  const { user } = useContext(AuthContext)

  const isProjectActive = location.pathname === '/' || location.pathname.startsWith('/projects/')
  const isCollabActive = location.pathname === '/collaborators' || location.pathname.startsWith('/collaborators/')

  return (
    <div className="subnav">
      {user && (
        <NavLink to="/dashboard" end className={({ isActive }) => `snb ${isActive ? 'active' : ''}`}>
          Dashboard
        </NavLink>
      )}
      <NavLink 
        to="/" 
        className={`snb ${isProjectActive ? 'active' : ''}`}
      >
        Find a Project
      </NavLink>
      <NavLink 
        to="/collaborators" 
        className={`snb ${isCollabActive ? 'active' : ''}`}
      >
        Find a Collaborator
      </NavLink>
      {user && (
        <NavLink to="/dashboard/preferences" className={({ isActive }) => `snb ${isActive ? 'active' : ''}`}>
          My Collaboration Preferences
        </NavLink>
      )}
    </div>
  )
}
