import React, { useContext } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

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

export default function SeekerDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const researcher = location.state?.researcher;

  if (!researcher) {
    return <div className="pw">Loading or researcher not found...</div>;
  }

  const handleApplyClick = () => {
    navigate(`/apply/seeker/${id}`, { state: { researcher } });
  };

  const domain = researcher.domain?.[0] || 'Unknown Domain';
  const avatarColor = DOMAIN_COLORS[domain] || DOMAIN_COLORS.default;
  const initials = getInitials(researcher.name);

  return (
    <div className="pw">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back to results</button>
      
      <div className="split-wide">
        <div>
          <div className="detail-header">
            <div className="dh-top">
              <div className="dh-av" style={{ background: avatarColor }}>{initials}</div>
              <div style={{ flex: 1 }}>
                <div className="dh-title">{researcher.name}</div>
                <div className="dh-pi">{researcher.designation || 'Assistant Professor'} · {researcher.department || 'Department of AI in Healthcare, MAHE Manipal'}</div>
                <div className="dh-meta">
                  {researcher.domain?.map(d => <span key={d} className="pc-tag tag-domain">{d}</span>)}
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '2px 8px', borderRadius: '99px', background: 'var(--green-l)', color: 'var(--green)', fontWeight: 500 }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }}></span>
                    Available
                  </span>
                </div>
              </div>
            </div>
            
            <div className="ds-grid">
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 <div className="ds-item"><div className="ds-label">Scopus ID</div><div className="ds-val" style={{ color: 'var(--teal)' }}>{researcher.scopusId || '57200412888'}</div></div>
                 <div className="ds-item"><div className="ds-label">h-index</div><div className="ds-val">{researcher.hIndex || 8}</div></div>
                 <div className="ds-item"><div className="ds-label">Discussion hours</div><div className="ds-val">{researcher.discussionHours || 'Mon/Wed 4–5:30 PM IST'}</div></div>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 <div className="ds-item"><div className="ds-label">ORCID</div><div className="ds-val" style={{ color: 'var(--teal)' }}>{researcher.orcid || '0000-0002-1234-5678'}</div></div>
                 <div className="ds-item"><div className="ds-label">Publications</div><div className="ds-val">{researcher.publications || 24}</div></div>
                 <div className="ds-item"><div className="ds-label">Mode</div><div className="ds-val">{researcher.mode || 'Hybrid (Manipal + Remote)'}</div></div>
               </div>
            </div>
          </div>

          {/* FYRC Card full view */}
          <div className="detail-section">
            <div className="ds-title">FYRC Card — Research identity</div>
            <div className="fyrc-mini">
              <div className="fyrc-hdr">
                <div className="fyrc-ht">Find Your Research Collaborator (FYRC) Portal</div>
                <div className="fyrc-hs">KMC · AI in Healthcare · MAHE</div>
              </div>
              <div className="fyrc-body">
                <div className="fyrc-l">
                  <div className="fyrc-di"><div className="fyrc-bul"></div>{researcher.designation || 'Researcher'}</div>
                  <div className="fyrc-di"><div className="fyrc-bul"></div>{researcher.department || 'Department'}</div>
                  <div className="fyrc-di"><div className="fyrc-bul"></div>{researcher.institution || 'Institution'}</div>
                  <div className="fyrc-con">
                    <div className="fyrc-em">{researcher.email || 'Email missing'}</div>
                    <div className="fyrc-tr">
                      <span className="fyrc-tl fyrc-un">Unavail.</span>
                      <div className="mt2"></div>
                      <span className="fyrc-tl fyrc-av2">Available</span>
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="fyrc-exp">
                    <div className="fyrc-expt" style={{color:'#fff'}}>My research expertise</div>
                    {researcher.skills?.slice(0,3).map(skill => (
                      <div key={skill} className="fyrc-ei">
                        <span className="fyrc-ck" style={{color:'#fff'}}>✓</span>
                        <span className="fyrc-et" style={{color:'#fff'}}>{skill}</span>
                      </div>
                    ))}
                    {!researcher.skills?.length && <div className="fyrc-et" style={{color:'#fff'}}>Research focus mapping in progress</div>}
                  </div>
                  
                  {/* Mock calendar */}
                  <div className="fyrc-cal-mini">
                    <div className="fyrc-cal-title">Available for discussion · Mon/Wed 4–5:30 PM</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'auto repeat(7, 1fr)', gap: '1px', fontSize: '8px' }}>
                      <div />
                      {['M','T','W','T','F','S','S'].map((d,i) => <div key={i} style={{textAlign:'center',color:'#6B7A8D'}}>{d}</div>)}
                      {['W1','W2','W3','W4'].map((w,wi) => (
                        <React.Fragment key={wi}>
                          <div style={{color:'#6B7A8D'}}>{w}</div>
                          {[1,0,1,0,0,0,0].map((s,si) => (
                            <div key={si} style={{height:'12px',background:s?'#1B3A5C':'#f3f4f6',borderRadius:'2px',display:'flex',justifyContent:'center',alignItems:'center',color:s?'#fff':'#d1d5db'}}>{['M','T','W','T','F','S','S'][si]}</div>
                          ))}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="fyrc-bot">
                <div className="fyrc-res">
                  <div className="fyrc-rst" style={{color:'var(--teal)'}}>Resources I can provide:</div>
                  <div className="fyrc-ri"><div className="fyrc-cb"></div><span className="fyrc-rt" style={{color:'var(--teal)'}}>Domain expertise and clinical view</span></div>
                  <div className="fyrc-ri"><div className="fyrc-cb"></div><span className="fyrc-rt" style={{color:'var(--teal)'}}>Potential clinical datasets</span></div>
                </div>
                <div className="fyrc-sk">
                  <div className="fyrc-skt" style={{color:'var(--amber)'}}>I am seeking:</div>
                  <div className="fyrc-si"><div className="fyrc-scb"></div><span className="fyrc-st" style={{color:'#78350F'}}>Technical partners (ML/AI)</span></div>
                  <div className="fyrc-si"><div className="fyrc-scb"></div><span className="fyrc-st" style={{color:'#78350F'}}>Statistical analysts</span></div>
                </div>
              </div>
              <div className="fyrc-ft"><div className="fyrc-ftxt">Find the missing piece of puzzle to expand to newer horizons of interdisciplinary research</div></div>
            </div>
          </div>
          
          {!user && (
            <div className="lock-banner" style={{ marginTop: '1rem' }}>
              🔒 <div>You need to <Link to="/login" style={{ color: 'var(--navy)', fontWeight: 600 }}>create a free account</Link> to request a meeting.</div>
            </div>
          )}
        </div>

        {/* Right side sticky */}
        <div style={{ position: 'sticky', top: '80px' }}>
          <div style={{ background: '#fff', border: '.5px solid var(--border)', borderRadius: '12px', padding: '1.1rem', marginBottom: '.75rem', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '.5rem', textTransform: 'uppercase', letterSpacing: '.06em' }}>Your match score</div>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', margin: '0 auto .75rem' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--teal)' }}>{user ? '78%' : '—'}</div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '.75rem', lineHeight: 1.6 }}>
               {user ? "Your skills align with what this researcher is seeking" : "Login to view match compatibility"}
            </div>
            
            {!user ? (
               <button className="collab-btn" style={{ width: '100%' }} onClick={() => navigate('/login')}>Login to request meet</button>
            ) : user.id === researcher._id || user.id === researcher.id ? (
               <div style={{ fontSize: '12px', color: 'var(--muted)' }}>This is your public profile</div>
            ) : (
               <button className="collab-btn teal" style={{ width: '100%', fontSize: '13px' }} onClick={handleApplyClick}>Request a meet →</button>
            )}
          </div>
          
          <div style={{ background: 'var(--amber-l)', border: '.5px solid #FDE68A', borderRadius: '10px', padding: '.85rem 1rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--amber)', marginBottom: '.5rem' }}>Urgency level: {researcher.urgency || '8 / 10'}</div>
            <div style={{ fontSize: '11px', color: '#78350F', lineHeight: 1.6 }}>
              This researcher needs a collaborator soon. They are looking for someone who can start within the next 2-4 weeks.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
