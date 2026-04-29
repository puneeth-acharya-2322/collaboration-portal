import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProjects } from '../api'
import { Search, Filter, Clock, Briefcase, ChevronRight, CheckCircle2, X, SlidersHorizontal } from 'lucide-react'
import { useUser } from '../context/UserContext'
import DashboardLayout from '../components/DashboardLayout'

export default function ResearchPage({ forceView }) {
  const navigate = useNavigate()
  const { role } = useUser()
  const [view, setView] = useState(forceView || 'proj') 
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  // Filtering State
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [domainFilter, setDomainFilter] = useState([])
  const [typeFilter, setTypeFilter] = useState('All')
  const [timeFilter, setTimeFilter] = useState('Any')
  const [perksFilter, setPerksFilter] = useState([])
  const [remoteFilter, setRemoteFilter] = useState(false)
  const [irbFilter, setIrbFilter] = useState(false)
  const [dateFilter, setDateFilter] = useState('Any')

  const [filterOpen, setFilterOpen] = useState(false)
  const filterRef = useRef(null)


  useEffect(() => {
    if (forceView) setView(forceView)
  }, [forceView])

  useEffect(() => {
    getProjects()
      .then(data => { 
        setProjects(data)
        setLoading(false) 
      })
      .catch(err => { 
        console.error(err)
        setLoading(false) 
      })
  }, [])

  // Close popup on outside click
  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Filtering Logic
  const filteredProjects = projects.filter(proj => {
    const matchesSearch = !searchTerm || 
                          proj.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          proj.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'All' || proj.status === statusFilter
    const matchesDomain = domainFilter.length === 0 || domainFilter.includes(proj.domain)
    const matchesType = typeFilter === 'All' || (typeFilter === 'Project' ? proj.type === 'Project' : proj.type === 'Paper')
    
    let matchesTime = true
    if (timeFilter === 'Up to 6 hrs/week') matchesTime = proj.hoursPerWeek <= 6
    else if (timeFilter === '6-10 hrs/week') matchesTime = proj.hoursPerWeek > 6 && proj.hoursPerWeek <= 10
    else if (timeFilter === '10+ hrs/week') matchesTime = proj.hoursPerWeek > 10

    const matchesPerks = perksFilter.length === 0 || perksFilter.every(p => proj.perks?.some(pp => pp.includes(p)))
    const matchesRemote = !remoteFilter || proj.remoteOk === true
    
    let matchesDate = true
    if (dateFilter === 'Last 7 days') {
       const weekAgo = new Date()
       weekAgo.setDate(weekAgo.getDate() - 7)
       matchesDate = new Date(proj.createdAt) > weekAgo
    } else if (dateFilter === 'Last 30 days') {
       const monthAgo = new Date()
       monthAgo.setDate(monthAgo.getDate() - 30)
       matchesDate = new Date(proj.createdAt) > monthAgo
    }

    return matchesSearch && matchesStatus && matchesDomain && matchesTime && matchesType && matchesPerks && matchesRemote && matchesDate
  })

  const resetFilters = () => {
    setStatusFilter('All')
    setDomainFilter([])
    setTypeFilter('All')
    setTimeFilter('Any')
    setPerksFilter([])
    setRemoteFilter(false)
    setIrbFilter(false)
    setDateFilter('Any')
    setSearchTerm('')
  }

  // Count active filters for badge
  const activeFilterCount = [
    statusFilter !== 'All',
    domainFilter.length > 0,
    typeFilter !== 'All',
    timeFilter !== 'Any',
    perksFilter.length > 0,
    remoteFilter,
    irbFilter,
    dateFilter !== 'Any',
  ].filter(Boolean).length

  const isGuest = role === 'public'

  const GREEN = '#2D7A3A'

  const content = (
    <>
      <div className="dash-header">
        <div>
          <h1 className="dash-greeting">
            {view === 'proj' ? 'Research Discovery Portal' : 'Potential Research Partners'}
          </h1>
          <div className="dash-sub-greeting">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            {' · Kasturba Medical College · '}
            {view === 'proj' ? `${filteredProjects.length} Projects` : '142 Researchers'}
          </div>
        </div>

        {/* Filter Button */}
        <div style={{ position: 'relative' }} ref={filterRef}>
          <button
            onClick={() => setFilterOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '9px 18px', borderRadius: '10px', cursor: 'pointer',
              border: filterOpen ? `1.5px solid ${GREEN}` : '1.5px solid #d1d5db',
              background: filterOpen ? '#edf7ef' : '#fff',
              color: filterOpen ? GREEN : '#374151',
              fontWeight: '600', fontSize: '13.5px',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.18s',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            <SlidersHorizontal size={15} />
            Filters
            {activeFilterCount > 0 && (
              <span style={{
                background: GREEN, color: '#fff',
                borderRadius: '50%', width: '18px', height: '18px',
                fontSize: '11px', fontWeight: '700',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginLeft: '2px',
              }}>
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Filter Popup Panel */}
          {filterOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 10px)', right: 0,
              width: '360px', background: '#fff',
              borderRadius: '16px', border: '1px solid #e5e7eb',
              boxShadow: '0 8px 32px rgba(0,0,0,0.13)',
              zIndex: 200, padding: '0',
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {/* Panel header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 20px 14px',
                borderBottom: '1px solid #f0f0f0',
              }}>
                <span style={{ fontWeight: '700', fontSize: '14px', color: '#111' }}>Filters</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={resetFilters}
                      style={{
                        fontSize: '12.5px', color: GREEN, fontWeight: '600',
                        background: '#edf7ef', border: 'none', borderRadius: '7px',
                        padding: '4px 12px', cursor: 'pointer',
                      }}
                    >
                      Clear all
                    </button>
                  )}
                  <button
                    onClick={() => setFilterOpen(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '2px' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Scrollable filter body */}
              <div style={{ maxHeight: '72vh', overflowY: 'auto', padding: '8px 0 12px' }}>

                {/* Status */}
                <FilterSection title="Status">
                  {['All', 'Ongoing', 'Upcoming', 'Closing Soon'].map(opt => (
                    <label key={opt} className="filter-option">
                      <input type="radio" name="status" checked={statusFilter === opt} onChange={() => setStatusFilter(opt)} />
                      <span className="filter-label">{opt === 'All' ? 'Open to All' : opt}</span>
                    </label>
                  ))}
                </FilterSection>

                <div className="filter-divider" />

                {/* Domain */}
                <FilterSection title="Domain">
                  {['Medical Imaging', 'NLP in Healthcare', 'Predictive Analytics', 'Federated Learning', 'Genomics'].map(opt => (
                    <label key={opt} className="filter-option">
                      <input
                        type="checkbox"
                        checked={domainFilter.includes(opt)}
                        onChange={(e) => {
                          if (e.target.checked) setDomainFilter([...domainFilter, opt])
                          else setDomainFilter(domainFilter.filter(d => d !== opt))
                        }}
                      />
                      <span className="filter-label">{opt}</span>
                    </label>
                  ))}
                </FilterSection>

                <div className="filter-divider" />

                {/* Type */}
                <FilterSection title="Type">
                  {['All', 'Project', 'Paper'].map(opt => (
                    <label key={opt} className="filter-option">
                      <input type="radio" name="type" checked={typeFilter === opt} onChange={() => setTypeFilter(opt)} />
                      <span className="filter-label">
                        {opt === 'All' ? 'All types' : opt === 'Project' ? 'Research Project' : 'Paper / Publication'}
                      </span>
                    </label>
                  ))}
                </FilterSection>

                <div className="filter-divider" />

                {/* Perks */}
                <FilterSection title="Collaboration Perks">
                  {['Co-authorship', 'Letter of Recommendation', 'Clinical data access', 'Stipend / honorarium'].map(opt => (
                    <label key={opt} className="filter-option">
                      <input
                        type="checkbox"
                        checked={perksFilter.includes(opt)}
                        onChange={(e) => {
                          if (e.target.checked) setPerksFilter([...perksFilter, opt])
                          else setPerksFilter(perksFilter.filter(p => p !== opt))
                        }}
                      />
                      <span className="filter-label">{opt}</span>
                    </label>
                  ))}
                </FilterSection>

                <div className="filter-divider" />

                {/* Time */}
                <FilterSection title="Time Commitment">
                  {['Any', 'Up to 6 hrs/week', '6-10 hrs/week', '10+ hrs/week'].map(opt => (
                    <label key={opt} className="filter-option">
                      <input type="radio" name="time" checked={timeFilter === opt} onChange={() => setTimeFilter(opt)} />
                      <span className="filter-label">{opt}</span>
                    </label>
                  ))}
                </FilterSection>

                <div className="filter-divider" />

                {/* Remote + IRB */}
                <FilterSection title="Other">
                  <label className="filter-option">
                    <input type="checkbox" checked={remoteFilter} onChange={(e) => setRemoteFilter(e.target.checked)} />
                    <span className="filter-label">Remote collaboration possible</span>
                  </label>
                  <label className="filter-option">
                    <input type="checkbox" checked={irbFilter} onChange={(e) => setIrbFilter(e.target.checked)} />
                    <span className="filter-label">IRB approved only</span>
                  </label>
                </FilterSection>

                <div className="filter-divider" />

                {/* Posted within */}
                <FilterSection title="Posted Within">
                  {['Any time', 'Last 7 days', 'Last 30 days'].map(opt => (
                    <label key={opt} className="filter-option">
                      <input type="radio" name="posted" checked={dateFilter === opt} onChange={() => setDateFilter(opt)} />
                      <span className="filter-label">{opt}</span>
                    </label>
                  ))}
                </FilterSection>
              </div>

              {/* Apply button */}
              <div style={{ padding: '12px 20px', borderTop: '1px solid #f0f0f0' }}>
                <button
                  onClick={() => setFilterOpen(false)}
                  style={{
                    width: '100%', padding: '10px', borderRadius: '10px',
                    background: GREEN, color: '#fff', border: 'none',
                    fontWeight: '700', fontSize: '13.5px', cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Show {filteredProjects.length} Results
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px', marginTop: '-8px' }}>
          {statusFilter !== 'All' && <FilterChip label={`Status: ${statusFilter}`} onRemove={() => setStatusFilter('All')} />}
          {domainFilter.map(d => <FilterChip key={d} label={d} onRemove={() => setDomainFilter(domainFilter.filter(x => x !== d))} />)}
          {typeFilter !== 'All' && <FilterChip label={`Type: ${typeFilter}`} onRemove={() => setTypeFilter('All')} />}
          {timeFilter !== 'Any' && <FilterChip label={timeFilter} onRemove={() => setTimeFilter('Any')} />}
          {perksFilter.map(p => <FilterChip key={p} label={p} onRemove={() => setPerksFilter(perksFilter.filter(x => x !== p))} />)}
          {remoteFilter && <FilterChip label="Remote" onRemove={() => setRemoteFilter(false)} />}
          {irbFilter && <FilterChip label="IRB Approved" onRemove={() => setIrbFilter(false)} />}
          {dateFilter !== 'Any' && <FilterChip label={dateFilter} onRemove={() => setDateFilter('Any')} />}
          <button
            onClick={resetFilters}
            style={{ fontSize: '12px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: '2px 6px' }}
          >
            Clear all
          </button>
        </div>
      )}

      {/* MAIN CONTENT — full width, no sidebar */}
      <div className="proj-grid">
        {filteredProjects.map(project => (
          <PremiumProjectCard key={project.id} project={project} />
        ))}
        {filteredProjects.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">
            <Search className="mx-auto mb-4 opacity-10" size={48} />
            <h3 className="text-lg font-bold text-gray-600">No matches found</h3>
            <p className="text-sm">Try broadening your search or clearing all filters.</p>
          </div>
        )}
      </div>

    </>
  )

  if (isGuest) {
    return (
      <DashboardLayout searchValue={searchTerm} onSearchChange={setSearchTerm}>
        {content}
      </DashboardLayout>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--dash-bg)]">
      <div className="pw py-12">
        {content}
      </div>
    </div>
  )
}

// ── Helper: collapsible filter section inside popup ──
function FilterSection({ title, children }) {
  return (
    <div style={{ padding: '12px 20px 4px' }}>
      <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
        {title}
      </div>
      <div className="filter-options">{children}</div>
    </div>
  )
}

// ── Helper: active filter chip ──
function FilterChip({ label, onRemove }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      background: '#edf7ef', color: '#2D7A3A',
      border: '1px solid #c6dec6', borderRadius: '20px',
      padding: '3px 10px 3px 12px', fontSize: '12px', fontWeight: '600',
    }}>
      {label}
      <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2D7A3A', padding: 0, display: 'flex' }}>
        <X size={12} />
      </button>
    </span>
  )
}

