import { useState, useEffect } from 'react'
import { getProjects } from '../api'
import { Search, Filter, Clock, Briefcase, ChevronRight, CheckCircle2 } from 'lucide-react'
import { useUser } from '../context/UserContext'
import DashboardLayout from '../components/DashboardLayout'
import ProjectDetailModal from '../components/ProjectDetailModal'

export default function ResearchPage({ forceView }) {
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

  const [selectedProject, setSelectedProject] = useState(null)

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

  const isGuest = role === 'public'

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
        <div>
          <button className="pc-premium-btn flex items-center gap-2 border-slate-200 text-slate-500 hover:border-[var(--dash-green)]" onClick={resetFilters}>
            <Filter size={14} /> Reset Filters
          </button>
        </div>
      </div>

      <div className="discovery-layout">
        {/* SIDEBAR FILTERS */}
        <aside className="filter-sidebar">
          <div className="filter-section">
            <span className="filter-title">Status</span>
            <div className="filter-options">
              {['All', 'Ongoing', 'Upcoming', 'Closing Soon'].map(opt => (
                <label key={opt} className="filter-option">
                  <input 
                    type="radio" 
                    name="status" 
                    checked={statusFilter === opt}
                    onChange={() => setStatusFilter(opt)}
                  />
                  <span className="filter-label">{opt === 'All' ? 'Open to All' : opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-divider" />

          <div className="filter-section">
            <span className="filter-title">Domain</span>
            <div className="filter-options">
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
            </div>
          </div>

          <div className="filter-divider" />

          <div className="filter-section">
            <span className="filter-title">Type</span>
            <div className="filter-options">
              {['All', 'Project', 'Paper'].map(opt => (
                <label key={opt} className="filter-option">
                  <input 
                    type="radio" 
                    name="type" 
                    checked={typeFilter === opt}
                    onChange={() => setTypeFilter(opt)}
                  />
                  <span className="filter-label">
                    {opt === 'All' ? 'All types' : opt === 'Project' ? 'Research Project' : 'Paper / Publication'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-divider" />

          <div className="filter-section">
            <span className="filter-title">Collaboration perks</span>
            <div className="filter-options">
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
            </div>
          </div>

          <div className="filter-divider" />

          <div className="filter-section">
            <span className="filter-title">Time commitment</span>
            <div className="filter-options">
              {['Any', 'Up to 6 hrs/week', '6-10 hrs/week', '10+ hrs/week'].map(opt => (
                <label key={opt} className="filter-option">
                  <input 
                    type="radio" 
                    name="time" 
                    checked={timeFilter === opt}
                    onChange={() => setTimeFilter(opt)}
                  />
                  <span className="filter-label">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-divider" />

          <div className="filter-section">
            <span className="filter-title">IRB Approved</span>
            <label className="filter-option">
              <input 
                type="checkbox" 
                checked={irbFilter}
                onChange={(e) => setIrbFilter(e.target.checked)}
              />
              <span className="filter-label">Yes — ethics approved only</span>
            </label>
          </div>

          <div className="filter-section">
            <span className="filter-title">Remote friendly</span>
            <label className="filter-option">
              <input 
                type="checkbox" 
                checked={remoteFilter}
                onChange={(e) => setRemoteFilter(e.target.checked)}
              />
              <span className="filter-label">Remote collaboration possible</span>
            </label>
          </div>

          <div className="filter-divider" />

          <div className="filter-section">
            <span className="filter-title">Posted within</span>
            <div className="filter-options">
              {['Any time', 'Last 7 days', 'Last 30 days'].map(opt => (
                <label key={opt} className="filter-option">
                  <input 
                    type="radio" 
                    name="posted" 
                    checked={dateFilter === opt}
                    onChange={() => setDateFilter(opt)}
                  />
                  <span className="filter-label">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="discovery-content bg-white/40 rounded-[32px] p-2">
          <div className="proj-grid">
            {filteredProjects.map(project => (
              <PremiumProjectCard key={project.id} project={project} onOpen={() => setSelectedProject(project)} />
            ))}
            {filteredProjects.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">
                <Search className="mx-auto mb-4 opacity-10" size={48} />
                <h3 className="text-lg font-bold text-gray-600">No matches found</h3>
                <p className="text-sm">Try broadening your search or clearing all filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedProject && (
        <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
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

function PremiumProjectCard({ project, onOpen }) {
  const piName = project.pi?.name || project.pi || 'Dr. Principal Investigator';
  const initials = piName.split(' ').map(n => n[0]).join('')
  
  return (
    <div className="proj-card-premium group hover-lift" onClick={onOpen}>
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
        <button onClick={(e) => { e.stopPropagation(); onOpen(); }} className="pc-premium-btn">
          View Detail
        </button>
      </div>
    </div>
  )
}
