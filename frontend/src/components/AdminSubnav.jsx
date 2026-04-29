import { NavLink } from 'react-router-dom'

export default function AdminSubnav({ pendingCount = 0 }) {
  const navItems = [
    { label: 'Overview',        path: '/admin',             end: true },
    { label: 'Pending',         path: '/admin/pending',     badge: pendingCount },
    { label: 'All Projects',    path: '/admin/projects'    },
    { label: 'Faculty Accounts',path: '/admin/faculty'     },
  ]

  return (
    <div className="subnav">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.end}
          className={({ isActive }) => `snb ${isActive ? 'active' : ''}`}
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
        >
          {item.label}
          {item.badge > 0 && (
            <span className="badge-count" style={{ marginLeft: '6px' }}>{item.badge}</span>
          )}
        </NavLink>
      ))}
    </div>
  )
}
