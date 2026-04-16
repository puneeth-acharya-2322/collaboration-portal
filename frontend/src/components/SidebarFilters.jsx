const DOMAINS = [
  'Medical Imaging',
  'NLP in Healthcare',
  'Predictive Analytics',
  'Federated Learning',
  'Genomics',
]

const PERKS = [
  'Co-authorship',
  'Letter of Recommendation',
  'Clinical data access',
  'Stipend / honorarium',
]

export default function SidebarFilters({ filters, onChange, onClear }) {
  const { status, domains, projectType, perks, hours, irbApproved, remoteOnly, postedWithin } =
    filters

  function handleStatus(val) {
    onChange({ ...filters, status: val })
  }

  function handleDomain(domain, checked) {
    const next = checked
      ? [...domains, domain]
      : domains.filter((d) => d !== domain)
    onChange({ ...filters, domains: next })
  }

  function handlePerk(perk, checked) {
    const next = checked ? [...perks, perk] : perks.filter((p) => p !== perk)
    onChange({ ...filters, perks: next })
  }

  function handleType(val) {
    onChange({ ...filters, projectType: val })
  }

  return (
    <div className="sidebar">
      <div className="sb-header">
        Refine Search
        <button className="sb-clear" onClick={onClear}>
          Clear all
        </button>
      </div>

      {/* Status */}
      <div className="sb-section">
        <div className="sb-title">
          Status <span className="sb-arrow">▾</span>
        </div>
        <div className="sb-options">
          {[
            { val: 'all', label: 'Open to All' },
            { val: 'ongoing', label: 'Ongoing' },
            { val: 'upcoming', label: 'Upcoming' },
          ].map(({ val, label }) => (
            <label key={val} className="sb-opt">
              <input
                type="radio"
                name="status"
                value={val}
                checked={status === val}
                onChange={() => handleStatus(val)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Domain */}
      <div className="sb-section">
        <div className="sb-title">
          Domain <span className="sb-arrow">▾</span>
        </div>
        <div className="sb-options">
          {DOMAINS.map((d) => (
            <label key={d} className="sb-opt">
              <input
                type="checkbox"
                checked={domains.includes(d)}
                onChange={(e) => handleDomain(d, e.target.checked)}
              />
              {d}
            </label>
          ))}
        </div>
      </div>

      {/* Type */}
      <div className="sb-section">
        <div className="sb-title">
          Type <span className="sb-arrow">▾</span>
        </div>
        <div className="sb-options">
          {[
            { val: 'all', label: 'All types' },
            { val: 'project', label: 'Research Project' },
            { val: 'paper', label: 'Paper / Publication' },
          ].map(({ val, label }) => (
            <label key={val} className="sb-opt">
              <input
                type="radio"
                name="ptype"
                value={val}
                checked={projectType === val}
                onChange={() => handleType(val)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Perks */}
      <div className="sb-section">
        <div className="sb-title">
          Collaboration perks <span className="sb-arrow">▾</span>
        </div>
        <div className="sb-options">
          {PERKS.map((p) => (
            <label key={p} className="sb-opt">
              <input
                type="checkbox"
                checked={perks.includes(p)}
                onChange={(e) => handlePerk(p, e.target.checked)}
              />
              {p}
            </label>
          ))}
        </div>
      </div>

      {/* Time commitment */}
      <div className="sb-section">
        <div className="sb-title">
          Time commitment <span className="sb-arrow">▾</span>
        </div>
        <div className="sb-options">
          {[
            { val: 'all', label: 'Any' },
            { val: 'light', label: 'Up to 6 hrs/week' },
            { val: 'medium', label: '6–10 hrs/week' },
            { val: 'heavy', label: '10+ hrs/week' },
          ].map(({ val, label }) => (
            <label key={val} className="sb-opt">
              <input
                type="radio"
                name="hrs"
                value={val}
                checked={hours === val}
                onChange={() => onChange({ ...filters, hours: val })}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* IRB Approved */}
      <div className="sb-section">
        <div className="sb-title">
          IRB Approved <span className="sb-arrow">▾</span>
        </div>
        <div className="sb-options">
          <label className="sb-opt">
            <input
              type="checkbox"
              checked={irbApproved}
              onChange={(e) => onChange({ ...filters, irbApproved: e.target.checked })}
            />
            Yes — ethics approved only
          </label>
        </div>
      </div>

      {/* Remote friendly */}
      <div className="sb-section">
        <div className="sb-title">
          Remote friendly <span className="sb-arrow">▾</span>
        </div>
        <div className="sb-options">
          <label className="sb-opt">
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={(e) => onChange({ ...filters, remoteOnly: e.target.checked })}
            />
            Remote collaboration possible
          </label>
        </div>
      </div>

      {/* Posted within */}
      <div className="sb-section">
        <div className="sb-title">
          Posted within <span className="sb-arrow">▾</span>
        </div>
        <div className="sb-options">
          {[
            { val: 'any', label: 'Any time' },
            { val: 'week', label: 'Last 7 days' },
            { val: 'month', label: 'Last 30 days' },
          ].map(({ val, label }) => (
            <label key={val} className="sb-opt">
              <input
                type="radio"
                name="posted"
                value={val}
                checked={postedWithin === val}
                onChange={() => onChange({ ...filters, postedWithin: val })}
              />
              {label}
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
