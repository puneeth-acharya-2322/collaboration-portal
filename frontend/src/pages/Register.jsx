import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Lock, Phone, Briefcase, GraduationCap, Building, 
  Award, Search, Code, Clock, Settings, ChevronRight, ChevronLeft, CheckCircle2 
} from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    title: 'Dr.',
    phone: '',
    designation: '',
    department: '',
    institution: 'MAHE, Manipal',
    experience: '',
    scopusId: '',
    orcid: '',
    hIndex: '',
    publications: '',
    collabMode: 'Hybrid',
    availability: '',
    skills: '', // Will split by comma
    domain: '', // Will split by comma
    expertise1: '',
    expertise2: '',
    expertise3: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    // Basic validation for Step 1
    if (step === 1 && (!formData.name || !formData.email || !formData.password)) {
      setError('Please fill in core account details');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        domain: formData.domain.split(',').map(d => d.trim()).filter(d => d),
        expertise: [formData.expertise1, formData.expertise2, formData.expertise3].filter(e => e),
        hIndex: parseInt(formData.hIndex) || 0,
        publications: parseInt(formData.publications) || 0
      };

      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      setSuccess('true');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="pw" style={{ maxWidth: '500px', marginTop: '5rem', textAlign: 'center' }}>
        <div className="sidebar" style={{ padding: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <CheckCircle2 size={64} color="var(--teal)" />
          </div>
          <h2 style={{ fontSize: '24px', color: 'var(--navy)', marginBottom: '1rem' }}>Registration Submitted!</h2>
          <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>
            Your researcher profile is now being reviewed by the administrative team. 
            You will receive an email once your account is verified.
          </p>
          <Link to="/" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }}>Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pw" style={{ maxWidth: '600px', marginTop: '3rem', marginBottom: '5rem' }}>
      <div className="sidebar" style={{ padding: '2.5rem' }}>
        
        {/* Progress Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            {[1, 2, 3, 4].map((s) => (
              <div key={s} style={{ 
                width: '24%', height: '4px', 
                background: s <= step ? 'var(--gold)' : '#e2e8f0',
                borderRadius: '2px',
                transition: 'all 0.3s'
              }}></div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <span>Account</span>
            <span>Identity</span>
            <span>Research</span>
            <span>Availability</span>
          </div>
        </div>

        <h2 style={{ fontSize: '22px', color: 'var(--navy)', marginBottom: '0.5rem' }}>Researcher Registration</h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '2rem' }}>
          Step {step} of 4: {
            step === 1 ? 'Personal Information' : 
            step === 2 ? 'Academic Identity' : 
            step === 3 ? 'Research & Metrics' : 'Expertise & Settings'
          }
        </p>

        {error && (
          <div style={{ padding: '12px', background: '#fef2f2', color: '#991b1b', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '13px', border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* STEP 1: Personal */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Title</label>
                  <select name="title" value={formData.title} onChange={handleChange} className="form-input">
                    <option>Dr.</option>
                    <option>Mr.</option>
                    <option>Ms.</option>
                    <option>Prof.</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Full Name</label>
                  <input name="name" type="text" value={formData.name} onChange={handleChange} className="form-input" placeholder="e.g. Dr. Priya Nair" />
                </div>
              </div>
              <div>
                <label className="form-label">Institutional Email</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="priya.nair@manipal.edu" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Password</label>
                  <input name="password" type="password" value={formData.password} onChange={handleChange} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Phone Number</label>
                  <input name="phone" type="text" value={formData.phone} onChange={handleChange} className="form-input" placeholder="+91..." />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Identity */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Designation</label>
                  <input name="designation" type="text" value={formData.designation} onChange={handleChange} className="form-input" placeholder="Assistant Professor" />
                </div>
                <div>
                  <label className="form-label">Department</label>
                  <input name="department" type="text" value={formData.department} onChange={handleChange} className="form-input" placeholder="Ophthalmology" />
                </div>
              </div>
              <div>
                <label className="form-label">Institution</label>
                <input name="institution" type="text" value={formData.institution} onChange={handleChange} className="form-input" />
              </div>
              <div>
                <label className="form-label">Experience</label>
                <select name="experience" value={formData.experience} onChange={handleChange} className="form-input">
                  <option value="">Select Experience</option>
                  <option>0-2 years</option>
                  <option>3-5 years</option>
                  <option>6-10 years</option>
                  <option>10+ years</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Scopus ID</label>
                  <input name="scopusId" type="text" value={formData.scopusId} onChange={handleChange} className="form-input" placeholder="57200..." />
                </div>
                <div>
                  <label className="form-label">ORCID</label>
                  <input name="orcid" type="text" value={formData.orcid} onChange={handleChange} className="form-input" placeholder="0000-000..." />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Research */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">h-Index</label>
                  <input name="hIndex" type="number" value={formData.hIndex} onChange={handleChange} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Total Publications</label>
                  <input name="publications" type="number" value={formData.publications} onChange={handleChange} className="form-input" />
                </div>
              </div>
              <div>
                <label className="form-label">Research Domains (comma separated)</label>
                <input name="domain" type="text" value={formData.domain} onChange={handleChange} className="form-input" placeholder="Medical Imaging, Clinical NLP" />
              </div>
              <div>
                <label className="form-label">Technical Skills (comma separated)</label>
                <input name="skills" type="text" value={formData.skills} onChange={handleChange} className="form-input" placeholder="Python, PyTorch, SQL" />
              </div>
            </div>
          )}

          {/* STEP 4: Settings */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Collab Mode</label>
                  <select name="collabMode" value={formData.collabMode} onChange={handleChange} className="form-input">
                    <option>Hybrid</option>
                    <option>Remote</option>
                    <option>On-site</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Availability</label>
                  <input name="availability" type="text" value={formData.availability} onChange={handleChange} className="form-input" placeholder="Mon/Wed 4-5:30 PM" />
                </div>
              </div>
              <div>
                <label className="form-label">Research Expertise (3 Bullets for public card)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <input name="expertise1" type="text" value={formData.expertise1} onChange={handleChange} className="form-input" placeholder="Bullet 1" />
                  <input name="expertise2" type="text" value={formData.expertise2} onChange={handleChange} className="form-input" placeholder="Bullet 2" />
                  <input name="expertise3" type="text" value={formData.expertise3} onChange={handleChange} className="form-input" placeholder="Bullet 3" />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
            {step > 1 && (
              <button type="button" onClick={prevStep} className="btn" style={{ flex: 1, justifyContent: 'center', background: '#f1f5f9', color: '#1e293b' }}>
                <ChevronLeft size={18} /> Prev
              </button>
            )}
            {step < 4 ? (
              <button type="button" onClick={nextStep} className="btn btn-gold" style={{ flex: 1, justifyContent: 'center' }}>
                Next <ChevronRight size={18} />
              </button>
            ) : (
              <button type="submit" className="btn btn-gold" style={{ flex: 1, justifyContent: 'center' }} disabled={loading}>
                {loading ? 'Submitting...' : 'Complete Registration'}
              </button>
            )}
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '13px' }}>
          By registering, you agree to institutional research guidelines.
        </div>
      </div>

      <style>{`
        .form-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
        .form-input {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid var(--border);
          font-family: inherit;
          font-size: 14px;
          transition: border-color 0.2s;
        }
        .form-input:focus {
          outline: none;
          border-color: var(--gold);
        }
      `}</style>
    </div>
  );
}
