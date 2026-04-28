import { Link, useLocation } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import logo from '../assets/logo.jpeg'

export default function Navbar() {
  const location = useLocation()
  const { role, setRole, user } = useUser()

  const isActive = (path) => location.pathname === path

  const portalNav = [
    { name: 'Collaborate', path: '/collaborate' },
    { name: 'My Matches', path: '/matches', badge: '12' },
    { name: 'My Profile', path: '/profile' }
  ]

  const discoveryNav = [
    { name: 'Find a Project', path: '/research' },
    { name: 'Find a Collaborator', path: '/collaborators' },
    { name: 'My Collaboration Preferences', path: '/preferences' }
  ]

  return (
    <header className="font-['DM_Sans',sans-serif]">
      {/* ── BAR 1: BRANDING & PORTAL NAV ── */}
      <div className="topbar" style={{ background: '#fff', borderBottom: '1px solid var(--dash-border)' }}>
        <Link to="/" className="logo-box">
          <img src={logo} alt="KMC Logo" />
        </Link>
        
        <div className="brand-wrap">
          <div className="brand" style={{ color: 'var(--dash-text)' }}>KMC · Department of AI in Healthcare</div>
          <div className="brand-sub" style={{ color: 'var(--dash-muted)' }}>FYRC — Research Portal</div>
        </div>

        <nav className="portal-nav" style={{ background: 'var(--dash-bg)' }}>
          {role !== 'public' && portalNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`pnb ${isActive(item.path) ? 'active' : ''}`}
              style={{ color: isActive(item.path) ? 'var(--dash-green)' : 'var(--dash-muted)' }}
            >
              {item.name}
              {item.badge && <span className="badge-count">{item.badge}</span>}
            </Link>
          ))}
        </nav>
        
        <div className="user-area-wrap">
          {role === 'public' && (
            <Link to="/admin/login" className="dash-filter-btn" style={{ textDecoration: 'none' }}>
              LOGIN / REGISTER
            </Link>
          )}

          {/* Role Switcher */}
          <div className="role-switcher" style={{ background: 'var(--dash-bg)', borderColor: 'var(--dash-border)' }}>
            {['public', 'user', 'faculty', 'admin'].map((r) => (
              <button
                key={r}
                className={`rs-btn ${role === r ? 'on' : ''}`}
                onClick={() => setRole(r)}
                style={{ 
                  background: role === r ? 'var(--dash-green)' : 'transparent',
                  color: role === r ? '#fff' : 'var(--dash-muted)'
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── BAR 2: DISCOVERY LINKS ── */}
      <div className="subnav-discovery" style={{ background: '#fff', borderBottom: '1px solid var(--dash-border)' }}>
        {discoveryNav.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`snb-d ${isActive(item.path) ? 'active' : ''}`}
            style={{ 
              color: isActive(item.path) ? 'var(--dash-green)' : 'var(--dash-muted)',
              borderColor: isActive(item.path) ? 'var(--dash-green)' : 'transparent'
            }}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </header>
  )
}
