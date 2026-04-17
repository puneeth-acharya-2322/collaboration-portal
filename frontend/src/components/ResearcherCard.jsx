import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

// Reusing domain colors for styling continuity
const DOMAIN_COLORS = {
  'Medical Imaging': '#1A7A6E',
  'NLP in Healthcare': '#1B3A5C',
  'Predictive Analytics': '#D4820A',
  'Federated Learning': '#C9553A',
  'Genomics': '#2D7A3A',
}

function getInitials(name) {
  if (!name) return '??'
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function ResearcherCard({ researcher }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const initials = getInitials(researcher.name);
  const primaryDomain = researcher.domain?.[0];
  const avatarColor = DOMAIN_COLORS[primaryDomain] || '#1B3A5C';
  const visibleSkills = researcher.skills?.slice(0, 4) || [];

  const isAvailable = !researcher.availability || researcher.availability.toLowerCase().includes('available now') || researcher.availability.toLowerCase().includes('available');

  const handleRequestMeet = (e) => {
    e.stopPropagation();
    if (!user) {
      alert(`Login to request a meeting with:\n"${researcher.name}"`);
      return;
    }
    if (user.id === researcher.id) {
      alert("This is you!");
      return;
    }
    // Go to profile detail view first
    navigate(`/collaborators/${researcher.id}`, { state: { researcher } });
  }

  const handleCardClick = () => {
    navigate(`/collaborators/${researcher.id}`, { state: { researcher } });
  }

  return (
    <div className="seeker-card" onClick={handleCardClick}>
      {/* Left content */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div className="sk-av" style={{ background: avatarColor }}>{initials}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="sk-name">{researcher.name || 'Anonymous Researcher'}</div>
            <div className={`sk-avail ${isAvailable ? 'avail-on' : 'avail-off'}`}></div>
            <div style={{ fontSize: '11px', color: isAvailable ? '#16a34a' : '#E24B4A', fontWeight: 500 }}>
              {isAvailable ? 'Available' : 'Unavailable'}
            </div>
          </div>
          
          <div className="sk-desig">
            {researcher.designation || 'Professor'} · {researcher.department || 'AI in Healthcare, KMC'}
          </div>
          
          <div className="pc-meta" style={{ marginTop: '10px', marginBottom: '10px' }}>
            {primaryDomain && <span className="pc-tag tag-domain">{primaryDomain}</span>}
            {visibleSkills.map((s) => (
              <span key={s} className="pc-tag tag-skill">{s}</span>
            ))}
          </div>
          
          <div className="sk-metrics">
            <div className="sk-metric"><strong>{researcher.hIndex || 14}</strong> h-index</div>
            <div className="sk-metric"><strong>{researcher.publications || 31}</strong> publications</div>
            <div className="sk-metric"><strong>{researcher.mode || 'Hybrid'}</strong></div>
            <div className="sk-metric">Urgency: <strong>{researcher.urgency || '7/10'}</strong></div>
          </div>
          
          <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '8px' }}>
            Seeking: {researcher.seeking || 'Ophthalmologist for clinical validation · Data engineer for DICOM pipeline'}
          </div>
        </div>
      </div>

      {/* Right: match ring + CTA */}
      <div className="pc-right">
        <div className="match-ring" style={user ? { borderColor: 'var(--gold)' } : {}}>
          <div className="match-score-big" style={{ fontSize: '16px', color: 'var(--navy)' }}>{user ? '78%' : '—'}</div>
          <div className="match-label" style={{ textTransform: 'lowercase', fontSize: '9px', fontWeight: 500 }}>match</div>
        </div>
        <button
          className="collab-btn"
          onClick={handleRequestMeet}
          style={{ width: '110px', marginTop: '6px' }}
        >
          {user ? 'Request meet' : 'Login to Connect'}
        </button>
      </div>
    </div>
  );
}
