import { useOutletContext } from 'react-router-dom';
import AdminMetrics from '../../components/AdminMetrics';
import { RefreshCw, AlertCircle } from 'lucide-react';

export default function AdminOverview() {
  const { data, fetchAdminData } = useOutletContext();
  const { stats } = data;

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '24px', marginBottom: '8px' }}>Admin Overview</h1>
          <p className="page-desc">The center for portal oversight and project lifecycle approvals.</p>
        </div>
        <button onClick={fetchAdminData} className="btn" style={{ fontSize: '11px', gap: '8px' }}>
          <RefreshCw size={12} />
          Refresh Live Data
        </button>
      </div>

      <AdminMetrics stats={stats} />

      {/* Urgent Summary Alert */}
      {(data.pendingUsers?.length > 0 || data.pendingProjects?.length > 0) && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#fff', borderRadius: '12px', border: '1px solid #fed7aa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertCircle size={24} color="#f97316" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#9a3412' }}>Pending Actions Required</h3>
              <p style={{ fontSize: '14px', color: '#c2410c' }}>
                There are {data.pendingUsers.length} faculty registration(s) and {data.pendingProjects.length} new project(s) awaiting your review.
              </p>
            </div>
          </div>
          <button onClick={() => navigate('/admin/pending')} className="btn" style={{ background: '#f97316', color: '#fff', border: 'none' }}>Go to Approval Queue →</button>
        </div>
      )}
    </div>
  );
}
