import { useContext } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import LockOverlay from '../components/LockOverlay';

// Reusing domain colors for styling
const DOMAIN_COLORS = {
  'Medical Imaging': '#1A7A6E',
  'NLP in Healthcare': '#1B3A5C',
  'Predictive Analytics': '#D4820A',
  'Federated Learning': '#C9553A',
  Genomics: '#7C3AED',
  default: '#1B3A5C',
}

function getInitials(name) {
  if (!name) return '??'
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function ProjectDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const project = location.state?.project;

  if (!project) {
    return <div className="pw">Loading or project not found...</div>;
  }

  const handleApplyClick = () => {
    navigate(`/apply/project/${id}`, { state: { project } });
  };

  const domain = project.domain || 'Medical Imaging';
  const avatarColor = DOMAIN_COLORS[domain] || DOMAIN_COLORS.default;
  const initials = getInitials(project.pi?.name || 'Priya Nair');

  const techStack = project.techStack || 'Python 3.11 · PyTorch 2.1 · FastAPI backend · React dashboard (in progress) · DICOM preprocessing pipeline with pydicom';
  const roleDescription = project.roleDescription || 'Fine-tune the ResNet-50 model on our annotated OCT dataset (12,000 scans). Integrate the trained model with the existing FastAPI endpoint. Collaborate directly with our clinical annotator to review false positives and refine the training loop.';

  const isPrivate = project.isPublic === false;
  const showLock = isPrivate && !user;

  const isAdminReview = user?.role === 'admin' && project.approvalStatus === 'pending_approval';

  const handleReviewAction = async (action) => {
    if (!window.confirm(`Are you sure you want to ${action} this project?`)) return;
    try {
      const res = await fetch(`http://localhost:3001/api/admin/projects/${project.id}/${action}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert(`Project ${action === 'approve' ? 'published' : 'rejected'} successfully.`);
        navigate('/admin/pending');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pw">
      {isAdminReview && (
        <div className="admin-review-bar">
          <div className="arb-info">
            <span className="arb-badge">Pending Verification</span>
            <span>You are reviewing this submission. Verify all details before publishing.</span>
          </div>
          <div className="arb-btns">
            <button className="arb-btn approve" onClick={() => handleReviewAction('approve')}>Approve & Publish</button>
            <button className="arb-btn reject" onClick={() => handleReviewAction('reject')}>Reject Submission</button>
          </div>
        </div>
      )}

      <button className="back-btn" onClick={() => navigate(-1)}>← Back to results</button>
      
      {showLock ? (
        <div className="locked-detail-view">
          <div className="detail-header" style={{ marginBottom: '2rem' }}>
            <div className="dh-top">
              <div className="dh-av" style={{ background: avatarColor }}>{initials}</div>
              <div style={{ flex: 1 }}>
                <div className="dh-title">{project.title}</div>
                <div className="dh-pi">{project.pi?.name || 'Dr. Priya Nair'} · {project.pi?.dept || 'Ophthalmology, KMC Manipal'}</div>
                <div className="dh-meta">
                  <span className={`pc-tag ${project.status === 'ongoing' || !project.status ? 'tag-status-on' : 'tag-status-up'}`}>
                    {project.status === 'upcoming' ? 'Upcoming' : 'Ongoing'}
                  </span>
                  <span className="pc-tag tag-domain">{domain}</span>
                  <span className="pc-tag" style={{background:'#FDE68A',color:'#B45309'}}>🔒 Private Project</span>
                </div>
              </div>
            </div>
          </div>
          <LockOverlay />
        </div>
      ) : (
        <div className="split-wide">
        <div>
          <div className="detail-header">
            <div className="dh-top">
              <div className="dh-av" style={{ background: avatarColor }}>{initials}</div>
              <div style={{ flex: 1 }}>
                <div className="dh-title">{project.title}</div>
                <div className="dh-pi">{project.pi?.name || 'Dr. Priya Nair'} · {project.pi?.dept || 'Ophthalmology, KMC Manipal'}</div>
                <div className="dh-meta">
                  <span className={`pc-tag ${project.status === 'ongoing' || !project.status ? 'tag-status-on' : 'tag-status-up'}`}>
                    {project.status === 'upcoming' ? 'Upcoming' : 'Ongoing'}
                  </span>
                  <span className="pc-tag tag-domain">{domain}</span>
                  {project.skills?.slice(0,3).map(s => <span key={s} className="pc-tag tag-skill">{s}</span>)}
                  {project.isPublic !== false ? <span className="pc-tag tag-public">Public</span> : <span className="pc-tag" style={{background:'#FDE68A',color:'#B45309'}}>Private</span>}
                </div>
              </div>
            </div>
            <div className="ds-grid">
              <div className="ds-item"><div className="ds-label">Role being sought</div><div className="ds-val">ML Engineer</div></div>
              <div className="ds-item"><div className="ds-label">Time commitment</div><div className="ds-val">{project.hoursPerWeek || '10-12'} hrs/week</div></div>
              <div className="ds-item"><div className="ds-label">Type</div><div className="ds-val">{project.type === 'paper' ? 'Paper / Publication' : 'Research Project'}</div></div>
              <div className="ds-item"><div className="ds-label">IRB Status</div><div className="ds-val" style={{ color: '#16a34a' }}>✓ Approved (MAHE-IEC-2024-018)</div></div>
            </div>
          </div>

          <div className="detail-section">
            <div className="ds-title" style={{ textTransform: 'uppercase' }}>The Clinical Problem</div>
            <div className="ds-content">{project.description || 'Diabetic retinopathy is the leading cause of blindness in working-age adults in India. Current screening requires specialist ophthalmologists, creating a severe bottleneck in tier-2 cities. Early detection using AI can reduce the burden on specialists by up to 70% and catch cases before vision loss becomes irreversible.'}</div>
          </div>

          <div className="detail-section">
            <div className="ds-title" style={{ textTransform: 'uppercase' }}>Current Tech Stack</div>
            <div className="ds-content" style={{ fontFamily: 'monospace', fontSize: '13px', background: '#f9fafb', padding: '10px', borderRadius: '6px' }}>
              {techStack}
            </div>
          </div>

          <div className="detail-section">
            <div className="ds-title" style={{ textTransform: 'uppercase' }}>Your Role As Collaborator</div>
            <div className="ds-content">{roleDescription}</div>
          </div>

          <div className="detail-section">
            <div className="ds-title" style={{ textTransform: 'uppercase' }}>Skills needed</div>
            <div className="chips-row">
              {project.skills?.length > 0 ? project.skills.map(s => (
                <span key={s} className="chip" style={{ background: '#EEEDFE', color: '#3C3489' }}>
                  {s}
                </span>
              )) : (
                 <>
                   <span className="chip" style={{ background: '#EEEDFE', color: '#3C3489' }}>Python</span>
                   <span className="chip" style={{ background: '#EEEDFE', color: '#3C3489' }}>PyTorch</span>
                   <span className="chip" style={{ background: '#EEEDFE', color: '#3C3489' }}>Computer Vision</span>
                   <span className="chip" style={{ background: '#EEEDFE', color: '#3C3489' }}>DICOM</span>
                   <span className="chip" style={{ background: '#EEEDFE', color: '#3C3489' }}>ResNet / CNN architectures</span>
                 </>
              )}
            </div>
          </div>

          <div className="detail-section">
            <div className="ds-title" style={{ textTransform: 'uppercase' }}>What you get</div>
            <div className="perks-row">
              {project.perks?.length > 0 ? project.perks.map(p => (
                <span key={p} className="perk-pill">{p}</span>
              )) : (
                <>
                  <span className="perk-pill">Co-authorship on journal paper</span>
                  <span className="perk-pill">Clinical dataset access (IRB approved)</span>
                  <span className="perk-pill">Letter of Recommendation</span>
                </>
              )}
            </div>
          </div>

          {!user && (
            <div className="lock-banner">
               🔒 <div>You need to <Link to="/login" style={{ color: 'var(--navy)', fontWeight: 600 }}>create a free account</Link> to apply for this project.</div>
            </div>
          )}
        </div>

        {/* Right side sticky */}
        <div style={{ position: 'sticky', top: '80px' }}>
          <div style={{ background: '#fff', border: '.5px solid var(--border)', borderRadius: '12px', padding: '1.1rem', marginBottom: '.75rem', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '.5rem', textTransform: 'uppercase', letterSpacing: '.06em' }}>Your match score</div>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', margin: '0 auto .75rem' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--teal)' }}>{user ? '91%' : '—'}</div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '.75rem', lineHeight: 1.6 }}>
              {user ? "3 of your skills match this project's requirements" : "Login to see your match score"}
            </div>
            
            {!user ? (
               <button className="collab-btn" style={{ width: '100%', background: 'var(--navy)' }} onClick={() => navigate('/login')}>Login to collaborate</button>
            ) : project.createdBy === user.id ? (
               <div style={{ fontSize: '12px', color: 'var(--muted)' }}>You created this project</div>
            ) : (
               <button className="collab-btn" style={{ width: '100%', fontSize: '13px', background: 'var(--navy)' }} onClick={handleApplyClick}>Collaborate on this project →</button>
            )}
          </div>

          {/* Principal Investigator card */}
          <div style={{ background: '#fff', border: '.5px solid var(--border)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '.75rem', textTransform: 'uppercase', letterSpacing: '.06em' }}>PRINCIPAL INVESTIGATOR</div>
            <div style={{ borderTop: '.5px solid var(--border)', marginBottom: '.75rem' }}></div>
            
            <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center', marginBottom: '.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: avatarColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600 }}>
                {initials}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy)' }}>{project.pi?.name || 'Dr. Priya Nair'}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{project.pi?.designation || 'Assistant Prof'} · {project.pi?.dept || 'Ophthalmology'}</div>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
              <div>
                 <div style={{ color: 'var(--muted)', marginBottom: '2px' }}>h-index</div>
                 <div style={{ color: 'var(--navy)', fontWeight: 500 }}>9</div>
              </div>
              <div>
                 <div style={{ color: 'var(--muted)', marginBottom: '2px' }}>Publications</div>
                 <div style={{ color: 'var(--navy)', fontWeight: 500 }}>18</div>
              </div>
              <div>
                 <div style={{ color: 'var(--muted)', marginBottom: '2px' }}>Scopus ID</div>
                 <div style={{ color: 'var(--navy)', fontWeight: 500 }}>57201234567</div>
              </div>
              <div>
                 <div style={{ color: 'var(--muted)', marginBottom: '2px' }}>ORCID</div>
                 <div style={{ color: 'var(--navy)', fontWeight: 500 }}>0000-0001-...</div>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