function PremiumProjectCard({ project }) {
  const navigate = useNavigate();
  const piName = project.pi?.name || project.pi || 'Dr. Principal Investigator';
  const initials = piName.split(' ').map(n => n[0]).join('')
  
  return (
    <div className="proj-card-premium group hover-lift" onClick={() => navigate(`/project/${project.id}`)}>
      <div className="pc-premium-header">
        <div className="pc-premium-pi">
          <div className="pc-premium-av">{initials}</div>
          <div className="pc-premium-pi-info">
            <span className="pc-premium-pi-name">{piName}</span>
            <span className="pc-premium-pi-role">Principal Investigator</span>
          </div>
        </div>
      </div>

      <h3 className="pc-premium-title">{project.title}</h3>
      <div className="pc-premium-meta">{project.domain || 'AI Healthcare'}</div>
      
      <p className="pc-premium-desc line-clamp-3">{project.shortDescription}</p>

      <div className="pc-premium-tags">
        <span className="pc-premium-tag" style={{ background: 'var(--dash-green-soft)', color: 'var(--dash-green)' }}>
          {project.status || 'Ongoing'}
        </span>
        {project.skills?.slice(0, 2).map(skill => (
          <span key={skill} className="pc-premium-tag">{skill}</span>
        ))}
      </div>

      <div className="pc-premium-footer">
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            navigate(`/project/${project.id}`); 
          }} 
          className="pc-premium-btn"
        >
          VIEW DETAIL
        </button>
      </div>
    </div>
  )
}
