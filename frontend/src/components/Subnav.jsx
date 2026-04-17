import { Link, useLocation } from 'react-router-dom'

  import AuthContext from '../context/AuthContext'
  import { useContext } from 'react'

  export default function Subnav() {
    const location = useLocation()
    const { user } = useContext(AuthContext)

    return (
      <div className="subnav">
        {user && (
          <Link to="/dashboard" className={`snb ${location.pathname === '/dashboard' ? 'active' : ''}`}>
            Dashboard
          </Link>
        )}
        <Link to="/" className={`snb ${location.pathname === '/' ? 'active' : ''}`}>
          Find a Project
        </Link>
        <Link to="/collaborators" className={`snb ${location.pathname === '/collaborators' ? 'active' : ''}`}>
          Find a Collaborator
        </Link>
        {user && (
          <Link to="/dashboard/preferences" className={`snb ${location.pathname === '/dashboard/preferences' ? 'active' : ''}`}>
            My Collaboration Preferences
          </Link>
        )}
      </div>
    )
}
