import { useState, useEffect } from 'react'
import { getProjects } from '../api'
import { Search, Info, Check, Filter, Lock, AlertCircle } from 'lucide-react'
import LockOverlay from '../components/LockOverlay'
import { useUser } from '../context/UserContext'

export default function ResearchPage({ forceView }) {
  const { role } = useUser()
  const [view, setView] = useState(forceView || 'proj') // 'proj' or 'seeker'
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Sub-navigation Tabs */}
      <div className="subnav" style={{ position: 'sticky', top: '56px', zIndex: 90 }}>
        <button 
          className={`snb ${view === 'proj' ? 'active' : ''}`}
          onClick={() => setView('proj')}
        >
          Research Projects <span className="badge-count">{projects.length}</span>
        </button>
        <button 
          className={`snb ${view === 'seeker' ? 'active' : ''}`}
          onClick={() => setView('seeker')}
        >
          Collaborators <span className="badge-count">142</span>
        </button>
      </div>

      <div className="pw">
        <div className="split">
          {/* SIDEBAR FILTERS */}
          <aside className="sidebar">
            <div className="sb-header">
              Refine Search
              <button className="sb-clear">Clear all</button>
            </div>

            <div className="sb-section">
              <div className="sb-title">Project Status <span className="sb-arrow">▼</span></div>
              <div className="sb-options">
                <label className="sb-opt active"><input type="radio" name="status" defaultChecked /> Open to All</label>
                <label className="sb-opt"><input type="radio" name="status" /> Ongoing</label>
                <label className="sb-opt"><input type="radio" name="status" /> Upcoming</label>
              </div>
            </div>

            <div className="sb-section">
              <div className="sb-title">Domain <span className="sb-arrow">▼</span></div>
              <div className="sb-options">
                <label className="sb-opt"><input type="checkbox" /> Medical Imaging</label>
                <label className="sb-opt"><input type="checkbox" /> Clinical NLP</label>
                <label className="sb-opt"><input type="checkbox" /> Predictive Analytics</label>
                <label className="sb-opt"><input type="checkbox" /> Health Informatics</label>
              </div>
            </div>

            <div className="sb-section">
              <div className="sb-title">Time Commitment <span className="sb-arrow">▼</span></div>
              <div className="sb-range">
                <input type="range" min="0" max="20" />
                <span className="sb-range-val">10h</span>
              </div>
            </div>
            
            <div className="sb-section">
              <div className="sb-title">Match Level <span className="sb-arrow">▼</span></div>
              <div className="sb-options">
                 <label className="sb-opt"><input type="checkbox" /> &gt; 80% Match</label>
                 <label className="sb-opt"><input type="checkbox" /> Handpicked for you</label>
              </div>
            </div>
          </aside>

          {/* MAIN RESULTS */}
          <main>
            {/* AMBER ALERT BANNER (Only for Public Users) */}
            {role === 'public' && (
              <div className="lock-banner">
                <AlertCircle size={16} style={{ color: 'var(--amber)' }} />
                <div>
                  <span className="font-bold">2 private projects are hidden.</span>{' '}
                  <span className="underline cursor-pointer">Login or register</span> to see all projects including department-private listings.
                </div>
              </div>
            )}

            <div className="results-header">
              <div className="results-title">
                {view === 'proj' ? 'Projects matching your preferences' : 'Potential Research Partners'}
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className="results-count">Showing {view === 'proj' ? projects.length : '142'} matches</span>
                <select className="sort-sel">
                  <option>Best Match</option>
                  <option>Newest First</option>
                </select>
              </div>
            </div>

            <div className="results-list">
              {view === 'proj' ? (
                projects.map(project => <ProjectCard key={project.id} project={project} />)
              ) : (
                <ResearcherList />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project }) {
  const piName = project.pi?.name || project.pi || 'Dr. Principal Investigator';
  const piAvatar = piName.slice(0, 2).toUpperCase();
  const { role } = useUser();
  const isLocked = project.visibility === 'private' && role === 'public';

  return (
    <div className={`project-card ${isLocked ? 'relative overflow-hidden' : ''}`}>
      {isLocked && <LockOverlay />}

      <div className="pc-left">
        <div className="pc-top">
          <div className="pc-avatar" style={{ background: 'var(--teal)' }}>
            {piAvatar}
          </div>
          <div>
            <div className="pc-title">{project.title}</div>
            <div className="pc-pi">{piName} · {project.domain || 'AI Healthcare'}</div>
          </div>
        </div>
        
        <div className="pc-meta">
          <span className={`pc-tag ${project.status === 'Ongoing' ? 'tag-status-on' : 'tag-status-up'}`}>
            {project.status || 'Ongoing'}
          </span>
          {project.skills?.slice(0, 3).map(skill => (
            <span key={skill} className="pc-tag tag-skill">{skill}</span>
          ))}
          {project.skills?.length > 3 && <span className="pc-tag tag-skill">+{project.skills.length - 3}</span>}
          
          <span className={`pc-tag ${project.visibility === 'public' ? 'tag-public' : 'tag-private'}`}>
             {project.visibility === 'public' ? '🌐 Public' : '🔒 Private'}
          </span>
        </div>

        <p className="pc-abstract">
          {project.shortDescription || "Building a specialized AI model targeting clinical datasets for improved diagnostic accuracy and workflow efficiency."}
        </p>

        <div className="pc-footer">
          {project.perks?.map(perk => (
             <div key={perk} className="pc-perk"><Check size={10} strokeWidth={3} className="text-teal-600" /> {perk}</div>
          ))}
          {!project.perks && (
            <>
               <div className="pc-perk"><Check size={10} strokeWidth={3} /> Co-authorship</div>
               <div className="pc-perk"><Check size={10} strokeWidth={3} /> Clinical Data Access</div>
            </>
          )}
        </div>
      </div>
      
      <div className="pc-right">
        {/* Match score ring as seen in reference */}
        <div style={{ position: 'relative', width: '60px', height: '60px' }} className="mb-2">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
             <circle 
                cx="18" cy="18" r="16" 
                fill="none" 
                stroke="#f0f3f7" 
                strokeWidth="3" 
             />
             <circle 
                cx="18" cy="18" r="16" 
                fill="none" 
                stroke="var(--teal)" 
                strokeWidth="3" 
                strokeDasharray="100" 
                strokeDashoffset="15" 
                strokeLinecap="round" 
             />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
             <div className="text-[12px] font-bold text-[var(--navy)]">91%</div>
             <div className="text-[7px] text-[var(--muted)] font-bold uppercase">match</div>
          </div>
        </div>

        <button className="collab-btn">View details</button>
        <div className="lock-note mt-2">Login to apply</div>
      </div>
    </div>
  )
}

