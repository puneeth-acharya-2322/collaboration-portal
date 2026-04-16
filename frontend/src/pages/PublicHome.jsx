import { useState } from 'react'
import SidebarFilters from '../components/SidebarFilters'
import ProjectList from './ProjectList'
import Tabs from '../components/Tabs'

const DEFAULT_FILTERS = {
  status: 'all',
  domains: [],
  projectType: 'all',
  perks: [],
  hours: 'all',
  irbApproved: false,
  remoteOnly: false,
  postedWithin: 'any',
}

function CollaboratorPlaceholder() {
  return (
    <div className="split">
      {/* Sidebar placeholder */}
      <div className="sidebar">
        <div className="sb-header">Refine Search</div>
        <div className="sb-section">
          <div className="sb-title">Designation <span className="sb-arrow">▾</span></div>
          <div className="sb-options">
            {['Professor', 'Associate Professor', 'Assistant Professor', 'Research Scholar', 'PhD Student', 'Senior Clinician'].map(d => (
              <label key={d} className="sb-opt"><input type="checkbox" /> {d}</label>
            ))}
          </div>
        </div>
        <div className="sb-section">
          <div className="sb-title">Department <span className="sb-arrow">▾</span></div>
          <div className="sb-options">
            {['AI in Healthcare', 'Ophthalmology', 'Internal Medicine', 'Oncology', 'MIT Manipal (CS/ECE)'].map(d => (
              <label key={d} className="sb-opt"><input type="checkbox" /> {d}</label>
            ))}
          </div>
        </div>
        <div className="sb-section">
          <div className="sb-title">Availability <span className="sb-arrow">▾</span></div>
          <div className="sb-options">
            <label className="sb-opt"><input type="radio" name="avail" defaultChecked /> All</label>
            <label className="sb-opt"><input type="radio" name="avail" /> Available now</label>
          </div>
        </div>
      </div>

      {/* Coming soon */}
      <div>
        <div className="coming-soon-wrap">
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>👥</div>
          <h3>Find a Collaborator — Coming Soon</h3>
          <p>
            Researcher profiles and the "Find a Collaborator" discovery feature will be available
            in the next release.
            <br /><br />
            <button
              className="btn btn-gold"
              onClick={() => alert('Register — coming in Step 2')}
            >
              Get notified when it launches
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PublicHome() {
  const [activeTab, setActiveTab] = useState('projects')
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  function handleClearFilters() {
    setFilters(DEFAULT_FILTERS)
  }

  return (
    <div className="pw">
      {/* Lock information banner */}
      <div className="lock-banner">
        🔒&nbsp;
        <div>
          <strong>Private projects are hidden.</strong>{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); alert('Login — coming in Step 2') }}>
            Login or register
          </a>{' '}
          to see all projects including department-private listings and your personalised match scores.
        </div>
      </div>

      {/* Tab switcher */}
      <Tabs activeTab={activeTab} onSwitch={setActiveTab} />

      {activeTab === 'projects' ? (
        <div className="split">
          <SidebarFilters
            filters={filters}
            onChange={setFilters}
            onClear={handleClearFilters}
          />
          <div>
            <ProjectList filters={filters} />
          </div>
        </div>
      ) : (
        <CollaboratorPlaceholder />
      )}
    </div>
  )
}
