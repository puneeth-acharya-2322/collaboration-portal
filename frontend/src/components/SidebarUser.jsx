import { Link, useLocation } from 'react-router-dom';
import { Home, Folder, PlusSquare, User, LogOut, FileText, Settings } from 'lucide-react';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

export default function SidebarUser() {
  const { pathname } = useLocation();
  const { logout } = useContext(AuthContext);

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'My Projects', path: '/dashboard/projects', icon: Folder },
    { name: 'Add Project', path: '/dashboard/add-project', icon: PlusSquare },
    { name: 'Collab Requests', path: '/dashboard/requests', icon: FileText },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
    { name: 'Preferences', path: '/dashboard/preferences', icon: Settings },
  ];

  return (
    <div className="sidebar">
      <div className="sb-header">User Panel</div>
      <div className="sb-options" style={{ padding: '0.5rem 0' }}>
        {links.map(link => {
          const Icon = link.icon;
          const isActive = pathname === link.path;
          return (
            <Link 
              key={link.path} 
              to={link.path} 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0.65rem 1rem',
                fontSize: '13px',
                color: isActive ? 'var(--navy)' : 'var(--muted)',
                fontWeight: isActive ? '600' : '500',
                textDecoration: 'none',
                background: isActive ? '#f9fafb' : 'transparent',
                borderLeft: isActive ? '3px solid var(--navy)' : '3px solid transparent'
              }}
            >
              <Icon size={16} />
              {link.name}
            </Link>
          );
        })}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', marginTop: '0.5rem' }}>
          <button 
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '0.65rem 1rem',
              fontSize: '13px',
              color: 'var(--red)',
              background: 'var(--red-l)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
