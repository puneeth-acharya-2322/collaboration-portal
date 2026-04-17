import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import SidebarFiltersCollaborator from '../components/SidebarFiltersCollaborator'
import ResearcherCard from '../components/ResearcherCard'
import LockOverlay from '../components/LockOverlay'
import Tabs from '../components/Tabs'

const DEFAULT_FILTERS = {
  domains: [],
  designations: [],
  availability: 'all',
}

const LOCK_AFTER = 4

function applyClientFilters(researchers, filters) {
  return researchers.filter((r) => {
    // Domain match
    if (filters.domains.length > 0) {
      const pDomains = r.domain || []
      if (!filters.domains.some((d) => pDomains.includes(d))) return false
    }

    // Designation match
    if (filters.designations.length > 0) {
      if (!filters.designations.includes(r.designation)) return false
    }

    // Availability match
    if (filters.availability !== 'all') {
      if (filters.availability === 'now' && r.availability !== 'Available now') return false
      if (filters.availability === 'soon' && r.availability !== 'Available in 1 month') return false
    }

    return true
  })
}

export default function FindCollaborators() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [allResearchers, setAllResearchers] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false

    async function fetchResearchers() {
      try {
        const res = await fetch('http://localhost:3001/api/user/all')
        if (!res.ok) throw new Error('API error')
        const json = await res.json()
        if (!cancelled) setAllResearchers(json.data ?? json)
      } catch (err) {
        console.error(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchResearchers()
    return () => { cancelled = true }
  }, [])

  function handleClearFilters() {
    setFilters(DEFAULT_FILTERS)
  }

  const filtered = applyClientFilters(allResearchers, filters)
  const visibleCards = user ? filtered : filtered.slice(0, LOCK_AFTER)
  const isLocked = !user && filtered.length > LOCK_AFTER

  return (
    <div className="pw">
      {/* Lock information banner */}
      {!user && (
        <div className="lock-banner">
          🔒&nbsp;
          <div>
            <strong>Some profiles are hidden.</strong>{' '}
            <a href="/login">
              Login or register
            </a>{' '}
            to explore all KMC researchers, message potential collaborators, and unlock match algorithms.
          </div>
        </div>
      )}

      {/* Tab switcher implicitly on collaborators */}
      <Tabs activeTab="collaborators" onSwitch={(tab) => { if (tab === 'projects') navigate('/') }} />

      <div className="split">
        <SidebarFiltersCollaborator
          filters={filters}
          onChange={setFilters}
          onClear={handleClearFilters}
        />
        <div>
          {/* Results header */}
          <div className="results-header">
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--navy)' }}>
                Researchers seeking collaborators
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                Showing {filtered.length} seeker profile{filtered.length !== 1 ? 's' : ''}
              </div>
            </div>
            <select className="sort-sel">
              <option>Best match</option>
              <option>Recently added</option>
              <option>Highest availability</option>
            </select>
          </div>

          {loading ? (
             <div className="empty-state">Loading researchers architecture...</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              No researchers found matching these criteria.
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <div className={isLocked ? 'blur-section' : ''}>
                {visibleCards.map((r, idx) => (
                  <ResearcherCard key={r.id || idx} researcher={r} />
                ))}
              </div>
              {isLocked && <LockOverlay title="Log in to view all matching researchers" cta="Login to unlock" />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
