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

  return (
    <div className={`project-card${isFeatured ? ' featured' : ''}`}>
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
          <span className="pc-tag tag-public">🌐 Public</span>
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
        <div className="match-ring">
          <div className="match-score-big">—</div>
          <div className="match-label">Login</div>
        </div>
        <button
          className="view-btn"
          onClick={() => alert(`Login to view & collaborate on:\n"${title}"`)}
        >
          View Details
        </button>
        <div className="lock-note">🔒 Login to apply</div>
      </div>
    </div>
  )
}
