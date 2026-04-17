import React from 'react';

const DOMAINS = [
  'Medical Imaging',
  'NLP in Healthcare',
  'Predictive Analytics',
  'Federated Learning',
  'Genomics',
]

const DESIGNATIONS = [
  'Professor', 
  'Associate Professor', 
  'Assistant Professor', 
  'Research Scholar', 
  'PhD Student', 
  'Senior Clinician'
]

export default function SidebarFiltersCollaborator({ filters, onChange, onClear }) {
  const { domains, designations, availability } = filters;

  function handleDomain(domain, checked) {
    const next = checked
      ? [...domains, domain]
      : domains.filter((d) => d !== domain)
    onChange({ ...filters, domains: next })
  }

  function handleDesignation(desig, checked) {
    const next = checked
      ? [...designations, desig]
      : designations.filter((d) => d !== desig)
    onChange({ ...filters, designations: next })
  }

  function handleAvailability(val) {
    onChange({ ...filters, availability: val })
  }

  return (
    <div className="sidebar">
      <div className="sb-header">
        Refine Search
        <button className="sb-clear" onClick={onClear}>
          Clear all
        </button>
      </div>

      {/* Designation */}
      <div className="sb-section">
        <div className="sb-title">
          Designation <span className="sb-arrow">▾</span>
        </div>
        <div className="sb-options">
          {DESIGNATIONS.map((d) => (
            <label key={d} className="sb-opt">
              <input
                type="checkbox"
                checked={designations.includes(d)}
                onChange={(e) => handleDesignation(d, e.target.checked)}
              />
              {d}
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

      {/* Availability */}
      <div className="sb-section">
        <div className="sb-title">
          Availability <span className="sb-arrow">▾</span>
        </div>
        <div className="sb-options">
          {[
            { val: 'all', label: 'All' },
            { val: 'now', label: 'Available now' },
            { val: 'soon', label: 'Available in 1 month' },
          ].map(({ val, label }) => (
            <label key={val} className="sb-opt">
              <input
                type="radio"
                name="avail"
                value={val}
                checked={availability === val}
                onChange={() => handleAvailability(val)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
