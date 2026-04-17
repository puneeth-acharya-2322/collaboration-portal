import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import RequestTable from '../components/RequestTable';

export default function Requests() {
  const { token } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  const mockRequests = [
    { id: 1, applicant: 'Rahul Kumar', applicantInitials: 'RK', applicantMeta: 'Python, XGBoost', project: 'Sepsis onset model', institution: 'MIT Manipal', received: '2 days ago' },
    { id: 2, applicant: 'Sneha Alva', applicantInitials: 'SA', applicantMeta: 'R, SHAP', project: 'Sepsis onset model', institution: 'Independent', received: '5 days ago' }
  ];

  const fetchRequests = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/requests/my-received', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setRequests(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line
  }, [token]);

  const handleAction = async (requestId, status) => {
    try {
      const res = await fetch(`http://localhost:3001/api/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage(`Request successfully ${status}!`);
        setTimeout(() => setToastMessage(''), 3000);
        // refresh list
        fetchRequests();
      } else {
        alert(data.message || 'Failed to process request');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server.');
    }
  };

  return (
    <div className="pw">
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '1.5rem', paddingBottom: '4rem' }}>
        <div className="results-header" style={{ marginBottom: '10px' }}>
          <h1 className="page-title" style={{ marginBottom: 0 }}>Collaboration Requests</h1>
        </div>
        <p className="page-desc" style={{ marginBottom: '1.5rem' }}>Review researchers who have applied to your published projects.</p>

        {toastMessage && (
          <div style={{ padding: '10px', background: 'var(--green-l)', color: 'var(--green)', borderRadius: '8px', marginBottom: '1rem', fontSize: '13px' }}>
            {toastMessage}
          </div>
        )}

        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : requests.length > 0 ? (
          <div className="sidebar" style={{ padding: '0' }}>
             <RequestTable requests={requests} onAction={handleAction} />
          </div>
        ) : (
          <div style={{ background: '#fff', border: '.5px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 80px', padding: '12px 16px', fontSize: '10px', fontWeight: 600, color: 'var(--muted)', borderBottom: '.5px solid var(--border)', textTransform: 'uppercase' }}>
              <div>Applicant</div>
              <div>Project</div>
              <div>Institution</div>
              <div>Received</div>
              <div style={{ textAlign: 'right' }}>Actions</div>
            </div>
            {mockRequests.map((req, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 80px', padding: '16px', alignItems: 'center', fontSize: '13px', borderBottom: i < mockRequests.length - 1 ? '.5px solid var(--border)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: req.applicantInitials === 'RK' ? 'var(--teal)' : 'var(--amber)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
                    {req.applicantInitials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--navy)', marginBottom: '2px' }}>{req.applicant}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{req.applicantMeta}</div>
                  </div>
                </div>
                <div style={{ color: 'var(--text)' }}>{req.project}</div>
                <div style={{ color: 'var(--text)' }}>{req.institution}</div>
                <div style={{ color: 'var(--muted)' }}>{req.received}</div>
                <div style={{ textAlign: 'right' }}>
                  <button style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '5px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>View</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
