export default function AdminMetrics({ stats }) {
  if (!stats) return null;

  const metrics = [
    { 
      label: 'New submissions', 
      val: stats.pendingProjects, 
      sub: 'Awaiting publish approval'
    },
    { 
      label: 'Update Requests', 
      val: stats.pendingUpdates || 0, 
      sub: 'Edits by faculty' 
    },
    { 
      label: 'Deletion Requests', 
      val: stats.pendingDeletions || 0, 
      sub: 'Awaiting removal' 
    },
    { 
      label: 'Collab Leads', 
      val: stats.totalRequests, 
      sub: 'Total requests logged' 
    },
    { 
      label: 'Pending Registrations', 
      val: stats.pendingUsers || 0, 
      sub: 'Faculty awaiting approval',
      delta: stats.pendingUsers > 0 ? 'Action required' : null,
      deltaPos: false
    },
    { 
      label: 'Published Projects', 
      val: stats.liveProjects, 
      sub: 'Active on portal' 
    },
    { 
      label: 'Faculty Accounts', 
      val: stats.totalUsers, 
      sub: 'Verified researchers' 
    }
  ];

  return (
    <div className="admin-metrics-grid">
      {metrics.map((m, i) => (
        <div key={i} className="admin-metric-card">
          <div className="amc-label">{m.label}</div>
          <div className="amc-val-row">
            <div className="amc-val">{m.val}</div>
            {m.delta && (
              <div className={`amc-delta ${m.deltaPos ? 'pos' : ''}`}>{m.delta}</div>
            )}
          </div>
          {m.sub && <div className="amc-sub">{m.sub}</div>}
        </div>
      ))}
    </div>
  );
}
