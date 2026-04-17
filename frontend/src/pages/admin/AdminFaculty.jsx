import { useOutletContext } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';

export default function AdminFaculty() {
  const { data } = useOutletContext();
  const { allFaculty } = data;
  const [showCreateModal, setShowCreateModal] = useState(false);

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
        <button onClick={() => setShowCreateModal(true)} className="btn btn-navy" style={{ background: 'var(--navy)', color: '#fff', border: 'none', fontSize: '12px' }}>
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
                  <div className="fac-av-box">
                    <div className="fac-av">{getInitials(f.name)}</div>
                    <div>
                      <div className="fac-info-name">{f.name}</div>
                      <div className="fac-info-email">{f.email}</div>
                    </div>
                  </div>
                </td>
                <td>{f.department || 'General Medicine'}</td>
                <td>
                  <span className={`badge-status ${f.status === 'approved' ? 'bs-active' : 'bs-pending'}`}>
                    {f.status === 'approved' ? 'Active' : 'Pending'}
                  </span>
                </td>
                <td>{f.projectsCount}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="admin-action-btn">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="modal" style={{ maxWidth: '450px' }}>
            <div className="modal-head">
              <h3 style={{ color: '#fff' }}>Create Faculty Account</h3>
              <button onClick={() => setShowCreateModal(false)} className="modal-close">×</button>
            </div>
            <div className="modal-body">
              <div className="fi">
                <label>Full Name</label>
                <input type="text" placeholder="Dr. Name" />
              </div>
              <div className="fi">
                <label>Institutional Email</label>
                <input type="email" placeholder="name@manipal.edu" />
              </div>
              <div className="fi">
                <label>Department</label>
                <select>
                  <option>AI in Healthcare</option>
                  <option>Cardiology</option>
                  <option>Neurology</option>
                  <option>Pediatrics</option>
                </select>
              </div>
              <p className="form-note" style={{ marginBottom: '1.5rem' }}>An invitation email will be sent to the faculty member to set their password.</p>
              <button className="submit-btn" onClick={() => setShowCreateModal(false)}>Send Invitation</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