function ResearcherList() {
  const researchers = [
    { name: 'Dr. Anitha Rao', desig: 'Assistant Professor · AI in Healthcare, KMC', skills: ['Medical Imaging', 'NLP', 'PyTorch'], avail: true, metrics: { hindex: 8, pubs: 24, urgency: '8/10' } },
    { name: 'Dr. Priya Ramesh', desig: 'Associate Professor · Ophthalmology, KMC', skills: ['Medical Imaging', 'Clinical Decisions', 'DICOM'], avail: true, metrics: { hindex: 11, pubs: 31, urgency: '6/10' } }
  ]

  return (
    <>
      {researchers.map(r => (
        <div key={r.name} className="seeker-card">
          <div className="pc-left">
            <div className="pc-top">
              <div className="sk-av" style={{ background: 'var(--navy)' }}>{r.name.split(' ').map(n=>n[0]).join('')}</div>
              <div>
                <div className="sk-name">{r.name} <span className={`sk-avail ${r.avail ? 'avail-on' : 'avail-off'}`} style={{ display: 'inline-block', marginLeft: '6px' }} /> <span className="text-[10px] text-green-600 font-bold">Available</span></div>
                <div className="sk-desig">{r.desig}</div>
              </div>
            </div>
            <div className="pc-meta">
              {r.skills.map(s => <span key={s} className="pc-tag tag-skill">{s}</span>)}
            </div>
            <div className="sk-metrics mt-1">
              <div className="sk-metric"><strong>{r.metrics.hindex}</strong> h-index</div>
              <div className="sk-metric"><strong>{r.metrics.pubs}</strong> publications</div>
              <div className="sk-metric">Urgency: <strong className="text-red-600">{r.metrics.urgency}</strong></div>
            </div>
            <p className="pc-abstract mt-2">Seeking computer vision specialist for retinal imaging data engineer for DICOM pipeline validation...</p>
          </div>
          <div className="pc-right">
             <div style={{ position: 'relative', width: '60px', height: '60px' }} className="mb-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                   <circle cx="18" cy="18" r="16" fill="none" stroke="#f0f3f7" strokeWidth="3" />
                   <circle cx="18" cy="18" r="16" fill="none" stroke="var(--teal)" strokeWidth="3" strokeDasharray="100" strokeDashoffset="22" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <div className="text-[12px] font-bold text-[var(--navy)]">78%</div>
                   <div className="text-[7px] text-[var(--muted)] font-bold uppercase">match</div>
                </div>
             </div>
             <button className="collab-btn teal">View profile</button>
          </div>
        </div>
      ))}
    </>
  )
}

