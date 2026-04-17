import { useOutletContext, useNavigate } from 'react-router-dom';

export default function AdminProjects() {
  const { data } = useOutletContext();
  const { allProjects } = data;
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ fontSize: '24px', marginBottom: '8px' }}>Published Research</h1>
        <p className="page-desc">The full catalog of active research projects across the KMC portal.</p>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '40%' }}>Project</th>
              <th>Faculty</th>
              <th>Visibility</th>
              <th>Stats</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allProjects.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="at-project-main">{p.title}</div>
                  <div className="at-project-sub">{p.domain}</div>
                </td>
                <td>{p.piName}</td>
                <td>
                  <span className={`badge-status ${p.visibility === 'private' ? 'bs-private' : 'bs-public'}`}>
                    {p.visibility || 'Public'}
                  </span>
                </td>
                <td>{p.requestsCount} Leads</td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => navigate(`/dashboard/edit-project/${p.id}`)} className="admin-action-btn">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
