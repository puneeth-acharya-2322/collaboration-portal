import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

// Avatar background colors keyed by domain
const DOMAIN_COLORS = {
  'Medical Imaging': '#1A7A6E',
  'NLP in Healthcare': '#1B3A5C',
  'Predictive Analytics': '#D4820A',
  'Federated Learning': '#C9553A',
  Genomics: '#7C3AED',
  default: '#1B3A5C',
}

function getInitials(name) {
  return name
    .split(' ')
    .filter((w) => w.length > 1)
    .slice(-2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

export default function ProjectCard({ project, index }) {
  const {
    title,
    pi,
    domain,
    skills,
    status,
    type,
    perks,
    hoursPerWeek,
    description,
  } = project

  const avatarColor = DOMAIN_COLORS[domain] || DOMAIN_COLORS.default
  const initials = getInitials(pi.name)
  const isFeatured = index === 0
  const visibleSkills = skills.slice(0, 3)
  const extraSkills = skills.length > 3 ? skills.length - 3 : 0
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleViewDetails = (e) => {
    e.stopPropagation()
    navigate(`/projects/${project.id || project._id}`, { state: { project } })
  }

  const handleCardClick = () => {
    navigate(`/projects/${project.id || project._id}`, { state: { project } })
  }

  return (
    <div className={`project-card${isFeatured ? ' featured' : ''}`} onClick={handleCardClick}>
      {/* Left content */}
      <div>
        {/* Header: avatar + title + PI */}
        <div className="pc-top">
          <div className="pc-avatar" style={{ background: avatarColor }}>
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <div className="pc-title">{title}</div>
            <div className="pc-pi">
              {pi.name} · {pi.dept}
            </div>
          </div>
        </div>

        {/* Tags row */}
        <div className="pc-meta">
          <span className={`pc-tag ${status === 'ongoing' ? 'tag-status-on' : 'tag-status-up'}`}>
            {status === 'ongoing' ? 'Ongoing' : 'Upcoming'}
          </span>
          <span className="pc-tag tag-domain">{domain}</span>
          {visibleSkills.map((s) => (
            <span key={s} className="pc-tag tag-skill">
              {s}
            </span>
          ))}
          {extraSkills > 0 && (
            <span className="pc-tag tag-skill">+{extraSkills}</span>
          )}
          {type === 'paper' && (
            <span className="pc-tag tag-paper">📄 Paper</span>
          )}
          {project.isPublic ? (
            <span className="pc-tag tag-public">🌐 Public</span>
          ) : (
            <span className="pc-tag tag-status-up" style={{ background: '#FDE68A', color: '#B45309' }}>🔒 Private</span>
          )}
        </div>

        {/* Description */}
        <div className="pc-abstract">{description}</div>

        {/* Footer: hours + perks */}
        <div className="pc-footer">
          <span className="pc-perk">⏱ {hoursPerWeek} hrs/week</span>
          {perks.slice(0, 3).map((p) => (
            <span key={p} className="pc-perk">
              ✓ {p}
            </span>
          ))}
        </div>
      </div>

      {/* Right: match ring + CTA */}
      <div className="pc-right">
        <div className="match-ring" style={user ? { borderColor: 'var(--teal)' } : {}}>
          <div className="match-score-big">{user ? (project.matchScore || '75%') : '—'}</div>
          <div className="match-label">{user ? 'Match' : 'Login'}</div>
        </div>
        <button
          className="view-btn"
          onClick={handleViewDetails}
        >
          {(!user && !project.isPublic) ? 'Login to read' : (user && project.createdBy !== user.id) ? 'View & Apply' : 'View Details'}
        </button>
        {!user && <div className="lock-note">{project.isPublic ? '🔒 Login to apply' : '🔒 Login to read details'}</div>}
      </div>
    </div>
  )
}
