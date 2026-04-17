import { useOutletContext, Link } from 'react-router-dom';
import { UserCheck, FilePlus, RefreshCw, Trash2 } from 'lucide-react';

export default function AdminPending() {
  const { data, handleAction } = useOutletContext();
  const { pendingUsers = [], pendingProjects = [], deletionRequests = [], updateRequests = [] } = data;

  const totalPending = (pendingUsers?.length || 0) + (pendingProjects?.length || 0) + (deletionRequests?.length || 0) + (updateRequests?.length || 0);

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
          
          {/* Section: Registration Requests */}
          {(pendingUsers && pendingUsers.length > 0) && (
            <div>
              <div className="admin-section-title" style={{ color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <UserCheck size={16} />
                FACULTY REGISTRATION REQUESTS ({pendingUsers.length})
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Faculty Member</th>
                      <th>Department</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingUsers.map(u => (
                      <tr key={u.id} style={{ borderLeft: '4px solid var(--amber)' }}>
                        <td>
                          <div className="fac-info-name">{u.name}</div>
                          <div className="fac-info-email">{u.email}</div>
                        </td>
                        <td>{u.department || 'General Medicine'}</td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button onClick={() => handleAction('users', u.id, 'approve')} className="admin-action-btn approve">Verify Faculty</button>
                            <button onClick={() => handleAction('users', u.id, 'reject')} className="admin-action-btn reject">Reject</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section: New Project Submissions */}
          {(pendingProjects && pendingProjects.length > 0) && (
            <div>
              <div className="admin-section-title" style={{ color: 'var(--coral)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <FilePlus size={16} />
                NEW PROJECT SUBMISSIONS ({pendingProjects.length})
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Project Title</th>
                      <th>Principal Investigator</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingProjects.map(p => (
                      <tr key={p.id} style={{ borderLeft: '4px solid var(--coral)' }}>
                        <td><div className="at-project-main">{p.title}</div></td>
                        <td>{p.piName}</td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <Link to={`/projects/${p.id}`} className="admin-action-btn">Preview</Link>
                            <button onClick={() => handleAction('projects', p.id, 'approve')} className="admin-action-btn approve">Approve Publish</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section: Update Requests */}
          {(updateRequests && updateRequests.length > 0) && (
            <div>
              <div className="admin-section-title" style={{ color: 'var(--teal)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <RefreshCw size={16} />
                PROJECT UPDATE REQUESTS ({updateRequests.length})
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Modified Project</th>
                      <th>PI Name</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {updateRequests.map(p => (
                      <tr key={p.id} style={{ borderLeft: '4px solid var(--teal)' }}>
                        <td><div className="at-project-main">{p.title}</div></td>
                        <td>{p.piName}</td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button onClick={() => handleAction('edits', p.id, 'approve')} className="admin-action-btn approve">Approve Changes</button>
                            <button onClick={() => handleAction('edits', p.id, 'reject')} className="admin-action-btn">Reject Edits</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section: Deletion Requests */}
          {(deletionRequests && deletionRequests.length > 0) && (
            <div>
              <div className="admin-section-title" style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <Trash2 size={16} />
                DELETION REQUESTS ({deletionRequests.length})
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Project To Delete</th>
                      <th>PI Name</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deletionRequests.map(p => (
                      <tr key={p.id} style={{ borderLeft: '4px solid #ef4444' }}>
                        <td><div className="at-project-main">{p.title}</div></td>
                        <td>{p.piName}</td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button onClick={() => handleAction('deletions', p.id, 'approve')} className="admin-action-btn reject">Confirm Delete</button>
                            <button onClick={() => handleAction('deletions', p.id, 'reject')} className="admin-action-btn">Ignore Request</button>
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
  );
}
