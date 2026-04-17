import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ProjectTable from '../components/ProjectTable';

export default function MyProjects() {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(location.state?.message || '');

  const mockProjects = [
    { id: 1, title: '30-day ICU readmission risk scoring model', status: 'Pending', type: 'Research Project', requestsText: '—', received: 'Submitted 2 days ago', action: 'Edit draft' },
    { id: 2, title: 'Predictive model for sepsis onset in ICU', status: 'Published', type: 'Research Project', requestsText: '4 new', received: 'Published 3 weeks ago', action: 'View requests' },
    { id: 3, title: 'Ventilator weaning protocol AI assistant', status: 'Rejected', type: 'Research Project', requestsText: '—', received: 'Feedback: add more detail to collaborator role', action: 'Revise' }
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/projects/my-projects', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setProjects(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
    
    if (toastMessage) {
      setTimeout(() => setToastMessage(''), 3000);
    }
  }, [token, toastMessage]);

  return (
    <div className="pw">
      <div style={{ maxWidth: '900px', margin: '0 auto', paddingTop: '1.5rem', paddingBottom: '4rem' }}>
        <div className="results-header" style={{ marginBottom: '10px' }}>
          <h1 className="page-title" style={{ marginBottom: 0 }}>My Projects</h1>
          <a href="/dashboard/add-project" className="btn btn-gold">
            + New Project
          </a>
        </div>
        <p className="page-desc" style={{ marginBottom: '1.5rem' }}>Organise your active collaborations and manage submissions.</p>

        {toastMessage && (
          <div style={{ padding: '10px', background: 'var(--green-l)', color: 'var(--green)', borderRadius: '8px', marginBottom: '1rem', fontSize: '13px' }}>
            {toastMessage}
          </div>
        )}

        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : projects.length > 0 ? (
          <div className="sidebar" style={{ padding: '0' }}>
             <ProjectTable projects={projects} />
          </div>
        ) : (
          <div style={{ background: '#fff', border: '.5px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 80px', padding: '12px 16px', fontSize: '10px', fontWeight: 600, color: 'var(--muted)', borderBottom: '.5px solid var(--border)', textTransform: 'uppercase' }}>
              <div>Project</div>
              <div>Status</div>
              <div>Type</div>
              <div>Requests</div>
              <div style={{ textAlign: 'right' }}>Actions</div>
            </div>
            {mockProjects.map((proj, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 80px', padding: '16px', alignItems: 'center', fontSize: '13px', borderBottom: i < mockProjects.length - 1 ? '.5px solid var(--border)' : 'none' }}>
                <div>
                  <div style={{ fontWeight: 500, color: 'var(--navy)', marginBottom: '4px' }}>{proj.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{proj.received}</div>
                </div>
                <div>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, background: proj.status === 'Published' ? 'var(--green-l)' : proj.status === 'Pending' ? '#ffedd5' : 'var(--red-l)', color: proj.status === 'Published' ? 'var(--green)' : proj.status === 'Pending' ? '#c2410c' : 'var(--red)' }}>
                    {proj.status}
                  </span>
                </div>
                <div style={{ color: 'var(--text)' }}>{proj.type}</div>
                <div style={{ fontWeight: proj.requestsText === '4 new' ? 600 : 400, color: proj.requestsText === '4 new' ? 'var(--navy)' : 'var(--muted)' }}>{proj.requestsText}</div>
                <div style={{ textAlign: 'right' }}>
                  <button style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '5px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>{proj.action}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
