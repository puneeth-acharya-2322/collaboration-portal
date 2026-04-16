import { Link, useLocation } from 'react-router-dom'

export default function Subnav() {
  const location = useLocation()
  const isCollaborator = location.pathname === '/collaborators'

  return (
    <div className="subnav">
      <Link
        to="/"
        className={`snb ${!isCollaborator ? 'active' : ''}`}
      >
        Find a Project
      </Link>
      <Link
        to="/collaborators"
        className={`snb ${isCollaborator ? 'active' : ''}`}
      >
        Find a Collaborator
      </Link>
    </div>
  )
}
