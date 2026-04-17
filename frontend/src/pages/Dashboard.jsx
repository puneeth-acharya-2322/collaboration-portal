import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

export default function Dashboard() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ pendingReview: 2, published: 3, pendingRequests: 11 });

  useEffect(() => {
    // If backend isn't ready or data is empty, we fall back to mock data 
    // to match the exact visual representation of the mockup.
    const fetchData = async () => {
      try {
        const [projRes, reqRes] = await Promise.all([
          fetch('http://localhost:3001/api/projects/my-projects', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('http://localhost:3001/api/requests/my-received', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        const projData = await projRes.json();
        const reqData = await reqRes.json();

        if (projData.success && projData.data.length > 0) {
          setProjects(projData.data);
          const published = projData.data.filter(p => p.approvalStatus === 'approved').length;
          const pendingReview = projData.data.filter(p => p.approvalStatus === 'pending_approval').length;
          setStats(s => ({ ...s, published, pendingReview }));
        } else {
          // Add mock data to match visual design if DB is empty
          setProjects([
            { id: '1', title: '30-day ICU readmission risk scoring model', date: 'Submitted 2 days ago', status: 'Pending', type: 'Research Project', requestsText: '—', action: 'Edit draft' },
            { id: '2', title: 'Predictive model for sepsis onset in ICU', date: 'Published 3 weeks ago', status: 'Published', type: 'Research Project', requestsText: '4 new', action: 'View requests' },
            { id: '3', title: 'Ventilator weaning protocol AI assistant', date: 'Feedback: add more detail to collaborator role', status: 'Rejected', type: 'Research Project', requestsText: '—', action: 'Revise' }
          ]);
        }

        if (reqData.success && reqData.data.length > 0) {
          setRequests(reqData.data);
          const pendingRequests = reqData.data.filter(r => r.status === 'pending').length;
          setStats(s => ({ ...s, pendingRequests }));
        } else {
          setRequests([
            { id: '1', applicant: 'Rahul Kumar', skills: 'Python, XGBoost', initials: 'RK', color: 'var(--teal)', project: 'Sepsis onset model', institution: 'MIT Manipal', received: '2 days ago' },
            { id: '2', applicant: 'Sneha Alva', skills: 'R, SHAP', initials: 'SA', color: 'var(--amber)', project: 'Sepsis onset model', institution: 'Independent', received: '5 days ago' }
          ]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [token]);

  return (
    <div className="pw">
      <div style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '2rem', paddingBottom: '4rem' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--navy)', marginBottom: '8px', fontFamily: 'Merriweather, serif' }}>Faculty Dashboard</h1>
          <p style={{ fontSize: '13px', color: 'var(--muted)' }}>Manage your submitted projects, FYRC card, and view collaboration requests from researchers.</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div style={{ flex: 1, background: '#fff', border: '.5px solid var(--border)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 1px 2px rgba(27,58,92,0.02)' }}>
            <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--amber)', marginBottom: '4px' }}>{stats.pendingReview}</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Pending review</div>
          </div>
          <div style={{ flex: 1, background: '#fff', border: '.5px solid var(--border)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 1px 2px rgba(27,58,92,0.02)' }}>
            <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--teal)', marginBottom: '4px' }}>{stats.published}</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Published</div>
          </div>
          <div style={{ flex: 1, background: '#fff', border: '.5px solid var(--border)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 1px 2px rgba(27,58,92,0.02)' }}>
            <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--navy)', marginBottom: '4px' }}>{stats.pendingRequests}</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Collab. requests</div>
          </div>
        </div>

        {/* Projects Submissions Section */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '1rem' }}>MY PROJECT SUBMISSIONS</div>
          
          <div style={{ background: '#fff', border: '.5px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 2fr) 1fr 1fr 1fr 120px', padding: '.75rem 1.25rem', borderBottom: '.5px solid var(--border)', fontSize: '11px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>
              <div>Project</div>
              <div>Status</div>
              <div>Type</div>
              <div>Requests</div>
              <div style={{ textAlign: 'right' }}>Actions</div>
            </div>
            
            {projects.map((proj, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 2fr) 1fr 1fr 1fr 120px', padding: '1rem 1.25rem', borderBottom: i === projects.length - 1 ? 'none' : '.5px solid var(--border)', alignItems: 'center', fontSize: '13px' }}>
                <div>
                  <div style={{ fontWeight: 500, color: 'var(--navy)', marginBottom: '4px' }}>{proj.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{proj.date || (proj.createdAt ? `Submitted ${new Date(proj.createdAt).toLocaleDateString()}` : '')}</div>
                </div>
                <div>
                  {proj.status === 'Pending' && <span style={{ fontSize: '10px', background: 'var(--amber-l)', color: '#B45309', padding: '3px 10px', borderRadius: '4px' }}>Pending</span>}
                  {((proj.status || proj.approvalStatus) === 'Published' || proj.approvalStatus === 'approved') && <span style={{ fontSize: '10px', background: 'var(--green-l)', color: 'var(--green)', padding: '3px 10px', borderRadius: '4px' }}>Published</span>}
                  {proj.status === 'Rejected' && <span style={{ fontSize: '10px', background: 'var(--red-l)', color: 'var(--red)', padding: '3px 10px', borderRadius: '4px' }}>Rejected</span>}
                </div>
                <div style={{ color: 'var(--text)' }}>{proj.type || 'Research Project'}</div>
                <div style={{ fontWeight: proj.requestsText === '4 new' ? 600 : 400, color: proj.requestsText === '4 new' ? 'var(--navy)' : 'var(--muted)' }}>{proj.requestsText || '—'}</div>
                <div style={{ textAlign: 'right' }}>
                  <button onClick={() => navigate('/dashboard/projects')} style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '5px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>{proj.action || 'View'}</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Requests Section */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '1rem' }}>COLLABORATION REQUESTS ON MY PROJECTS</div>
          
          <div style={{ background: '#fff', border: '.5px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 2fr) 2fr 1fr 1fr 80px', padding: '.75rem 1.25rem', borderBottom: '.5px solid var(--border)', fontSize: '11px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>
              <div>Applicant</div>
              <div>Project</div>
              <div>Institution</div>
              <div>Received</div>
              <div style={{ textAlign: 'right' }}>Actions</div>
            </div>
            
            {requests.map((req, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 2fr) 2fr 1fr 1fr 80px', padding: '1rem 1.25rem', borderBottom: i === requests.length - 1 ? 'none' : '.5px solid var(--border)', alignItems: 'center', fontSize: '13px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: req.color || 'var(--teal)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600 }}>
                    {req.initials || '??'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, color: 'var(--navy)' }}>{req.applicant || req.collaboratorName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{req.skills || 'Skills mapping'}</div>
                  </div>
                </div>
                <div style={{ color: 'var(--text)' }}>{req.project || req.projectTitle}</div>
                <div style={{ color: 'var(--text)' }}>{req.institution || 'MIT Manipal'}</div>
                <div style={{ color: 'var(--muted)' }}>{req.received || '2 days ago'}</div>
                <div style={{ textAlign: 'right' }}>
                  <button onClick={() => navigate('/dashboard/requests')} style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '5px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>View</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-navy" onClick={() => navigate('/dashboard/add-project')} style={{ padding: '8px 16px', fontSize: '13px' }}>+ Submit new project</button>
          <button className="btn" onClick={() => navigate('/dashboard/profile')} style={{ background: 'var(--teal)', color: '#fff', border: 'none', padding: '8px 16px', fontSize: '13px' }}>Edit my FYRC card</button>
        </div>

      </div>
    </div>
  );
}
