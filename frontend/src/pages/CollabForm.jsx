import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export default function CollabForm() {
  const { type, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract from state if passed via navigation, or mock for testing
  const targetData = location.state?.project || location.state?.researcher || null;
  const isProject = type === 'project';
  const targetTitle = isProject 
    ? (targetData?.title || 'Project') 
    : (targetData?.name || 'Researcher');

  const [step, setStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institution: '',
    orcid: '',
    availability: '',
    pitch: '',
    meetTime: '',
    offlineConfirm: false
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  if (formSubmitted) {
    return (
      <div className="pw" style={{ maxWidth: '680px' }}>
        <button className="back-btn" onClick={handleBack}>← Back to details</button>
        <div style={{ background: '#fff', border: '.5px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <div className="modal-head">
            <h3>{isProject ? 'Application submitted' : 'Meet request sent'}</h3>
          </div>
          <div className="success-state">
            <div className="success-icon">✓</div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--navy)', marginBottom: '.5rem' }}>
              {isProject ? 'Application submitted!' : 'Meet request sent!'}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              {isProject 
                ? 'The PI will review your application and respond within 5 working days via your email.'
                : 'The researcher will confirm the meeting details within 3 working days. Check your institutional email for confirmation.'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', background: '#f9fafb', borderRadius: '6px', padding: '.5rem .75rem', marginBottom: '1rem' }}>
              Routed to: aihealthcarekmc@manipal.edu
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text)', background: 'var(--teal-l)', borderRadius: '8px', padding: '.75rem 1rem', textAlign: 'left', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--teal)', marginBottom: '.35rem' }}>What happens next</div>
              {isProject ? (
                <>1. PI reviews your pitch and portfolio<br/>2. If shortlisted, you receive a calendar invite for an intro call<br/>3. Project onboarding and NDA signing (if applicable)</>
              ) : (
                <>1. Researcher confirms the meeting<br/>2. You receive time, date and location/video link via email<br/>3. Attend the discovery meeting — bring a brief intro of your work</>
              )}
            </div>
            <button className="btn btn-navy" onClick={() => navigate(isProject ? '/' : '/collaborators')}>← Back to portal</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pw" style={{ maxWidth: '680px' }}>
      <button className="back-btn" onClick={handleBack}>← Back to {isProject ? 'project' : 'results'}</button>
      
      <div style={{ background: '#fff', border: '.5px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <div className="modal-head">
          <h3>{isProject ? `Apply to collaborate — ${targetTitle.substring(0, 50)}…` : `Request a meet — ${targetTitle}`}</h3>
          <button className="modal-close" onClick={handleBack} style={{ fontSize: '18px', paddingBottom: '3px' }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.25rem' }}>
          
          {isProject ? (
            // =========================
            // PROJECT FLOW: Multi-step
            // =========================
            <>
              <div className="step-bar">
                <div className="step-dot done">✓</div>
                <div className="step-line done"></div>
                <div className="step-dot done">✓</div>
                <div className="step-line done"></div>
                <div className="step-dot cur">3</div>
                <div className="step-line"></div>
                <div className="step-dot todo">4</div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '1rem', fontSize: '11px', color: 'var(--muted)' }}>
                <span>Browse</span>
                <span style={{ flex: 1, textAlign: 'center' }}>Review detail</span>
                <span style={{ flex: 1, textAlign: 'center', color: 'var(--navy)', fontWeight: 500 }}>Apply</span>
                <span>Response</span>
              </div>

              <div className="form-note">
                This is an application pitch — not a generic contact form. The PI reads every submission. Be specific about your experience with the skills listed.
              </div>
              
              <div className="g2">
                <div className="fi">
                  <label>Full name <span className="req">*</span></label>
                  <input type="text" required placeholder="Your full name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="fi">
                  <label>Email <span className="req">*</span></label>
                  <input type="email" required placeholder="you@institution.edu" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              
              <div className="g2">
                <div className="fi">
                  <label>Institution</label>
                  <input type="text" placeholder="KMC / MIT Manipal / Independent" value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} />
                </div>
                <div className="fi">
                  <label>ORCID / Scopus ID <span style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: 400 }}>(optional)</span></label>
                  <input type="text" placeholder="0000-0000-0000-0000" value={formData.orcid} onChange={e => setFormData({...formData, orcid: e.target.value})} />
                </div>
              </div>

              <div className="fi">
                <label>Availability <span className="req">*</span></label>
                <select required value={formData.availability} onChange={e => setFormData({...formData, availability: e.target.value})}>
                  <option value="">-- select --</option>
                  <option>5–8 hrs/week</option>
                  <option>8–12 hrs/week</option>
                  <option>12+ hrs/week</option>
                </select>
              </div>
              
              <div className="fi">
                <label>Why are you a good fit for this project? <span className="req">*</span> <span style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: 400 }}>(500 chars max)</span></label>
                <textarea 
                  required maxLength="500" 
                  placeholder="e.g. I built a CNN classifier for chest X-rays during my final year at MIT Manipal using PyTorch on the DRIVE dataset, achieving 91% AUC. I have 200+ hours of DICOM preprocessing experience and can contribute immediately..."
                  value={formData.pitch} onChange={e => setFormData({...formData, pitch: e.target.value})}
                  style={{ minHeight: '85px' }}
                ></textarea>
                <div className="char-count">{formData.pitch.length} / 500</div>
              </div>

              <div style={{ marginTop: '1.25rem' }}>
                <button type="submit" className="submit-btn" style={{ width: '100%', background: 'var(--navy)' }}>
                  Submit application →
                </button>
              </div>
            </>
          ) : (
            // =========================
            // SEEKER FLOW: Single Page
            // =========================
            <>
              <div className="form-note" style={{ marginBottom: '1.25rem', padding: '.75rem 1rem', background: '#f9fafb' }}>
                You are requesting an offline/video discovery meeting with {targetTitle}. Fill in the form below — they will confirm a suitable time from their available slots.
              </div>

              <div className="meet-avail-box">
                <div className="meet-avail-title">{targetTitle}'s available days (from their FYRC card):</div>
                <div className="meet-avail-days">
                  <span className="mad on">Mon · Available</span>
                  <span className="mad off">Tue</span>
                  <span className="mad on">Wed · Available</span>
                  <span className="mad off">Thu</span>
                  <span className="mad on">Fri · Available</span>
                  <span className="mad off">Sat</span>
                  <span className="mad off">Sun</span>
                </div>
                <div style={{ fontSize: '10px', color: '#78350F', marginTop: '8px' }}>
                  Discussion time: {targetData?.discussionHours || 'Mon/Wed 4–5:30 PM IST'}
                </div>
              </div>

              <div className="g2">
                <div className="fi">
                  <label>Full name <span className="req">*</span></label>
                  <input type="text" required placeholder="Your full name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="fi">
                  <label>Email <span className="req">*</span></label>
                  <input type="email" required placeholder="you@institution.edu" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>

              <div className="g2">
                <div className="fi">
                  <label>Institution</label>
                  <input type="text" placeholder="KMC / MIT Manipal / Independent" value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} />
                </div>
                <div className="fi">
                  <label>ORCID / Scopus ID <span style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: 400 }}>(optional)</span></label>
                  <input type="text" placeholder="0000-0000-0000-0000" value={formData.orcid} onChange={e => setFormData({...formData, orcid: e.target.value})} />
                </div>
              </div>

              <div className="fi">
                <label>Your preferred day and time for the offline/video meet <span className="req">*</span></label>
                <input type="text" required placeholder="e.g. Monday or Wednesday, 4–5 PM IST — I am flexible within their available slots" value={formData.meetTime} onChange={e => setFormData({...formData, meetTime: e.target.value})} />
                <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '4px' }}>
                  Choose from their available days shown above. In-person: KMC Manipal campus or video call.
                </div>
              </div>

              <div className="fi">
                <label>Brief introduction — why do you want to meet? <span className="req">*</span> <span style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: 400 }}>(300 chars max)</span></label>
                <textarea 
                  required maxLength="300"
                  placeholder="e.g. I am a final-year BTech student at MIT Manipal with experience in PyTorch and medical imaging. I read your FYRC card and believe I can contribute to your retinal imaging project. I'm up for an offline meeting at your convenience."
                  value={formData.pitch} onChange={e => setFormData({...formData, pitch: e.target.value})}
                  style={{ minHeight: '85px' }}
                ></textarea>
                <div className="char-count">{formData.pitch.length} / 300</div>
              </div>

              <div className="fi">
                <label>Confirm you are willing to meet offline at KMC Manipal campus if required</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', marginTop: '.35rem' }}>
                  <input type="checkbox" checked={formData.offlineConfirm} onChange={e => setFormData({...formData, offlineConfirm: e.target.checked})} /> 
                  <span style={{ color: 'var(--text)' }}>Yes, I am available for an in-person meet at the scheduled time.</span>
                </label>
              </div>

              <div style={{ marginTop: '1.25rem' }}>
                <button type="submit" className="submit-btn" style={{ width: '100%', background: 'var(--teal)' }}>
                  Send meet request →
                </button>
              </div>
            </>
          )}

        </form>
      </div>
    </div>
  );
}
