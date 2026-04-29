import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { LogOut } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const COLORS = ['#1A7A6E','#1B3A5C','#D4820A','#C9553A','#7C3AED'];

export default function Dashboard() {
  const { setRole } = useUser();
  const navigate = useNavigate();
  const token = localStorage.getItem('faculty_token');
  const [view, setView] = useState('faculty');
  const [projects, setProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [stats, setStats] = useState({ pending: 0, published: 0, requests: 0 });
  const [formState, setFormState] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  let userName = 'Researcher';
  try { const p = JSON.parse(atob(token.split('.')[1])); userName = p.name || p.email?.split('@')[0] || 'Researcher'; } catch {}
  const initials = userName.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetch(`${API}/api/projects`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(data => {
        const all = Array.isArray(data) ? data : [];
        setProjects(all);
        let payload = {};
        try { payload = JSON.parse(atob(token.split('.')[1])); } catch {}
        const mine = all.filter(p => p.submitter?.id === payload.id || p.submitter?.email === payload.email);
        setMyProjects(mine.length > 0 ? mine : []);
        setStats({
          pending: (mine.length > 0 ? mine : all).filter(p => p.approvalStatus !== 'approved').length,
          published: (mine.length > 0 ? mine : all).filter(p => p.approvalStatus === 'approved').length,
          requests: 0
        });
      }).catch(() => {});
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('faculty_token');
    setRole('public');
    navigate('/login');
  };

  const statusPill = (s) => {
    if (s === 'approved') return <span className="sp sp-approved">Published</span>;
    if (s === 'rejected') return <span className="sp sp-rejected">Rejected</span>;
    return <span className="sp sp-pending">Pending</span>;
  };

  const navItems = [
    { key: 'faculty', label: 'My Dashboard' },
    { key: 'projects', label: 'Find a Project' },
    { key: 'seekers', label: 'Find a Collaborator' },
    { key: 'prefs', label: 'My Collaboration Preferences' },
    { key: 'profile', label: 'My Profile' },
  ];

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
          {navItems.slice(0,3).map(n => (
            <button key={n.key} className={`tnb${view === n.key ? ' active' : ''}`} onClick={() => setView(n.key)}>{n.label}</button>
          ))}
        </div>
        <div className="user-pill" style={{ marginLeft: 'auto' }}>
          <div className="user-av">{initials}</div>
          <div className="user-name">{userName}</div>
        </div>
        <button onClick={handleLogout} title="Logout" style={{ marginLeft: 8, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
          <LogOut size={13} />
        </button>
      </div>

      {/* Subnav */}
      <div className="subnav-dark">
        {navItems.map(n => (
          <button key={n.key} className={`snb-dark${view === n.key ? ' active' : ''}`} onClick={() => setView(n.key)}>{n.label}</button>
        ))}
      </div>

      {/* Content */}
      <div className="pw" style={{ maxWidth: 1100, margin: '0 auto', paddingTop: '1.5rem', paddingBottom: '3rem' }}>

        {/* ── FACULTY DASHBOARD ── */}
        {view === 'faculty' && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <div className="page-title">Faculty Dashboard</div>
              <div className="page-desc">Manage your submitted projects, FYRC card, and view collaboration requests from researchers.</div>
            </div>

            <div className="fac-stats">
              <div className="fac-stat"><div className="fs-val" style={{ color: 'var(--amber)' }}>{stats.pending}</div><div className="fs-label">Pending review</div></div>
              <div className="fac-stat"><div className="fs-val" style={{ color: 'var(--teal)' }}>{stats.published}</div><div className="fs-label">Published</div></div>
              <div className="fac-stat"><div className="fs-val" style={{ color: 'var(--navy)' }}>{stats.requests}</div><div className="fs-label">Collab. requests</div></div>
            </div>

            <div className="section-head">My project submissions</div>
            <div className="at-wrap">
              <div className="at-head" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 120px' }}>
                <span>Project</span><span>Status</span><span>Type</span><span>Requests</span><span>Actions</span>
              </div>
              {myProjects.length === 0 && (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>No projects submitted yet.</div>
              )}
              {myProjects.map((p, i) => (
                <div key={i} className="at-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 120px' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--navy)' }}>{p.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{p.createdAt ? `Submitted ${new Date(p.createdAt).toLocaleDateString()}` : ''}</div>
                  </div>
                  {statusPill(p.approvalStatus)}
                  <span style={{ fontSize: 12 }}>{p.type || 'Research Project'}</span>
                  <span style={{ fontSize: 12 }}>—</span>
                  <div className="action-row">
                    <button className="act-btn act-edit" onClick={() => setView('projects')}>View</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="section-head" style={{ marginTop: '1.5rem' }}>Collaboration requests on my projects</div>
            <div className="at-wrap">
              <div className="at-head" style={{ gridTemplateColumns: '1fr 1.5fr 1fr 1fr 100px' }}>
                <span>Applicant</span><span>Project</span><span>Institution</span><span>Received</span><span>Actions</span>
              </div>
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>No collaboration requests yet.</div>
            </div>

            <div style={{ display: 'flex', gap: '.75rem', marginTop: '.5rem' }}>
              <button className="btn btn-navy" onClick={() => setView('projects')}>+ Submit new project</button>
              <button className="btn" style={{ background: 'var(--teal)', color: '#fff', border: 'none' }}>Edit my FYRC card</button>
            </div>
          </div>
        )}

        {/* ── FIND A PROJECT ── */}
        {view === 'projects' && (
          <div>
            {formState ? (
              <CollabForm formState={formState} submitted={submitted} setSubmitted={setSubmitted} onBack={() => setFormState(null)} />
            ) : (
              <div className="split">
                <div className="sb-sidebar">
                  <div className="sb-header">Refine Search <button className="sb-clear">Clear all</button></div>
                  <div className="sb-section">
                    <div className="sb-title">Status</div>
                    <div className="sb-options">
                      <label className="sb-opt"><input type="radio" name="st" defaultChecked /> Open to All</label>
                      <label className="sb-opt"><input type="radio" name="st" /> Ongoing</label>
                      <label className="sb-opt"><input type="radio" name="st" /> Upcoming</label>
                    </div>
                  </div>
                  <div className="sb-section">
                    <div className="sb-title">Domain</div>
                    <div className="sb-options">
                      {['Medical Imaging','NLP in Healthcare','Predictive Analytics','Federated Learning','Genomics'].map(d => (
                        <label key={d} className="sb-opt"><input type="checkbox" /> {d}</label>
                      ))}
                    </div>
                  </div>
                  <div className="sb-section">
                    <div className="sb-title">Visibility</div>
                    <div className="sb-options">
                      <label className="sb-opt"><input type="radio" name="vis" defaultChecked /> All</label>
                      <label className="sb-opt"><input type="radio" name="vis" /> Public only</label>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="results-header">
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>Projects matching your profile</div>
                      <div className="results-count">Showing {projects.filter(p => p.approvalStatus === 'approved').length} projects</div>
                    </div>
                    <select className="sort-sel"><option>Best match</option><option>Newest first</option></select>
                  </div>
                  {projects.filter(p => p.approvalStatus === 'approved').map((p, i) => (
                    <div key={i} className={`project-card${i === 0 ? ' featured' : ''}`}>
                      <div>
                        <div className="pc-top">
                          <div className="pc-avatar" style={{ background: COLORS[i % COLORS.length] }}>
                            {(p.pi?.name || p.piName || 'PI').split(' ').map(w => w[0]).join('').slice(0,2)}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div className="pc-title">{p.title}</div>
                            <div className="pc-pi">{p.pi?.name || p.piName || ''} · {p.domain || ''}</div>
                          </div>
                        </div>
                        <div className="pc-meta">
                          <span className={`pc-tag tag-status-${p.status === 'ongoing' ? 'on' : 'up'}`}>{p.status || 'Ongoing'}</span>
                          <span className="pc-tag tag-domain">{p.domain}</span>
                          {(p.skills || []).slice(0,3).map(s => <span key={s} className="pc-tag tag-skill">{s}</span>)}
                          <span className={`pc-tag ${p.visibility === 'private' ? 'tag-private' : 'tag-public'}`}>{p.visibility === 'private' ? '🔒 Private' : '🌐 Public'}</span>
                        </div>
                        <div className="pc-abstract">{p.shortDescription || p.abstract || ''}</div>
                        <div className="pc-footer">
                          {(p.perks || []).map(pk => <span key={pk} className="pc-perk">✓ {pk}</span>)}
                        </div>
                      </div>
                      <div className="pc-right">
                        <div className="match-ring">
                          <div className="match-score-big">—</div>
                          <div className="match-label">match</div>
                        </div>
                        <button className="collab-btn" onClick={() => { setFormState({ type: 'project', project: p }); setSubmitted(false); }}>
                          Collaborate
                        </button>
                      </div>
                    </div>
                  ))}
                  {projects.filter(p => p.approvalStatus === 'approved').length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)', fontSize: 13 }}>No published projects yet.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── FIND A COLLABORATOR ── */}
        {view === 'seekers' && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)', fontSize: 13 }}>
            <div style={{ fontSize: 22, marginBottom: 12 }}>👥</div>
            <div style={{ fontWeight: 600, color: 'var(--navy)', marginBottom: 8 }}>Researcher profiles coming soon</div>
            Researchers who register and create FYRC cards will appear here.
          </div>
        )}

        {/* ── PREFS ── */}
        {view === 'prefs' && (
          <div style={{ maxWidth: 780 }}>
            <div className="page-title">My Collaboration Preferences</div>
            <div className="page-desc">These settings determine what projects and collaborators appear on your matches every day.</div>
            {[
              { title: 'Research domains', rows: [{ icon: '🔬', name: 'Primary domain', val: 'Medical Imaging, NLP in Healthcare' }, { icon: '🔎', name: 'Secondary domains', val: 'Predictive Analytics' }] },
              { title: 'Project preferences', rows: [{ icon: '📋', name: 'Project type', val: 'Research Project, Paper / Publication' }, { icon: '⏱', name: 'Time commitment', val: '6–10 hrs/week' }, { icon: '🏆', name: 'Perks I prefer', val: 'Co-authorship, Letter of Recommendation' }] },
              { title: 'Collaborator preferences', rows: [{ icon: '🎓', name: 'Designation', val: 'Open to All' }, { icon: '🏥', name: 'Department', val: 'KMC, MIT Manipal, External' }, { icon: '💻', name: 'Mode preference', val: 'Hybrid, Remote' }] },
            ].map(sec => (
              <div key={sec.title} className="pref-section">
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '.5rem' }}>{sec.title}</div>
                {sec.rows.map(r => (
                  <div key={r.name} className="pref-row">
                    <div className="pref-left">
                      <div className="pref-icon" style={{ background: '#EEF3FA' }}>{r.icon}</div>
                      <div><div className="pref-name">{r.name}</div><div className="pref-val">{r.val}</div></div>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>›</span>
                  </div>
                ))}
              </div>
            ))}
            <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button className="btn">Reset to defaults</button>
              <button className="btn btn-navy">Save preferences</button>
            </div>
          </div>
        )}

        {/* ── PROFILE ── */}
        {view === 'profile' && (
          <div>
            <div className="page-title" style={{ marginBottom: '1rem' }}>My Profile</div>
            <div style={{ display: 'grid', gridTemplateColumns: '280px minmax(0,1fr)', gap: '1.25rem' }}>
              <div style={{ background: '#fff', border: '.5px solid var(--border)', borderRadius: 12, overflow: 'hidden', alignSelf: 'start' }}>
                <div style={{ background: 'var(--navy)', padding: '1.5rem 1rem', textAlign: 'center' }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, color: 'var(--navy)', margin: '0 auto .75rem', border: '3px solid rgba(255,255,255,.3)' }}>{initials}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 3 }}>{userName}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)' }}>FYRC Member</div>
                </div>
                <div style={{ padding: '1rem' }}>
                  {[{ icon: '✏️', label: 'Edit personal info' }, { icon: '🔬', label: 'Edit research expertise' }, { icon: '📅', label: 'Edit availability calendar' }, { icon: '🔍', label: 'View FYRC card preview' }].map(a => (
                    <div key={a.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '.45rem .5rem', fontSize: 12, color: 'var(--navy)', cursor: 'pointer', borderRadius: 6 }}
                      onMouseOver={e => e.currentTarget.style.background = '#f0f4fa'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                      <span style={{ fontSize: 14, width: 20, textAlign: 'center' }}>{a.icon}</span>{a.label}
                    </div>
                  ))}
                  <div style={{ borderTop: '.5px solid var(--border)', margin: '.5rem 0' }} />
                  <div onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '.45rem .5rem', fontSize: 12, color: 'var(--red)', cursor: 'pointer', borderRadius: 6 }}>
                    <span style={{ fontSize: 14, width: 20, textAlign: 'center' }}>🚪</span>Logout
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                {[
                  { title: 'A · Personal information', fields: [['Full name', userName], ['Email', '—'], ['Department', '—'], ['Institution', 'MAHE, Manipal']] },
                  { title: 'B · Academic identity', fields: [['Designation', '—'], ['h-index', '—'], ['Publications', '—'], ['ORCID', '—']] },
                ].map(sec => (
                  <div key={sec.title} style={{ background: '#fff', border: '.5px solid var(--border)', borderRadius: 12, padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.75rem' }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{sec.title}</div>
                      <button style={{ fontSize: 11, color: 'var(--teal)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Edit</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.6rem' }}>
                      {sec.fields.map(([l, v]) => (
                        <div key={l}>
                          <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{l}</div>
                          <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function CollabForm({ formState, submitted, setSubmitted, onBack }) {
  const { project } = formState;
  return (
    <div style={{ maxWidth: 680 }}>
      <button className="back-btn" onClick={onBack}>← Back to projects</button>
      <div style={{ background: '#fff', border: '.5px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div className="modal-head"><h3>Apply to collaborate — {project?.title?.substring(0,50)}…</h3></div>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1.25rem' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--green-l)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: 22, color: 'var(--green)' }}>✓</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--navy)', marginBottom: '.5rem' }}>Application submitted!</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, marginBottom: '1.25rem' }}>The PI will review your application and respond within 5 working days via your email.</div>
            <button className="btn btn-navy" onClick={onBack}>← Back to portal</button>
          </div>
        ) : (
          <div style={{ padding: '1.25rem' }}>
            <div className="form-note">This is an application pitch — not a generic contact form. Be specific about your experience with the skills listed.</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
              <div className="fi"><label>Full name <span className="req">*</span></label><input type="text" placeholder="Your full name" /></div>
              <div className="fi"><label>Email <span className="req">*</span></label><input type="email" placeholder="you@institution.edu" /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
              <div className="fi"><label>Institution</label><input type="text" placeholder="KMC / MIT Manipal / Independent" /></div>
              <div className="fi"><label>ORCID / Scopus ID</label><input type="text" placeholder="0000-0000-0000-0000" /></div>
            </div>
            <div className="fi"><label>Availability <span className="req">*</span></label>
              <select><option>-- select --</option><option>5–8 hrs/week</option><option>8–12 hrs/week</option><option>12+ hrs/week</option></select>
            </div>
            <div className="fi">
              <label>Why are you a good fit? <span className="req">*</span></label>
              <textarea rows={4} placeholder="Describe your relevant experience with the skills listed in this project..." style={{ resize: 'vertical' }} />
            </div>
            <button className="submit-btn" onClick={() => setSubmitted(true)}>Submit application →</button>
          </div>
        )}
      </div>
    </div>
  );
}
