import { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext'
import ProjectCard from '../components/ProjectCard'
import LockOverlay from '../components/LockOverlay'
import { dummyProjects } from '../data/dummyProjects'

const LOCK_AFTER = 4   // show lock overlay after this many visible cards
const API_URL = 'http://localhost:3001/api/projects/public'

function applyClientFilters(projects, filters) {
  const { status, domains, projectType, hours, irbApproved, remoteOnly, postedWithin } = filters
  let result = [...projects]

  if (status !== 'all') {
    result = result.filter((p) => p.status === status)
  }

  if (domains.length > 0) {
    result = result.filter((p) => domains.includes(p.domain))
  }

  if (projectType !== 'all') {
    result = result.filter((p) => p.type === projectType)
  }

  if (hours !== 'all') {
    result = result.filter((p) => {
      if (hours === 'light') return p.hoursPerWeek <= 6
      if (hours === 'medium') return p.hoursPerWeek > 6 && p.hoursPerWeek <= 10
      if (hours === 'heavy') return p.hoursPerWeek > 10
      return true
    })
  }

  if (irbApproved) {
    result = result.filter((p) => p.irbApproved === true)
  }

  if (remoteOnly) {
    result = result.filter((p) => p.remoteOk === true)
  }

  if (postedWithin !== 'any') {
    const now = Date.now()
    const cutoff = postedWithin === 'week' ? 7 : 30
    result = result.filter((p) => {
      const diff = (now - new Date(p.postedAt).getTime()) / (1000 * 60 * 60 * 24)
      return diff <= cutoff
    })
  }

  return result
}

function applySortOrder(projects, sort) {
  const clone = [...projects]
  if (sort === 'newest') {
    clone.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt))
  } else if (sort === 'hours_asc') {
    clone.sort((a, b) => a.hoursPerWeek - b.hoursPerWeek)
  }
  // 'best' = default order (as returned by API)
  return clone
}

export default function ProjectList({ filters }) {
  const [allProjects, setAllProjects] = useState([])
  const [sort, setSort] = useState('best')
  const [loading, setLoading] = useState(true)
  const { user, token } = useContext(AuthContext)

  // Fetch projects from API on mount, fall back to dummyProjects
  useEffect(() => {
    let cancelled = false

    async function fetchProjects() {
      try {
        const endpoint = user 
          ? 'http://localhost:3001/api/projects/all' 
          : 'http://localhost:3001/api/projects/public'
        
        const headers = user ? { Authorization: `Bearer ${token}` } : {}

        const res = await fetch(endpoint, { headers })
        if (!res.ok) throw new Error('API error')
        const json = await res.json()
        if (!cancelled) setAllProjects(json.data ?? json)
      } catch {
        if (!cancelled) setAllProjects(dummyProjects)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchProjects()
    return () => { cancelled = true }
  }, [user, token])

  const filtered = applySortOrder(applyClientFilters(allProjects, filters), sort)
  // If user is logged in, show all; otherwise lock after 4
  const visibleCards = user ? filtered : filtered.slice(0, LOCK_AFTER)
  const isLocked = !user && filtered.length > LOCK_AFTER

  return (
    <div>
      {/* Results header */}
      <div className="results-header">
        <div>
          <div className="results-title">Projects matching your preferences</div>
          <div className="results-count">
            {loading
              ? 'Loading…'
              : `Showing ${Math.min(LOCK_AFTER, filtered.length)} of ${filtered.length} projects`}
          </div>
        </div>
        <select
          className="sort-sel"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="best">Best match</option>
          <option value="newest">Newest first</option>
          <option value="hours_asc">Fewest hours/week</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="empty-state">
          <div className="empty-state-icon">⏳</div>
          Loading projects…
        </div>
      )}

      {/* Empty after filtering */}
      {!loading && filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          No projects match your current filters.
        </div>
      )}

      {/* Visible cards (before lock) */}
      {!loading &&
        visibleCards.map((project, idx) => (
          <ProjectCard key={project.id} project={project} index={idx} />
        ))}

      {/* Lock overlay */}
      {!loading && isLocked && <LockOverlay />}
    </div>
  )
}
