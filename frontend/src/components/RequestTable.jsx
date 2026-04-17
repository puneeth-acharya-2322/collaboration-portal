import { CheckCircle, XCircle } from 'lucide-react';

export default function RequestTable({ requests, onAction }) {
  if (!requests || requests.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📥</div>
        No collaboration requests yet.
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#f9fafb', borderBottom: '1px solid var(--border)' }}>
            <th style={{ padding: '12px', fontWeight: '600', color: 'var(--navy)' }}>Applicant</th>
            <th style={{ padding: '12px', fontWeight: '600', color: 'var(--navy)' }}>Skills</th>
            <th style={{ padding: '12px', fontWeight: '600', color: 'var(--navy)' }}>Project</th>
            <th style={{ padding: '12px', fontWeight: '600', color: 'var(--navy)' }}>Status</th>
            <th style={{ padding: '12px', fontWeight: '600', color: 'var(--navy)', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '12px' }}>
                <div style={{ fontWeight: '600', color: 'var(--text)' }}>{r.applicantName}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>{r.experience || r.applicantEmail}</div>
              </td>
              <td style={{ padding: '12px', color: 'var(--muted)' }}>
                {r.skills?.join(', ') || '-'}
              </td>
              <td style={{ padding: '12px' }}>
                {r.projectTitle}
              </td>
              <td style={{ padding: '12px' }}>
                <span className={`pc-tag ${r.status === 'accepted' ? 'tag-status-on' : r.status === 'rejected' ? 'tag-status-up' : ''}`}
                      style={r.status === 'rejected' ? { background: '#FDE68A', color: '#B45309' } : r.status === 'pending' ? { background: '#f1f5f9', color: '#64748b' } : {}}>
                  {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                </span>
              </td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                {r.status === 'pending' ? (
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button onClick={() => onAction(r.id, 'accepted')} className="btn" style={{ background: 'var(--green-l)', color: 'var(--green)', padding: '6px' }}>
                      <CheckCircle size={14} /> Accept
                    </button>
                    <button onClick={() => onAction(r.id, 'rejected')} className="btn" style={{ background: 'var(--red-l)', color: 'var(--red)', padding: '6px' }}>
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                ) : (
                  <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Processed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
