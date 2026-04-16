import { Link, useLocation } from 'react-router-dom'
import { LogIn, Search, Users } from 'lucide-react'

export default function Topbar() {
  const location = useLocation()
  const isCollaborator = location.pathname === '/collaborators'

  return (
    <div className="topbar">
      {/* Logo */}
      <div className="logo-box">K</div>

      {/* Brand */}
      <div>
        <div className="brand">KMC · Department of AI in Healthcare</div>
        <div className="brand-sub">FYRC — Find Your Research Collaborator Portal</div>
      </div>

      {/* Nav links */}
      <div className="topnav">
        <Link
          to="/"
          className={`tnb ${!isCollaborator ? 'active' : ''}`}
        >
          <Search size={13} />
          Find a Project
        </Link>
        <Link
          to="/collaborators"
          className={`tnb ${isCollaborator ? 'active' : ''}`}
        >
          <Users size={13} />
          Find a Collaborator
        </Link>
      </div>

      {/* Login / Register CTA */}
      <button
        className="btn btn-gold"
        style={{ marginLeft: '12px', fontSize: '12px' }}
        onClick={() => alert('Login / Registration — coming in Step 2')}
      >
        <LogIn size={14} />
        Login / Register
      </button>
    </div>
  )
}
