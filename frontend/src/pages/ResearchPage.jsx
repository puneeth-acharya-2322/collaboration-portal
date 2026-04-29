import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProjects } from '../api'
import { Search, Filter, Clock, Briefcase, ChevronRight, CheckCircle2, X, SlidersHorizontal } from 'lucide-react'
import { useUser } from '../context/UserContext'
import DashboardLayout from '../components/DashboardLayout'

const dummySeekers = [
  {
    id: 's1',
    name: 'Dr. Anitha Rao',
    role: 'Assistant Professor · AI in Healthcare, KMC',
    skills: ['Medical Imaging', 'NLP in Healthcare', 'PyTorch', 'DICOM', 'Python'],
    hIndex: 8,
    publications: 24,
    mode: 'Hybrid',
    urgency: '8/10',
    seeking: 'Ophthalmologist for clinical validation · Biostatistician for power analysis',
    status: 'Available',
    initials: 'AR',
    color: '#1B3A5C'
  },
  {
    id: 's2',
    name: 'Dr. Priya Ramesh',
    role: 'Associate Professor · Ophthalmology, KMC',
    skills: ['Medical Imaging', 'Clinical Decision Support', 'DICOM', 'Statistical analysis', 'R'],
    hIndex: 11,
    publications: 31,
    mode: 'On-site',
    urgency: '6/10',
    seeking: 'CNN specialist for retinal imaging · Data engineer for DICOM pipeline',
    status: 'Available',
    initials: 'PR',
    color: '#1A7A6E'
  },
  {
    id: 's3',
    name: 'Dr. Suresh Kumar',
    role: 'Professor · Biostatistics, MAHE',
    skills: ['Predictive Analytics', 'AI Ethics & Governance', 'R', 'SPSS', 'Python'],
    hIndex: 14,
    publications: 47,
    mode: 'Remote',
    urgency: '4/10',
    seeking: 'Machine learning engineer · Frontend developer for dashboard',
    status: 'Unavailable',
    initials: 'SK',
    color: '#D4820A'
  },
  {
    id: 's4',
    name: 'Nikhil Varma',
    role: 'PhD Student · Computer Science, MIT Manipal',
    skills: ['Federated Learning', 'Medical Imaging', 'PySyft', 'Docker', 'PyTorch'],
    hIndex: 3,
    publications: 6,
    mode: 'Hybrid',
    urgency: '9/10',
    seeking: 'Clinician co-author for oncology project · Radiologist for annotation review',
    status: 'Available',
    initials: 'NV',
    color: '#7C3AED'
  }
];

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

  // Seeker Filtering State
  const [seekerDesignation, setSeekerDesignation] = useState([])
  const [seekerDept, setSeekerDept] = useState([])
  const [seekerDomain, setSeekerDomain] = useState([])
  const [seekerHIndex, setSeekerHIndex] = useState(0)
  const [seekerPubs, setSeekerPubs] = useState(0)
  const [seekerAvail, setSeekerAvail] = useState('All')
  const [seekerMode, setSeekerMode] = useState([])
  const [seekerUrgency, setSeekerUrgency] = useState('Any')
  const [seekerInst, setSeekerInst] = useState([])

  const [filterOpen, setFilterOpen] = useState(false)
  const filterRef = useRef(null)


  useEffect(() => {
    setView(forceView || 'proj')
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

  const filteredSeekers = dummySeekers.filter(seeker => {
    const matchesSearch = !searchTerm ||
      seeker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seeker.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seeker.seeking.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDesignation = seekerDesignation.length === 0 || 
      seekerDesignation.some(d => seeker.role.includes(d));

    const matchesDept = seekerDept.length === 0 || 
      seekerDept.some(d => seeker.role.includes(d));

    const matchesDomain = seekerDomain.length === 0 || 
      seekerDomain.some(d => seeker.skills.includes(d));

    const matchesHIndex = seeker.hIndex >= seekerHIndex;
    const matchesPubs = seeker.publications >= seekerPubs;

    const matchesAvail = seekerAvail === 'All' || 
      (seekerAvail === 'Available now' && seeker.status === 'Available');

    const matchesMode = seekerMode.length === 0 || 
      seekerMode.some(m => {
        if (m === 'On-site (Manipal)') return seeker.mode === 'On-site';
        return seeker.mode === m;
      });

    const matchesUrgency = seekerUrgency === 'Any' || 
      (seekerUrgency === 'High urgency (7+)' && parseInt(seeker.urgency.split('/')[0]) >= 7);

    const matchesInst = seekerInst.length === 0 || 
      seekerInst.some(inst => {
        if (inst === 'KMC Manipal') return seeker.role.includes('KMC');
        if (inst === 'MIT Manipal') return seeker.role.includes('MIT');
        if (inst === 'External institution') return !seeker.role.includes('KMC') && !seeker.role.includes('MIT');
        return false;
      });

    return matchesSearch && matchesDesignation && matchesDept && matchesDomain && 
           matchesHIndex && matchesPubs && matchesAvail && matchesMode && 
           matchesUrgency && matchesInst;
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
    
    setSeekerDesignation([])
    setSeekerDept([])
    setSeekerDomain([])
    setSeekerHIndex(0)
    setSeekerPubs(0)
    setSeekerAvail('All')
    setSeekerMode([])
    setSeekerUrgency('Any')
    setSeekerInst([])
  }

  // Count active filters for badge
  const activeFilterCount = view === 'proj' ? [
    statusFilter !== 'All',
    domainFilter.length > 0,
    typeFilter !== 'All',
    timeFilter !== 'Any',
    perksFilter.length > 0,
    remoteFilter,
    irbFilter,
    dateFilter !== 'Any',
  ].filter(Boolean).length : [
    seekerDesignation.length > 0,
    seekerDept.length > 0,
    seekerDomain.length > 0,
    seekerHIndex > 0,
    seekerPubs > 0,
    seekerAvail !== 'All',
    seekerMode.length > 0,
    seekerUrgency !== 'Any',
    seekerInst.length > 0,
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
                {view === 'proj' ? (
                  <>
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
                  </>
                ) : (
                  <>
                    {/* Designation */}
                    <FilterSection title="Designation">
                      {['Professor', 'Associate Professor', 'Assistant Professor', 'Research Scholar', 'PhD Student', 'Senior Clinician'].map(opt => (
                        <label key={opt} className="filter-option">
                          <input type="checkbox" checked={seekerDesignation.includes(opt)} onChange={(e) => {
                            if (e.target.checked) setSeekerDesignation([...seekerDesignation, opt])
                            else setSeekerDesignation(seekerDesignation.filter(d => d !== opt))
                          }} />
                          <span className="filter-label">{opt}</span>
                        </label>
                      ))}
                    </FilterSection>
                    <div className="filter-divider" />
                    
                    {/* Department */}
                    <FilterSection title="Department">
                      {['AI in Healthcare', 'Ophthalmology', 'Internal Medicine', 'Oncology', 'MIT Manipal (CS/ECE)'].map(opt => (
                        <label key={opt} className="filter-option">
                          <input type="checkbox" checked={seekerDept.includes(opt)} onChange={(e) => {
                            if (e.target.checked) setSeekerDept([...seekerDept, opt])
                            else setSeekerDept(seekerDept.filter(d => d !== opt))
                          }} />
                          <span className="filter-label">{opt}</span>
                        </label>
                      ))}
                    </FilterSection>
                    <div className="filter-divider" />
                    
                    {/* Expertise domain */}
                    <FilterSection title="Expertise domain">
                      {['Medical Imaging', 'NLP in Healthcare', 'Predictive Analytics', 'Genomics'].map(opt => (
                        <label key={opt} className="filter-option">
                          <input type="checkbox" checked={seekerDomain.includes(opt)} onChange={(e) => {
                            if (e.target.checked) setSeekerDomain([...seekerDomain, opt])
                            else setSeekerDomain(seekerDomain.filter(d => d !== opt))
                          }} />
                          <span className="filter-label">{opt}</span>
                        </label>
                      ))}
                    </FilterSection>
                    <div className="filter-divider" />
                    
                    {/* h-index & Publications */}
                    <FilterSection title="h-index (minimum)">
                      <div style={{ padding: '0 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                           <input type="range" min="0" max="50" value={seekerHIndex} onChange={(e) => setSeekerHIndex(e.target.value)} style={{ flex: 1, accentColor: 'var(--dash-navy)' }} />
                           <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--dash-navy)', width: '20px' }}>{seekerHIndex}</span>
                        </div>
                      </div>
                    </FilterSection>
                    <div className="filter-divider" />
                    
                    <FilterSection title="Publications (minimum)">
                      <div style={{ padding: '0 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                           <input type="range" min="0" max="100" value={seekerPubs} onChange={(e) => setSeekerPubs(e.target.value)} style={{ flex: 1, accentColor: 'var(--dash-navy)' }} />
                           <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--dash-navy)', width: '20px' }}>{seekerPubs}</span>
                        </div>
                      </div>
                    </FilterSection>
                    <div className="filter-divider" />
                    
                    {/* Availability */}
                    <FilterSection title="Availability">
                      {['All', 'Available now'].map(opt => (
                        <label key={opt} className="filter-option">
                          <input type="radio" name="availability" checked={seekerAvail === opt} onChange={() => setSeekerAvail(opt)} />
                          <span className="filter-label">{opt}</span>
                        </label>
                      ))}
                    </FilterSection>
                    <div className="filter-divider" />
                    
                    {/* Mode preference */}
                    <FilterSection title="Mode preference">
                      {['Remote', 'On-site (Manipal)', 'Hybrid'].map(opt => (
                        <label key={opt} className="filter-option">
                          <input type="checkbox" checked={seekerMode.includes(opt)} onChange={(e) => {
                            if (e.target.checked) setSeekerMode([...seekerMode, opt])
                            else setSeekerMode(seekerMode.filter(d => d !== opt))
                          }} />
                          <span className="filter-label">{opt}</span>
                        </label>
                      ))}
                    </FilterSection>
                    <div className="filter-divider" />
                    
                    {/* Urgency level */}
                    <FilterSection title="Urgency level">
                      {['Any', 'High urgency (7+)'].map(opt => (
                        <label key={opt} className="filter-option">
                          <input type="radio" name="urgency" checked={seekerUrgency === opt} onChange={() => setSeekerUrgency(opt)} />
                          <span className="filter-label">{opt}</span>
                        </label>
                      ))}
                    </FilterSection>
                    <div className="filter-divider" />
                    
                    {/* Institution */}
                    <FilterSection title="Institution">
                      {['KMC Manipal', 'MIT Manipal', 'External institution'].map(opt => (
                        <label key={opt} className="filter-option">
                          <input type="checkbox" checked={seekerInst.includes(opt)} onChange={(e) => {
                            if (e.target.checked) setSeekerInst([...seekerInst, opt])
                            else setSeekerInst(seekerInst.filter(d => d !== opt))
                          }} />
                          <span className="filter-label">{opt}</span>
                        </label>
                      ))}
                    </FilterSection>
                  </>
                )}
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
                  Show {view === 'proj' ? filteredProjects.length : filteredSeekers.length} Results
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px', marginTop: '-8px' }}>
          {view === 'proj' ? (
            <>
              {statusFilter !== 'All' && <FilterChip label={`Status: ${statusFilter}`} onRemove={() => setStatusFilter('All')} />}
              {domainFilter.map(d => <FilterChip key={d} label={d} onRemove={() => setDomainFilter(domainFilter.filter(x => x !== d))} />)}
              {typeFilter !== 'All' && <FilterChip label={`Type: ${typeFilter}`} onRemove={() => setTypeFilter('All')} />}
              {timeFilter !== 'Any' && <FilterChip label={timeFilter} onRemove={() => setTimeFilter('Any')} />}
              {perksFilter.map(p => <FilterChip key={p} label={p} onRemove={() => setPerksFilter(perksFilter.filter(x => x !== p))} />)}
              {remoteFilter && <FilterChip label="Remote" onRemove={() => setRemoteFilter(false)} />}
              {irbFilter && <FilterChip label="IRB Approved" onRemove={() => setIrbFilter(false)} />}
              {dateFilter !== 'Any' && <FilterChip label={dateFilter} onRemove={() => setDateFilter('Any')} />}
            </>
          ) : (
            <>
              {seekerDesignation.map(d => <FilterChip key={d} label={d} onRemove={() => setSeekerDesignation(seekerDesignation.filter(x => x !== d))} />)}
              {seekerDept.map(d => <FilterChip key={d} label={d} onRemove={() => setSeekerDept(seekerDept.filter(x => x !== d))} />)}
              {seekerDomain.map(d => <FilterChip key={d} label={d} onRemove={() => setSeekerDomain(seekerDomain.filter(x => x !== d))} />)}
              {seekerHIndex > 0 && <FilterChip label={`h-index: ${seekerHIndex}+`} onRemove={() => setSeekerHIndex(0)} />}
              {seekerPubs > 0 && <FilterChip label={`Pubs: ${seekerPubs}+`} onRemove={() => setSeekerPubs(0)} />}
              {seekerAvail !== 'All' && <FilterChip label={seekerAvail} onRemove={() => setSeekerAvail('All')} />}
              {seekerMode.map(m => <FilterChip key={m} label={m} onRemove={() => setSeekerMode(seekerMode.filter(x => x !== m))} />)}
              {seekerUrgency !== 'Any' && <FilterChip label={seekerUrgency} onRemove={() => setSeekerUrgency('Any')} />}
              {seekerInst.map(i => <FilterChip key={i} label={i} onRemove={() => setSeekerInst(seekerInst.filter(x => x !== i))} />)}
            </>
          )}
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
        {view === 'seeker' ? (
          filteredSeekers.map(seeker => (
            <PremiumSeekerCard key={seeker.id} seeker={seeker} />
          ))
        ) : (
          filteredProjects.map(project => (
            <PremiumProjectCard key={project.id} project={project} />
          ))
        )}
        {view === 'proj' && filteredProjects.length === 0 && (
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


function PremiumSeekerCard({ seeker }) {
  const navigate = useNavigate();
  
  return (
    <div className="proj-card-premium group hover-lift" onClick={() => navigate('/login')}>
      <div className="pc-premium-header">
        <div className="pc-premium-pi">
          <div className="pc-premium-av">{seeker.initials}</div>
          <div className="pc-premium-pi-info">
            <span className="pc-premium-pi-name">{seeker.name}</span>
            <span className="pc-premium-pi-role">{seeker.role}</span>
          </div>
        </div>
      </div>

      <h3 className="pc-premium-title text-sm mt-2 mb-1" style={{ fontSize: '14px', lineHeight: '1.4' }}>
        Seeking: {seeker.seeking}
      </h3>
      
      <div className="pc-premium-meta mb-3" style={{ fontSize: '12px' }}>
        <span className="font-semibold text-gray-700">{seeker.hIndex}</span> h-index &nbsp;·&nbsp; <span className="font-semibold text-gray-700">{seeker.publications}</span> publications &nbsp;·&nbsp; {seeker.mode}
      </div>

      <div className="pc-premium-tags">
        <span className="pc-premium-tag" style={{ background: seeker.status === 'Available' ? 'var(--dash-green-soft)' : '#fee2e2', color: seeker.status === 'Available' ? 'var(--dash-green)' : '#dc2626' }}>
          {seeker.status}
        </span>
        {seeker.skills?.slice(0, 3).map(skill => (
          <span key={skill} className="pc-premium-tag">{skill}</span>
        ))}
      </div>

      <div className="pc-premium-footer">
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            navigate('/login'); 
          }} 
          className="pc-premium-btn"
        >
          VIEW PROFILE
        </button>
      </div>
    </div>
  )
}
