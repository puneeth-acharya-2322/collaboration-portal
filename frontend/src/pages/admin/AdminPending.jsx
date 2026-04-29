import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { UserCheck, FilePlus } from 'lucide-react'

export default function AdminPending() {
  const { data, handleAction } = useOutletContext()
  const { pendingUsers = [], pendingProjects = [] } = data
  const totalPending = pendingUsers.length + pendingProjects.length

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ fontSize: '24px', marginBottom: '8px' }}>Approval Queue</h1>
        <p className="page-desc">Manage institutional registrations and oversee the project lifecycle.</p>
      </div>

      {totalPending === 0 ? (
        <div style={{ padding: '6rem 2rem', background: '#fff', borderRadius: '12px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
          <p style={{ color: '#64748b', fontSize: '15px' }}>No pending approvals at the moment. You're all caught up!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

          {/* Faculty registrations */}
          {pendingUsers.length > 0 && (
            <div>
              <div className="admin-section-title" style={{ color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>
                <UserCheck size={16} /> FACULTY REGISTRATION REQUESTS ({pendingUsers.length})
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Faculty Member</th>
                      <th>Department</th>
                      <th>Email</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingUsers.map(u => (
                      <tr key={u.id} style={{ borderLeft: '4px solid var(--amber)' }}>
                        <td>
                          <div className="fac-info-name">{u.name}</div>
                        </td>
                        <td>{u.department || 'General Medicine'}</td>
                        <td><div className="fac-info-email">{u.email}</div></td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button onClick={() => handleAction('user', u.id, 'approved')} className="admin-action-btn approve">Verify & Approve</button>
                            <button onClick={() => handleAction('user', u.id, 'rejected')} className="admin-action-btn">Reject</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* New project submissions */}
          {pendingProjects.length > 0 && (
            <div>
              <div className="admin-section-title" style={{ color: '#e85d4a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>
                <FilePlus size={16} /> NEW PROJECT SUBMISSIONS ({pendingProjects.length})
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Project Title</th>
                      <th>Domain</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingProjects.map(p => (
                      <tr key={p.id} style={{ borderLeft: '4px solid #e85d4a' }}>
                        <td><div className="at-project-main">{p.title}</div></td>
                        <td>{p.domain || 'Research Project'}</td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button onClick={() => handleAction('project', p.id, 'approved')} className="admin-action-btn approve">Approve &amp; Publish</button>
                            <button onClick={() => handleAction('project', p.id, 'rejected')} className="admin-action-btn">Reject</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
