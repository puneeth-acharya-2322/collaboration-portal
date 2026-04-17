import { Edit, FileText, Trash2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function ProjectTable({ projects, onUpdate }) {
  const [loadingId, setLoadingId] = useState(null);

  const handleDeleteRequest = async (id) => {
    if (!window.confirm('Request deletion of this project from the portal? This requires admin approval.')) return;
    
    setLoadingId(id);
    try {
      const res = await fetch(`http://localhost:3001/api/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  if (!projects || projects.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📁</div>
        No projects submitted yet.
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#f9fafb', borderBottom: '1px solid var(--border)' }}>
            <th style={{ padding: '12px', fontWeight: '600', color: 'var(--navy)' }}>Project Title</th>
            <th style={{ padding: '12px', fontWeight: '600', color: 'var(--navy)' }}>Status</th>
            <th style={{ padding: '12px', fontWeight: '600', color: 'var(--navy)' }}>Requests</th>
            <th style={{ padding: '12px', fontWeight: '600', color: 'var(--navy)', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '12px' }}>
                <div style={{ fontWeight: '600', color: 'var(--text)' }}>{p.title}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
                  {p.domain} • {p.isPublic ? 'Public' : 'Private'}
                </div>
                {p.pendingUpdates && (
                  <div style={{ fontSize: '10px', color: 'var(--amber)', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={10} /> Pending Admin review for latest edits
                  </div>
                )}
              </td>
              <td style={{ padding: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span className={`pc-tag ${p.approvalStatus === 'approved' ? 'tag-status-on' : 'tag-status-up'}`}>
                    {p.approvalStatus === 'approved' ? 'Approved' : 'Pending Approval'}
                  </span>
                  {p.pendingDeletion && (
                    <span className="pc-tag tag-status-up" style={{ background: 'var(--red-l)', color: 'var(--red)' }}>
                      Pending Deletion
                    </span>
                  )}
                </div>
              </td>
              <td style={{ padding: '12px' }}>
                <span style={{ fontWeight: '600', color: 'var(--navy)' }}>{p._requestCount || 0}</span> Applications
              </td>
              <td style={{ padding: '12px', textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <Link to={`/dashboard/edit-project/${p.id}`} className="btn" style={{ padding: '4px 8px', fontSize: '11px' }}>
                    <Edit size={12} /> Edit
                  </Link>
                  <button 
                    onClick={() => handleDeleteRequest(p.id)} 
                    disabled={loadingId === p.id || p.pendingDeletion}
                    className="btn" 
                    style={{ padding: '4px 8px', fontSize: '11px', color: p.pendingDeletion ? 'var(--muted)' : 'var(--red)' }}
                  >
                    <Trash2 size={12} /> {p.pendingDeletion ? 'Deletion Pending' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
