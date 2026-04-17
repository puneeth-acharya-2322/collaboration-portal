import { NavLink } from 'react-router-dom';

export default function AdminSubnav({ pendingCount = 0 }) {

  // For now we map all to /admin since we are building a multi-section single page, 
  // but we can use search params or state to toggle sections.
  // Actually, for a "functional implementation" of this design, let's use hash or query params if needed, 
  // or just render all sections on one page as shown in the mockup scroll.
  
  const navItems = [
    { label: 'Overview', path: '/admin', id: 'dash', end: true },
    { label: 'Pending', path: '/admin/pending', id: 'pending', badge: pendingCount || 0 },
    { label: 'All Projects', path: '/admin/projects', id: 'all' },
    { label: 'Faculty Accounts', path: '/admin/faculty', id: 'faculty' },
    { label: 'Activities', path: '/admin/activities', id: 'activities' },
    { label: 'Courses', path: '/admin/courses', id: 'courses' },
  ];

  return (
    <div className="subnav">
      {navItems.map((item) => (
        <NavLink 
          key={item.id} 
          to={item.path} 
          end={item.end}
          className={({ isActive }) => `snb ${isActive ? 'active' : ''}`}
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
        >
          {item.label}
          {item.badge > 0 && <span className="badge-count" style={{ marginLeft: '6px' }}>{item.badge}</span>}
        </NavLink>
      ))}
    </div>
  );
}
