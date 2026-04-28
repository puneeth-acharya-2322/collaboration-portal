import { useState, useEffect } from 'react'
import CollabForm from './CollabForm.jsx'
import { X, Calendar, Clock, Globe, User, Sparkles, Code, Stethoscope, Award, ArrowRight, Zap, Target } from 'lucide-react'

function getDaysUntil(deadline) {
  const diff = new Date(deadline) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export default function ProjectDetailModal({ project, onClose }) {
  const [showForm, setShowForm] = useState(false)
  const [closing, setClosing] = useState(false)
  const daysLeft = getDaysUntil(project.deadline)

  const handleClose = () => {
    setClosing(true)
    setTimeout(onClose, 300)
  }

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 sm:p-6 md:p-10 animate-fade-in font-['DM_Sans',sans-serif]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-md" onClick={handleClose} />

      {/* Modal Container */}
      <div className={`relative bg-white w-full max-w-5xl h-full sm:h-auto sm:max-h-[90vh] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row ${closing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'} transition-all duration-300`}>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <button onClick={handleClose} className="md:hidden absolute top-4 right-4 p-2 bg-[var(--bg)] rounded-full text-[var(--muted)]">
            <X size={20} />
          </button>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-[var(--dash-green-soft)] text-[var(--dash-green)] text-[10px] font-bold uppercase tracking-widest border border-[var(--dash-green)]/10">
                {project.type}
              </span>
              <span className="px-3 py-1 rounded-full bg-[var(--dash-bg)] text-[var(--dash-text)] text-[10px] font-bold uppercase tracking-widest border border-[var(--dash-border)]">
                {project.domain}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-['Merriweather',serif] text-[var(--dash-text)] leading-tight mb-2">
              {project.title}
            </h2>
            <div className="flex items-center gap-2.5 text-[14px] font-medium text-[var(--dash-muted)]">
              <User size={16} className="text-[var(--dash-green)]" />
              <span>Lead Investigator: <span className="text-[var(--dash-text)] font-bold">{project.pi?.name || project.pi || 'Not Assigned'}</span></span>
            </div>
          </div>

          <div className="space-y-10">
            {/* Clinical Problem */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                  <Stethoscope size={20} />
                </div>
                <h3 className="text-lg font-bold font-['Merriweather',serif] text-[var(--dash-text)]">The Clinical Problem</h3>
              </div>
              <div className="bg-[var(--bg)] rounded-2xl p-6 border border-[var(--border)] italic text-[var(--text)] leading-relaxed font-medium">
                "{project.clinicalProblem}"
              </div>
            </section>

            {/* Tech Stack */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--dash-green-soft)] flex items-center justify-center text-[var(--dash-green)]">
                  <Code size={20} />
                </div>
                <h3 className="text-lg font-bold font-['Merriweather',serif] text-[var(--dash-text)]">Methodology & Tech Stack</h3>
              </div>
              <div className="space-y-3 ml-1">
                {(project.techStack || []).map(tech => (
                  <div key={tech} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--dash-green)]" />
                    <span className="text-[14px] font-bold text-[var(--dash-text)]">
                      {tech}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Collaborator Role */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--gold)]/10 flex items-center justify-center text-[var(--gold)]">
                  <Target size={20} />
                </div>
                <h3 className="text-lg font-bold font-['Merriweather',serif] text-[var(--navy)]">Collaborator Objectives</h3>
              </div>
              <p className="text-[14.5px] text-[var(--muted)] leading-relaxed font-medium pl-1">
                {project.collaboratorRole}
              </p>
            </section>

            {/* Perks */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--dash-bg)] flex items-center justify-center text-[var(--dash-text)]">
                  <Award size={20} />
                </div>
                <h3 className="text-lg font-bold font-['Merriweather',serif] text-[var(--dash-text)]">Recognition & Perks</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(project.perks || []).map((perk, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white border border-[var(--dash-border)] rounded-xl shadow-sm">
                    <Sparkles size={16} className="text-[var(--dash-green)] shrink-0" />
                    <span className="text-[13px] font-bold text-[var(--dash-text)]">{perk}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Sidebar Panel */}
        <div className="w-full md:w-[340px] bg-[var(--bg)] border-t md:border-t-0 md:border-l border-[var(--border)] p-8 flex flex-col">
          <button onClick={handleClose} className="hidden md:flex self-end mb-8 p-2 bg-white border border-[var(--border)] rounded-full text-[var(--muted)] hover:text-[var(--navy)] transition-colors">
            <X size={20} />
          </button>

          <div className="space-y-6 flex-1">
            <div className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-widest mb-4">Project Overview</div>
            
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-[var(--border)] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[var(--bg)] flex items-center justify-center text-[var(--navy)]">
                <Calendar size={18} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-tighter">Deadline</div>
                <div className="text-[13px] font-bold text-[var(--navy)]">{new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-[var(--border)] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[var(--bg)] flex items-center justify-center text-[var(--navy)]">
                <Clock size={18} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-tighter">Commitment</div>
                <div className="text-[13px] font-bold text-[var(--navy)]">{project.hoursPerWeek} Hours / Week</div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-[var(--border)] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[var(--bg)] flex items-center justify-center text-[var(--navy)]">
                <Globe size={18} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-tighter">Location</div>
                <div className="text-[13px] font-bold text-[var(--navy)]">{project.remoteOk ? 'Remote Friendly' : 'On-site Residency'}</div>
              </div>
            </div>

            {daysLeft > 0 && (
              <div className="p-4 bg-[var(--navy)] rounded-2xl border border-white/10 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 text-white/5"><Zap size={40} /></div>
                <div className="relative z-10">
                  <div className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Hurry Up!</div>
                  <div className="text-white text-[15px] font-bold">Applications close in {daysLeft} days</div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-10 pt-6 border-t border-[var(--border)]">
            {project.status !== 'Closed' ? (
              <button 
                onClick={() => setShowForm(true)}
                className="w-full bg-[var(--dash-green)] text-white py-4 rounded-2xl font-bold text-[15px] hover:bg-[#16a34a] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[var(--dash-green)]/20"
              >
                Start Collaboration Brief
                <ArrowRight size={18} />
              </button>
            ) : (
              <div className="w-full py-4 text-center rounded-2xl bg-gray-100 text-gray-500 font-bold text-[14px]">
                Applications Currently Closed
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Collaboration Form Modal Layer */}
      {showForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="absolute inset-0 bg-[var(--navy)]/60 backdrop-blur-xl" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col z-10 transition-all">
            <div className="bg-[var(--bg)] border-b border-[var(--border)] px-8 py-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-['Merriweather',serif] text-[var(--navy)]">Apply to Collaborate</h3>
                <p className="text-[12px] text-[var(--muted)] font-medium italic mt-1">{project.title}</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white border border-transparent hover:border-[var(--border)] rounded-full transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              <CollabForm projectId={project.id} projectTitle={project.title} onSuccess={() => setShowForm(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
