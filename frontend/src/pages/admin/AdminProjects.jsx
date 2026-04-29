import { useOutletContext, Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'

export default function AdminProjects() {
  const { data, handleAction } = useOutletContext()
  const { allProjects = [] } = data

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ fontSize: '24px', marginBottom: '8px' }}>Project Repository</h1>
        <p className="page-desc">The complete database of research projects and collaboration opportunities.</p>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '40%' }}>Project Detail</th>
              <th>Submitted By</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allProjects.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)', fontSize: '13px' }}>No projects found.</td></tr>
            )}
            {allProjects.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="at-project-main">{p.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>{p.domain || 'Research'}</div>
                </td>
                <td>{p.submitter?.name || p.piName || '—'}</td>
                <td>
                  <span className={`badge-status ${p.approvalStatus === 'approved' ? 'bs-active' : 'bs-pending'}`}>
                    {p.approvalStatus === 'approved' ? 'Active' : 'Awaiting Review'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <Link to={`/research`} className="admin-action-btn" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ExternalLink size={12} /> View
                    </Link>
                    {p.approvalStatus === 'approved' && (
                      <button className="admin-action-btn reject" onClick={() => handleAction('project', p.id, 'rejected')}>Unpublish</button>
                    )}
                    {p.approvalStatus !== 'approved' && (
                      <button className="admin-action-btn approve" onClick={() => handleAction('project', p.id, 'approved')}>Approve</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
