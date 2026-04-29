import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('admin_token');
  const [tab, setTab] = useState('dashboard');
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingProjects, setPendingProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const hdrs = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const load = async () => {
    try {
      const [pu, pp, ap] = await Promise.all([
        fetch(`${API}/api/admin/pending-users`, { headers: hdrs }).then(r => r.json()),
        fetch(`${API}/api/admin/pending-projects`, { headers: hdrs }).then(r => r.json()),
        fetch(`${API}/api/projects`, { headers: hdrs }).then(r => r.json()),
      ]);
      setPendingUsers(Array.isArray(pu) ? pu : []);
      setPendingProjects(Array.isArray(pp) ? pp : []);
      setAllProjects(Array.isArray(ap) ? ap : (ap?.data || []));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (!token) { navigate('/admin/login'); return; } load(); }, []);

  const action = async (type, id, status) => {
    const ep = type === 'user' ? `/api/admin/approve-user/${id}` : `/api/admin/approve-project/${id}`;
    await fetch(`${API}${ep}`, { method: 'POST', headers: hdrs, body: JSON.stringify({ status }) });
    load();
  };

  const handleLogout = () => { localStorage.removeItem('admin_token'); navigate('/admin/login'); };

  const published = allProjects.filter(p => p.approvalStatus === 'approved');
  const pendingCount = pendingUsers.length + pendingProjects.length;

  const subnav = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'pending', label: 'Pending', badge: pendingCount },
    { key: 'projects', label: 'All Projects' },
    { key: 'faculty', label: 'Faculty Accounts' },
  ];

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--muted)' }}>Loading Admin Dashboard…</div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'DM Sans',sans-serif" }}>
      {/* Topbar */}
      <div className="topbar" style={{ position: 'sticky', top: 0, zIndex: 200 }}>
        <div className="logo-box" style={{ background: 'var(--gold)', color: 'var(--navy)', fontFamily: 'Merriweather,serif', fontWeight: 700, fontSize: 16 }}>K</div>
        <div>
          <div className="brand" style={{ color: '#fff' }}>KMC · Department of AI in Healthcare</div>
          <div className="brand-sub" style={{ color: 'rgba(255,255,255,.45)' }}>FYRC — Find Your Research Collaborator Portal</div>
        </div>
        <div className="topnav">
          <button className={`tnb${tab === 'dashboard' ? ' active' : ''}`} onClick={() => setTab('dashboard')}>Admin Dashboard</button>
          <button className="tnb" onClick={() => navigate('/')}>Portal</button>
        </div>
        <div className="user-pill" style={{ marginLeft: 'auto' }}>
          <div className="user-av" style={{ background: 'var(--amber)' }}>AD</div>
          <div className="user-name">Admin</div>
        </div>
        <button onClick={handleLogout} title="Logout" style={{ marginLeft: 8, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
          <LogOut size={13} />
        </button>
      </div>

      {/* Subnav */}
      <div className="subnav-dark">
        {subnav.map(n => (
          <button key={n.key} className={`snb-dark${tab === n.key ? ' active' : ''}`} onClick={() => setTab(n.key)}>
            {n.label}{n.badge > 0 && <span className="badge-count" style={{ marginLeft: 4 }}>{n.badge}</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="pw" style={{ maxWidth: 1200, margin: '0 auto', paddingTop: '1.5rem', paddingBottom: '3rem' }}>

        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && (
          <div>
            <div className="page-title">Admin Dashboard</div>
            <div className="page-desc">Review pending submissions, manage faculty accounts, and oversee all portal content.</div>

            <div className="admin-stats">
              <div className="admin-stat"><div className="as-val" style={{ color: 'var(--amber)' }}>{pendingCount}</div><div className="as-label">Pending submissions</div><div className="as-delta">↑ Requires action</div></div>
              <div className="admin-stat"><div className="as-val" style={{ color: 'var(--navy)' }}>{published.length}</div><div className="as-label">Published projects</div></div>
              <div className="admin-stat"><div className="as-val" style={{ color: 'var(--teal)' }}>0</div><div className="as-label">Total collab. requests</div></div>
              <div className="admin-stat"><div className="as-val" style={{ color: 'var(--green)' }}>{allProjects.filter(p=>p.submitter).reduce((acc,p)=>{ if(!acc.includes(p.submitter?.id)) acc.push(p.submitter?.id); return acc; },[]).length}</div><div className="as-label">Active faculty accounts</div></div>
            </div>

            {/* Pending submissions */}
            <div className="section-head">Pending project submissions — requires action</div>
            <div className="at-wrap">
              <div className="at-head" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 160px' }}>
                <span>Project</span><span>Faculty</span><span>Type</span><span>Submitted</span><span>Actions</span>
              </div>
              {pendingProjects.length === 0 && <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>No pending project submissions.</div>}
              {pendingProjects.map(p => (
                <div key={p.id} className="at-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 160px', borderLeft: '3px solid var(--amber)' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--navy)' }}>{p.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{p.domain}</div>
                  </div>
                  <span style={{ fontSize: 12 }}>{p.submitter?.name || '—'}</span>
                  <span className="sp sp-pending">{(p.approvalStatus || '').replace('_', ' ')}</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}</span>
                  <div className="action-row">
                    <button className="act-btn act-approve" onClick={() => action('project', p.id, 'approved')}>Approve</button>
                    <button className="act-btn act-reject" onClick={() => action('project', p.id, 'rejected')}>Reject</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pending users */}
            {pendingUsers.length > 0 && (
              <>
                <div className="section-head" style={{ marginTop: '1.5rem' }}>Pending faculty registrations</div>
                <div className="at-wrap">
                  <div className="at-head" style={{ gridTemplateColumns: '2fr 1fr 1fr 160px' }}>
                    <span>Faculty</span><span>Department</span><span>Email</span><span>Actions</span>
                  </div>
                  {pendingUsers.map(u => (
                    <div key={u.id} className="at-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 160px', borderLeft: '3px solid var(--amber)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>{u.name?.[0]}</div>
                        <div style={{ fontSize: 12, fontWeight: 500 }}>{u.name}</div>
                      </div>
                      <span style={{ fontSize: 12 }}>{u.department || '—'}</span>
                      <span style={{ fontSize: 11, color: 'var(--muted)' }}>{u.email}</span>
                      <div className="action-row">
                        <button className="act-btn act-approve" onClick={() => action('user', u.id, 'approved')}>Approve</button>
                        <button className="act-btn act-reject" onClick={() => action('user', u.id, 'rejected')}>Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Published projects */}
            <div className="section-head" style={{ marginTop: '1.5rem' }}>All published projects</div>
            <div className="at-wrap">
              <div className="at-head" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 100px' }}>
                <span>Project</span><span>Faculty</span><span>Visibility</span><span>Status</span><span>Actions</span>
              </div>
              {published.length === 0 && <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>No published projects.</div>}
              {published.map(p => (
                <div key={p.id} className="at-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 100px' }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--navy)' }}>{p.title}</div>
                  <span style={{ fontSize: 12 }}>{p.submitter?.name || '—'}</span>
                  <span className={`sp ${p.visibility === 'private' ? 'sp-rejected' : 'sp-approved'}`}>{p.visibility === 'private' ? 'Private' : 'Public'}</span>
                  <span className="sp sp-approved">Active</span>
                  <div className="action-row">
                    <button className="act-btn act-edit" onClick={() => action('project', p.id, 'rejected')}>Unpublish</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Faculty accounts */}
            <div className="section-head" style={{ marginTop: '1.5rem' }}>Faculty accounts</div>
            <div className="at-wrap">
              <div className="at-head" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr 100px' }}>
                <span>Faculty</span><span>Dept.</span><span>Status</span><span>Projects</span><span>Actions</span>
              </div>
              {allProjects.filter(p => p.submitter?.name).reduce((acc, p) => {
                const exists = acc.find(f => f.email === p.submitter?.email);
                if (!exists) acc.push({ ...p.submitter, count: 1 });
                else exists.count++;
                return acc;
              }, []).map((f, i) => (
                <div key={i} className="at-row" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr 100px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>{f.name?.[0] || '?'}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>{f.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--muted)' }}>{f.email}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 12 }}>—</span>
                  <span className="sp sp-approved">Active</span>
                  <span style={{ fontSize: 12 }}>{f.count}</span>
                  <div className="action-row"><button className="act-btn act-view">View</button></div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '.75rem', marginTop: '.5rem' }}>
              <button className="btn btn-navy">+ Create faculty account</button>
              <button className="btn">Manage activities</button>
              <button className="btn">Manage courses</button>
            </div>
          </div>
        )}

        {/* ── PENDING TAB ── */}
        {tab === 'pending' && (
          <div>
            <div className="page-title">Approval Queue</div>
            <div className="page-desc">Manage institutional registrations and project submissions.</div>

            {pendingCount === 0 && (
              <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--muted)', fontSize: 13, background: '#fff', borderRadius: 12, border: '1px dashed #cbd5e1' }}>
                No pending approvals. You're all caught up! ✓
              </div>
            )}

            {pendingProjects.length > 0 && (
              <>
                <div className="section-head">Project Submissions ({pendingProjects.length})</div>
                <div className="at-wrap">
                  <div className="at-head" style={{ gridTemplateColumns: '2fr 1fr 1fr 160px' }}>
                    <span>Project</span><span>Faculty</span><span>Submitted</span><span>Actions</span>
                  </div>
                  {pendingProjects.map(p => (
                    <div key={p.id} className="at-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 160px', borderLeft: '3px solid var(--amber)' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--navy)' }}>{p.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--muted)' }}>{p.domain}</div>
                      </div>
                      <span style={{ fontSize: 12 }}>{p.submitter?.name || '—'}</span>
                      <span style={{ fontSize: 11, color: 'var(--muted)' }}>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}</span>
                      <div className="action-row">
                        <button className="act-btn act-approve" onClick={() => action('project', p.id, 'approved')}>Approve</button>
                        <button className="act-btn act-reject" onClick={() => action('project', p.id, 'rejected')}>Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {pendingUsers.length > 0 && (
              <>
                <div className="section-head" style={{ marginTop: '1.5rem' }}>Faculty Registrations ({pendingUsers.length})</div>
                <div className="at-wrap">
                  <div className="at-head" style={{ gridTemplateColumns: '2fr 1fr 1fr 120px' }}>
                    <span>Faculty</span><span>Department</span><span>Email</span><span>Actions</span>
                  </div>
                  {pendingUsers.map(u => (
                    <div key={u.id} className="at-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 120px', borderLeft: '3px solid var(--amber)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>{u.name?.[0]}</div>
                        <span style={{ fontSize: 12, fontWeight: 500 }}>{u.name}</span>
                      </div>
                      <span style={{ fontSize: 12 }}>{u.department || '—'}</span>
                      <span style={{ fontSize: 11, color: 'var(--muted)' }}>{u.email}</span>
                      <div className="action-row">
                        <button className="act-btn act-approve" onClick={() => action('user', u.id, 'approved')}>Approve</button>
                        <button className="act-btn act-reject" onClick={() => action('user', u.id, 'rejected')}>Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── PROJECTS TAB ── */}
        {tab === 'projects' && (
          <div>
            <div className="page-title">Project Repository</div>
            <div className="page-desc">Complete database of all research projects on the portal.</div>
            <div className="at-wrap">
              <div className="at-head" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 100px' }}>
                <span>Project</span><span>Faculty</span><span>Visibility</span><span>Status</span><span>Actions</span>
              </div>
              {allProjects.length === 0 && <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>No projects found.</div>}
              {allProjects.map(p => (
                <div key={p.id} className="at-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 100px' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--navy)' }}>{p.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{p.domain}</div>
                  </div>
                  <span style={{ fontSize: 12 }}>{p.submitter?.name || '—'}</span>
                  <span className={`sp ${p.visibility === 'private' ? 'sp-rejected' : 'sp-approved'}`}>{p.visibility === 'private' ? 'Private' : 'Public'}</span>
                  <span className={`sp ${p.approvalStatus === 'approved' ? 'sp-approved' : 'sp-pending'}`}>{p.approvalStatus === 'approved' ? 'Active' : 'Pending'}</span>
                  <div className="action-row">
                    {p.approvalStatus !== 'approved' && <button className="act-btn act-approve" onClick={() => action('project', p.id, 'approved')}>Approve</button>}
                    {p.approvalStatus === 'approved' && <button className="act-btn act-reject" onClick={() => action('project', p.id, 'rejected')}>Unpublish</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── FACULTY TAB ── */}
        {tab === 'faculty' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <div className="page-title">Faculty Accounts</div>
                <div className="page-desc">Manage verified researchers and institutional access.</div>
              </div>
              <button className="btn btn-navy">+ Create faculty account</button>
            </div>

            {pendingUsers.length > 0 && (
              <>
                <div className="section-head">Pending Approval ({pendingUsers.length})</div>
                <div className="at-wrap" style={{ marginBottom: '1.5rem' }}>
                  <div className="at-head" style={{ gridTemplateColumns: '2fr 1fr 1fr 120px' }}>
                    <span>Faculty</span><span>Department</span><span>Email</span><span>Actions</span>
                  </div>
                  {pendingUsers.map(u => (
                    <div key={u.id} className="at-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 120px', borderLeft: '3px solid var(--amber)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>{u.name?.[0]}</div>
                        <span style={{ fontSize: 12, fontWeight: 500 }}>{u.name}</span>
                      </div>
                      <span style={{ fontSize: 12 }}>{u.department || '—'}</span>
                      <span style={{ fontSize: 11, color: 'var(--muted)' }}>{u.email}</span>
                      <div className="action-row">
                        <button className="act-btn act-approve" onClick={() => action('user', u.id, 'approved')}>Approve</button>
                        <button className="act-btn act-reject" onClick={() => action('user', u.id, 'rejected')}>Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="section-head">Active Faculty</div>
            <div className="at-wrap">
              <div className="at-head" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr 80px' }}>
                <span>Faculty</span><span>Dept.</span><span>Status</span><span>Projects</span><span>Actions</span>
              </div>
              {allProjects.filter(p => p.submitter?.name).reduce((acc, p) => {
                const exists = acc.find(f => f.email === p.submitter?.email);
                if (!exists) acc.push({ ...p.submitter, count: 1 });
                else exists.count++;
                return acc;
              }, []).map((f, i) => (
                <div key={i} className="at-row" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr 80px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: i % 2 === 0 ? 'var(--navy)' : 'var(--teal)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>
                      {f.name?.split(' ').map(w => w[0]).join('').slice(0,2)}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>{f.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--muted)' }}>{f.email}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 12 }}>—</span>
                  <span className="sp sp-approved">Active</span>
                  <span style={{ fontSize: 12 }}>{f.count}</span>
                  <div className="action-row"><button className="act-btn act-view">View</button></div>
                </div>
              ))}
              {allProjects.filter(p => p.submitter?.name).length === 0 && (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>No active faculty found.</div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
