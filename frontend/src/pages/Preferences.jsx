import { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';

const PrefRow = ({ icon, title, name, val, border, onChange }) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '1rem', 
    padding: '1rem 0', 
    borderBottom: border ? '.5px solid var(--border)' : 'none', 
  }}>
    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F0F3F7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--navy)', marginBottom: '4px' }}>{title}</div>
      <input 
        type="text"
        name={name}
        value={val}
        onChange={onChange}
        style={{ fontSize: '12px', color: 'var(--muted)', width: '100%', border: 'none', background: 'transparent', outline: 'none', padding: 0 }}
      />
    </div>
    <div style={{ color: 'var(--muted)', fontSize: '16px', paddingLeft: '1rem', fontWeight: 300, fontFamily: 'serif' }}>›</div>
  </div>
);

export default function Preferences() {
  const { token } = useContext(AuthContext);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const defaultPrefs = {
    primaryDomain: 'Medical Imaging, NLP in Healthcare',
    secondaryDomains: 'Predictive Analytics, Federated Learning',
    projectType: 'Research Project, Paper / Publication',
    timeCommitment: '6–10 hrs/week',
    perks: 'Co-authorship, Letter of Recommendation',
    designation: 'Open to All',
    department: 'KMC, MIT Manipal, External',
    minHIndex: 'No minimum',
    mode: 'Hybrid, Remote'
  };

  const [prefs, setPrefs] = useState(defaultPrefs);

  useEffect(() => {
    // Simulated fetch overlay since these specific deep metrics aren't in schema yet
    const saved = localStorage.getItem('fyrc_preferences');
    if (saved) setPrefs(JSON.parse(saved));
  }, []);

  const handleChange = (e) => setPrefs({ ...prefs, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    // Persist custom local metrics since schema differs slightly
    localStorage.setItem('fyrc_preferences', JSON.stringify(prefs));
    
    try {
      const res = await fetch('http://localhost:3001/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ preferences: { domains: prefs.primaryDomain.split(','), projectTypes: prefs.projectType.split(',') } })
      });
      if (res.ok) {
        setMessage('Preferences saved successfully!');
      }
    } catch {
      setMessage('Preferences saved locally!');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleReset = () => {
    setPrefs(defaultPrefs);
    localStorage.removeItem('fyrc_preferences');
  };

  return (
    <div className="pw">
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '1.5rem', paddingBottom: '4rem' }}>
        
        {/* Header */}
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--navy)', marginBottom: '8px', fontFamily: 'Merriweather, serif' }}>My Collaboration Preferences</h1>
        <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '1.5rem' }}>These settings determine what projects and collaborators appear on your My Matches page every day.</p>

        {/* Banner */}
        <div style={{ background: '#FEF3E2', border: '.5px solid #FDE68A', borderRadius: '8px', padding: '12px 1.25rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#B45309' }}>{message || 'Tap on any field to edit your preference'}</span>
          {message && <span style={{ color: 'var(--green)', fontSize: '14px' }}>✓</span>}
        </div>

        {/* Card 1 */}
        <div style={{ background: '#fff', border: '.5px solid var(--border)', borderRadius: '12px', padding: '0.75rem 1.5rem', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '.05em', margin: '1rem 0 0.5rem' }}>RESEARCH DOMAINS I AM INTERESTED IN</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <PrefRow icon="🔬" title="Primary domain" name="primaryDomain" val={prefs.primaryDomain} onChange={handleChange} border />
            <PrefRow icon="🔎" title="Secondary domains" name="secondaryDomains" val={prefs.secondaryDomains} onChange={handleChange} />
          </div>
        </div>

        {/* Card 2 */}
        <div style={{ background: '#fff', border: '.5px solid var(--border)', borderRadius: '12px', padding: '0.75rem 1.5rem', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '.05em', margin: '1rem 0 0.5rem' }}>PROJECT PREFERENCES</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <PrefRow icon="📋" title="Project type" name="projectType" val={prefs.projectType} onChange={handleChange} border />
            <PrefRow icon="⏱️" title="Time commitment I can give" name="timeCommitment" val={prefs.timeCommitment} onChange={handleChange} border />
            <PrefRow icon="🏆" title="Perks I prefer" name="perks" val={prefs.perks} onChange={handleChange} />
          </div>
        </div>

        {/* Card 3 */}
        <div style={{ background: '#fff', border: '.5px solid var(--border)', borderRadius: '12px', padding: '0.75rem 1.5rem', marginBottom: '2rem' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '.05em', margin: '1rem 0 0.5rem' }}>COLLABORATOR PREFERENCES</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <PrefRow icon="🎓" title="Designation" name="designation" val={prefs.designation} onChange={handleChange} border />
            <PrefRow icon="🏢" title="Department" name="department" val={prefs.department} onChange={handleChange} border />
            <PrefRow icon="📊" title="Minimum h-index" name="minHIndex" val={prefs.minHIndex} onChange={handleChange} border />
            <PrefRow icon="💻" title="Mode preference" name="mode" val={prefs.mode} onChange={handleChange} />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={handleReset} style={{ 
            background: '#fff', 
            border: '.5px solid var(--border)', 
            borderRadius: '8px', 
            padding: '10px 18px', 
            fontSize: '12px', 
            fontWeight: 600, 
            color: 'var(--navy)', 
            cursor: 'pointer' 
          }}>
            Reset to defaults
          </button>
          <button onClick={handleSave} disabled={saving} style={{ 
            background: 'var(--navy)', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '8px', 
            padding: '10px 20px', 
            fontSize: '12px', 
            fontWeight: 600, 
            cursor: 'pointer',
            opacity: saving ? 0.7 : 1
          }}>
            {saving ? 'Saving...' : 'Save preferences'}
          </button>
        </div>

      </div>
    </div>
  );
}
