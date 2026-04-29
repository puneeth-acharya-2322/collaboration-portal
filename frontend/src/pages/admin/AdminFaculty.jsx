import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { UserPlus } from 'lucide-react'

function getInitials(name) {
  if (!name) return '??'
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function AdminFaculty() {
  const { data, handleAction } = useOutletContext()
  const { allFaculty = [], allProjects = [], pendingUsers = [] } = data
  const [showCreate, setShowCreate] = useState(false)

  // Combine approved + pending users to show in faculty table
  // Since the backend currently stores users via the users.json file,
  // we use pendingUsers for pending and derive active from project submitters
  const activeFaculty = allProjects
    .filter(p => p.submitter?.name)
    .reduce((acc, p) => {
      if (!acc.find(f => f.email === p.submitter?.email)) {
        acc.push({ id: p.submitter?.id || p.id, name: p.submitter?.name, email: p.submitter?.email, department: p.submitter?.department, status: 'approved', projectsCount: 1 })
      } else {
        const f = acc.find(f => f.email === p.submitter?.email)
        f.projectsCount = (f.projectsCount || 0) + 1
      }
      return acc
    }, [])

  const allDisplayFaculty = [
    ...pendingUsers.map(u => ({ ...u, status: 'pending', projectsCount: 0 })),
    ...activeFaculty,
    ...allFaculty,
  ]

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '24px', marginBottom: '8px' }}>Faculty Accounts</h1>
          <p className="page-desc">Manage verified researchers and institutional access.</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn btn-navy" style={{ background: 'var(--navy)', color: '#fff', border: 'none', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer' }}>
          <UserPlus size={14} /> Create Faculty Account
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '35%' }}>Faculty</th>
              <th>Dept.</th>
              <th>Status</th>
              <th>Projects</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allDisplayFaculty.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)', fontSize: '13px' }}>No faculty accounts found.</td></tr>
            )}
            {allDisplayFaculty.map((f, i) => (
              <tr key={f.id || i}>
                <td>
                  <div className="fac-av-box" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="fac-av" style={{ width: '32px', height: '32px', borderRadius: '16px', background: 'var(--gold, #C9A84C)', color: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                      {getInitials(f.name)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{f.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{f.email}</div>
                    </div>
                  </div>
                </td>
                <td>{f.department || 'General Medicine'}</td>
                <td>
                  <span className={`badge-status ${f.status === 'approved' ? 'bs-active' : 'bs-pending'}`}>
                    {f.status === 'approved' ? 'Active' : 'Pending'}
                  </span>
                </td>
                <td>{f.projectsCount || 0}</td>
                <td style={{ textAlign: 'right' }}>
                  {f.status !== 'approved' && (
                    <button className="admin-action-btn approve" onClick={() => handleAction('user', f.id, 'approved')}>Approve</button>
                  )}
                  {f.status === 'approved' && (
                    <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Verified</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="modal-bg" style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="modal" style={{ maxWidth: '450px', width: '90%' }}>
            <div className="modal-head">
              <h3 style={{ color: '#fff' }}>Create Faculty Account</h3>
              <button onClick={() => setShowCreate(false)} className="modal-close" style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>
            <div className="modal-body" style={{ padding: '1.5rem' }}>
              <div className="fi" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>Full Name</label>
                <input type="text" placeholder="Dr. Name" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
              </div>
              <div className="fi" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>Institutional Email</label>
                <input type="email" placeholder="name@manipal.edu" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
              </div>
              <p className="form-note" style={{ fontSize: '11px', color: '#64748b', marginBottom: '1.5rem' }}>
                An invitation email will be sent to the faculty member to set their password.
              </p>
              <button className="submit-btn" style={{ width: '100%', padding: '10px', background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }} onClick={() => setShowCreate(false)}>
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
