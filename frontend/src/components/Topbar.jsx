import { Link, useLocation } from 'react-router-dom'
import { Search, Users, UserCircle, LogOut } from 'lucide-react'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'

export default function Topbar() {
  const location = useLocation()
  const isCollaborator = location.pathname === '/collaborators'
  const { user, logout } = useContext(AuthContext)

  function getInitials(name) {
    if (!name) return '??'
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  }

  const isAdminView = location.pathname.startsWith('/admin')

  return (
    <div className="topbar">
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '15px', textDecoration: 'none' }}>
        <div className="logo-box">K</div>
        <div>
          <div className="brand" style={{ color: '#fff' }}>KMC · Department of AI in Healthcare</div>
          <div className="brand-sub" style={{ color: 'rgba(255,255,255,0.7)' }}>FYRC — Find Your Research Collaborator Portal</div>
        </div>
      </Link>

      {user ? (
        <div style={{ display: 'flex', gap: isAdminView ? '1rem' : '1.5rem', alignItems: 'center', marginLeft: 'auto' }}>
           {user.role === 'admin' ? (
             <>
               <Link to="/admin" style={{ background: isAdminView ? 'rgba(255,255,255,0.1)' : 'transparent', color: '#fff', border: isAdminView ? '1px solid rgba(255,255,255,0.2)' : 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, textDecoration: 'none' }}>Admin Dashboard</Link>
               <Link to="/dashboard" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', textDecoration: 'none', marginRight: '5px', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>Researcher View</Link>
             </>
           ) : (
             <>
               <Link to="/dashboard" style={{ background: 'rgba(255,255,255,0.15)', border: '.5px solid rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: '6px', color: '#fff', fontSize: '13px', fontWeight: 500, textDecoration: 'none' }}>My Dashboard</Link>
               <Link to="/collaborators" style={{ color: '#E2E8F0', fontSize: '13px', textDecoration: 'none' }}>Collaborate</Link>
             </>
           )}
           
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.12)', padding: '4px 12px 4px 4px', borderRadius: '99px', cursor: 'pointer', border: '.5px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--amber)', color: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
                  {getInitials(user.name)}
                </div>
                <span style={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}>{user.name}</span>
             </div>

             <button 
                onClick={logout}
                title="Logout"
                className="btn-logout"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                }}
                onMouseOver={(e) => { 
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.4)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.6)';
                }}
                onMouseOut={(e) => { 
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                }}
              >
                <LogOut size={14} />
              </button>
           </div>
        </div>
      ) : (
        <>
          <div className="topnav" style={{ marginLeft: 'auto' }}>
            <Link to="/" className={`tnb ${!isCollaborator && !location.pathname.includes('/dashboard') ? 'active' : ''}`}>
              <Search size={13} />
              Find a Project
            </Link>
            <Link to="/collaborators" className={`tnb ${isCollaborator ? 'active' : ''}`}>
              <Users size={13} />
              Find a Collaborator
            </Link>
          </div>
          <Link to="/login" className="btn btn-gold" style={{ marginLeft: '12px', fontSize: '12px' }}>
            Login / Register
          </Link>
        </>
      )}
    </div>
  )
}
