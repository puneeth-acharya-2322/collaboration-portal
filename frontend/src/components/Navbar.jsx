import { Link, useLocation } from 'react-router-dom'
import { useUser } from '../context/UserContext'

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
      <div className="topbar">
        <Link to="/" className="logo-box" style={{ textDecoration: 'none' }}>K</Link>
        
        <div className="brand-wrap">
          <div className="brand">KMC · Department of AI in Healthcare</div>
          <div className="brand-sub">FYRC — Find Your Research Collaborator Portal</div>
        </div>

        <nav className="portal-nav">
          {role !== 'public' && portalNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`pnb ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.name}
              {item.badge && <span className="badge-count">{item.badge}</span>}
            </Link>
          ))}
        </nav>
        
        <div className="user-area-wrap">
          {/* User Pill (Only show if logged in or viewing as user/admin) */}
          {user && (
            <div className="user-pill group relative">
              <div className="user-av">{user.initials}</div>
              <div className="user-info-text">
                <span className="user-name">{user.name}</span>
                <span className="user-role-label">{user.role}</span>
              </div>
            </div>
          )}

          {role === 'public' && (
            <Link to="/admin/login" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold rounded-lg transition-all" style={{ textDecoration: 'none' }}>
              LOGIN
            </Link>
          )}

          {/* Role Switcher (View as...) */}
          <div className="role-switcher">
            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,.3)', marginLeft: '6px', fontWeight: 700 }}>VIEW AS:</span>
            {['public', 'user', 'faculty', 'admin'].map((r) => (
              <button
                key={r}
                className={`rs-btn ${role === r ? 'on' : ''}`}
                onClick={() => setRole(r)}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Admin Link */}
          {role === 'admin' && (
             <Link to="/admin" className="px-3 py-1.5 bg-[var(--gold)] text-[var(--navy)] text-[10px] font-bold rounded-lg hover:shadow-lg transition-all" style={{ textDecoration: 'none' }}>
                ADMIN DASHBOARD
             </Link>
          )}
        </div>
      </div>

      {/* ── BAR 2: DISCOVERY LINKS ── */}
      <div className="subnav-discovery">
        {discoveryNav.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`snb-d ${isActive(item.path) ? 'active' : ''}`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </header>
  )
}
