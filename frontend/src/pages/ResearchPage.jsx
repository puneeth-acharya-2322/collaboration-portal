import { useState, useEffect } from 'react'
import { getProjects } from '../api'
import { Search, Filter, Clock, Briefcase, MinusCircle, ChevronDown } from 'lucide-react'
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
  const [domainFilter, setDomainFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [timeFilter, setTimeFilter] = useState('All')
  const [skillFilter, setSkillFilter] = useState([])

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
    const matchesDomain = domainFilter === 'All' || proj.domain === domainFilter
    const matchesType = typeFilter === 'All' || proj.type === typeFilter
    
    let matchesTime = true
    if (timeFilter === '< 5h') matchesTime = proj.hoursPerWeek < 5
    else if (timeFilter === '5-10h') matchesTime = proj.hoursPerWeek >= 5 && proj.hoursPerWeek <= 10
    else if (timeFilter === '10h+') matchesTime = proj.hoursPerWeek > 10

    const matchesSkills = skillFilter.length === 0 || skillFilter.every(s => proj.skills?.includes(s))

    return matchesSearch && matchesStatus && matchesDomain && matchesTime && matchesType && matchesSkills
  })

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
        <div className="flex gap-3">
          <button className="dash-filter-btn" onClick={() => { setSearchTerm(''); setStatusFilter('All'); setDomainFilter('All'); setTimeFilter('All'); setTypeFilter('All'); setSkillFilter([]); }}>
            <Filter size={16} /> Reset Filters
          </button>
        </div>
      </div>

      {view === 'proj' ? (
        <>
          {/* FILTERS BAR */}
          <div className="dash-filters-row">
            <FilterSelect 
              label="Project Status" 
              value={statusFilter} 
              onChange={setStatusFilter} 
              options={['Ongoing', 'Upcoming', 'Closing Soon']} 
            />
            <FilterSelect 
              label="Domain" 
              value={domainFilter} 
              onChange={setDomainFilter} 
              options={['NLP in Healthcare', 'Medical Imaging', 'Predictive Analytics', 'Clinical Decision AI', 'Drug Discovery AI']} 
            />
            <FilterSelect 
              label="Type" 
              value={typeFilter} 
              onChange={setTypeFilter} 
              options={['Project', 'Paper']} 
            />
            <FilterSelect 
              label="Time" 
              value={timeFilter} 
              onChange={setTimeFilter} 
              options={['< 5h', '5-10h', '10h+']} 
            />
          </div>

          <div className="proj-grid">
            {filteredProjects.map(project => (
              <PremiumProjectCard key={project.id} project={project} onOpen={() => setSelectedProject(project)} />
            ))}
            {filteredProjects.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                <Search className="mx-auto mb-4 opacity-10" size={48} />
                <h3 className="text-lg font-bold text-gray-600">No matches found</h3>
                <p className="text-sm">Try broadening your search or clearing all filters.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="py-20 text-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
          <Briefcase className="mx-auto mb-4 opacity-20" size={48} />
          <h3 className="text-lg font-bold text-gray-700">Collaborator Discovery</h3>
          <p className="text-sm max-w-xs mx-auto">This feature is coming soon to the premium portal. You will be able to browse faculty and researchers by expertise.</p>
        </div>
      )}
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
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="pw py-12">
        {content}
      </div>
    </div>
  )
}

function PremiumProjectCard({ project, onOpen }) {
  const piName = project.pi?.name || project.pi || 'Dr. Principal Investigator';
  const initials = piName.split(' ').map(n => n[0]).join('')
  const { role } = useUser();
  return (
    <div className="pc-premium group hover-lift" onClick={onOpen}>
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

function FilterSelect({ label, value, onChange, options }) {
  const [open, setOpen] = useState(false)
  const isSelected = value !== 'All'

  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(!open)}
        className={`dash-filter-btn flex items-center gap-2 outline-none transition-all ${isSelected ? 'border-[var(--dash-green)] bg-[var(--dash-green)] text-white' : ''}`}
      >
        {isSelected ? value : label}
        {isSelected ? (
          <MinusCircle 
            size={14} 
            className="text-white/70 hover:text-white" 
            onClick={(e) => { e.stopPropagation(); onChange('All'); }} 
          />
        ) : (
          <ChevronDown size={14} className="text-gray-400" />
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[100]" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-2xl z-[110] py-2 animate-fade-in">
            <button 
              className="w-full text-left px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50"
              onClick={() => { onChange('All'); setOpen(false); }}
            >
              All {label}
            </button>
            {options.map(opt => (
              <button 
                key={opt}
                className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors ${value === opt ? 'bg-[var(--dash-green)] text-white' : 'text-[var(--dash-text)] hover:bg-gray-50'}`}
                onClick={() => { onChange(opt); setOpen(false); }}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
