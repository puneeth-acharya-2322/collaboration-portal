import { useOutletContext, Link } from 'react-router-dom'
import { Users, FileText, CheckCircle, Clock, ArrowRight } from 'lucide-react'

export default function AdminOverview() {
  const { data } = useOutletContext()
  const { stats, pendingUsers = [], pendingProjects = [] } = data

  const cards = [
    { label: 'Pending Faculty',   value: pendingUsers.length,                          icon: <Users size={20} />,       color: 'var(--amber)' },
    { label: 'Live Projects',     value: (data.allProjects || []).filter(p => p.approvalStatus === 'approved').length, icon: <FileText size={20} />,    color: 'var(--teal)' },
    { label: 'Pending Approvals', value: (pendingUsers.length + pendingProjects.length), icon: <Clock size={20} />,       color: 'var(--coral, #e85d4a)' },
    { label: 'Total Projects',    value: (data.allProjects || []).length,               icon: <CheckCircle size={20} />, color: 'var(--navy)' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ fontSize: '24px', marginBottom: '8px' }}>System Overview</h1>
        <p className="page-desc">Real-time metrics and platform activity monitoring.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {cards.map((c, i) => (
          <div key={i} style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ color: c.color, background: `${c.color}18`, padding: '10px', borderRadius: '10px' }}>
                {c.icon}
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>{c.value}</div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 500 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Pending actions list */}
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '16px', color: 'var(--navy)' }}>Pending Actions</h3>
            <Link to="/admin/pending" style={{ fontSize: '12px', color: 'var(--teal)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pendingUsers.length === 0 && pendingProjects.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)', fontSize: '13px' }}>
                No pending actions. You're all caught up!
              </p>
            ) : (
              <>
                {pendingUsers.slice(0, 3).map((u, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px', borderRadius: '8px', background: '#f8fafc' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--amber)', marginTop: '6px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '13px', color: 'var(--navy)', fontWeight: 500 }}>New faculty registration: {u.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>{u.email}</div>
                    </div>
                  </div>
                ))}
                {pendingProjects.slice(0, 3).map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px', borderRadius: '8px', background: '#f8fafc' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--teal)', marginTop: '6px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '13px', color: 'var(--navy)', fontWeight: 500 }}>New project submitted: {p.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>{p.domain || 'Research Project'}</div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div style={{ background: 'var(--navy)', padding: '1.5rem', borderRadius: '12px', color: '#fff' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '1rem', color: 'var(--amber, #C9A84C)' }}>Admin Quick Links</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { to: '/admin/pending', label: 'Review Pending Requests' },
              { to: '/admin/faculty', label: 'Manage Faculty Accounts' },
              { to: '/admin/projects', label: 'Browse Project Repository' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} style={{
                display: 'block', padding: '12px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px', color: '#cbd5e1',
                fontSize: '13px', textDecoration: 'none',
                transition: 'all 0.2s',
              }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#cbd5e1' }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
