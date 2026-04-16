export default function Tabs({ activeTab, onSwitch }) {
  return (
    <div className="tabs-bar">
      <button
        className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
        onClick={() => onSwitch('projects')}
        id="tab-find-project"
      >
        Find a Project
        <span className="badge-count">10</span>
      </button>
      <button
        className={`tab-btn ${activeTab === 'collaborators' ? 'active' : ''}`}
        onClick={() => onSwitch('collaborators')}
        id="tab-find-collaborator"
      >
        Find a Collaborator
        <span className="badge-count" style={{ background: '#1A7A6E' }}>8</span>
      </button>
    </div>
  )
}
