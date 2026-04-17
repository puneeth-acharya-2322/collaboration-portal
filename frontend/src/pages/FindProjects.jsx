import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
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

export default function FindProjects() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  function handleClearFilters() {
    setFilters(DEFAULT_FILTERS)
  }

  return (
    <div className="pw">
      {/* Lock information banner */}
      {!user && (
        <div className="lock-banner">
          🔒&nbsp;
          <div>
            <strong>Private projects require login.</strong>{' '}
            <a href="/login">
              Login or register
            </a>{' '}
            to unlock full research details, PI bios, and department-private listings.
          </div>
        </div>
      )}

      {/* Tab switcher defaults to projects here implicitly by UI mapping */}
      <Tabs activeTab="projects" onSwitch={(tab) => { if (tab === 'collaborators') navigate('/collaborators') }} />

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
    </div>
  )
}
