import { useOutletContext } from 'react-router-dom';

export default function AdminActivities() {
  const { data } = useOutletContext();
  const { allRequests } = data;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ fontSize: '24px', marginBottom: '8px' }}>Collaboration Leads</h1>
        <p className="page-desc">A real-time feed of all collaboration requests and researcher match flows.</p>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Collaborator</th>
              <th>Target Research</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Flow Status</th>
            </tr>
          </thead>
          <tbody>
            {(allRequests || []).slice(0, 20).map((r, i) => (
              <tr key={i}>
                <td><div className="fac-info-name">{r.applicantName}</div></td>
                <td><div className="at-project-sub">{r.projectTitle}</div></td>
                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                <td style={{ textAlign: 'right' }}>
                  <span className={`badge-status ${r.status === 'accepted' ? 'bs-active' : r.status === 'pending' ? 'bs-pending' : 'bs-private'}`}>
                    {r.status || 'pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
