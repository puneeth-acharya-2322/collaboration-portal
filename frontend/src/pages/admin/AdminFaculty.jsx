import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { UserPlus, UserCheck } from 'lucide-react';
import FacultyReviewModal from '../../components/admin/FacultyReviewModal';

export default function AdminFaculty() {
  const { data, handleAction } = useOutletContext();
  const { allFaculty = [] } = data;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  function getInitials(name) {
    if (!name) return '??';
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '24px', marginBottom: '8px' }}>Faculty Accounts</h1>
          <p className="page-desc">Manage verified researchers and institutional access.</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn btn-navy" style={{ background: 'var(--navy)', color: '#fff', border: 'none', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer' }}>
          <UserPlus size={14} />
          Create Faculty Account
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
            {allFaculty.map((f) => (
              <tr key={f.id}>
                <td>
                  <div className="fac-av-box" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="fac-av" style={{ width: '32px', height: '32px', borderRadius: '16px', background: 'var(--gold)', color: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
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
                  <button className="admin-action-btn" onClick={() => setSelectedUser(f)}>View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <div className="modal-bg" style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="modal" style={{ maxWidth: '450px', width: '90%' }}>
            <div className="modal-head">
              <h3 style={{ color: '#fff' }}>Create Faculty Account</h3>
              <button onClick={() => setShowCreateModal(false)} className="modal-close" style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>
            <div className="modal-body" style={{ padding: '1.5rem' }}>
              <div className="fi" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>Full Name</label>
                <input type="text" placeholder="Dr. Name" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} />
              </div>
              <div className="fi" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>Institutional Email</label>
                <input type="email" placeholder="name@manipal.edu" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} />
              </div>
              <p className="form-note" style={{ fontSize: '11px', color: '#64748b', marginBottom: '1.5rem' }}>An invitation email will be sent to the faculty member to set their password.</p>
              <button className="submit-btn" style={{ width: '100%', padding: '10px', background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }} onClick={() => setShowCreateModal(false)}>Send Invitation</button>
            </div>
          </div>
        </div>
      )}

      {selectedUser && (
        <FacultyReviewModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onAction={(action) => {
            handleAction('users', selectedUser.id, action);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}
