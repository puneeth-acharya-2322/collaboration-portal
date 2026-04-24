import { User, ArrowRight, Sparkles, Plus } from 'lucide-react'

function getStatusBadge(status) {
  switch (status) {
    case 'Open': return 'bg-[#E8F5F3] text-[var(--teal)]'
    case 'Closing Soon': return 'bg-[#FEF3E2] text-[var(--amber)]'
    case 'Closed': return 'bg-[#FEF2F2] text-[var(--red)]'
    default: return 'bg-gray-100 text-gray-500'
  }
}

export default function ProjectCard({ project, index, onClick }) {
  const skills = (project.skills || []).slice(0, 3)
  
  return (
    <div
      className="bg-white border border-[var(--border)] rounded-2xl overflow-hidden cursor-pointer group hover:border-[var(--navy)] hover:shadow-xl transition-all duration-300 animate-fade-in flex flex-col h-full shadow-sm"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
      onClick={onClick}
    >
      <div className="p-6 flex flex-col flex-1">
        {/* Badge Row */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(project.status)}`}>
            {project.status === 'Open' ? 'Open for Collab.' : project.status}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-[var(--bg)] text-[var(--navy)] text-[10px] font-bold uppercase tracking-wider border border-[var(--border)]">
            {project.type}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[17px] font-bold font-['Merriweather',serif] text-[var(--navy)] mb-2 group-hover:text-[var(--teal)] transition-colors leading-tight">
          {project.title}
        </h3>

        {/* Domain / Meta */}
        <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-4 flex flex-wrap gap-2">
          {project.domain.split(' ').map((d, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="opacity-30">·</span>}
              {d}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-[13.5px] text-[var(--muted)] leading-relaxed line-clamp-3 mb-6 font-medium">
          {project.shortDescription}
        </p>

        {/* Skills / Tech */}
        <div className="mt-auto pt-4 flex flex-wrap gap-1.5">
          {skills.map(skill => (
            <span key={skill} className="px-2.5 py-1 bg-[var(--bg)] text-[var(--navy)] text-[11px] font-bold rounded-lg border border-[var(--border)]">
              {skill}
            </span>
          ))}
          {project.skills.length > 3 && (
            <span className="px-2 py-1 text-[var(--muted)] text-[10px] font-bold">+{project.skills.length - 3}</span>
          )}
        </div>
      </div>

      {/* Footer / Action */}
      <div className="bg-[var(--bg)] px-6 py-4 flex items-center justify-between border-t border-[var(--border)] group-hover:bg-[var(--navy)] transition-colors duration-300">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white border border-[var(--border)] flex items-center justify-center text-[var(--navy)] font-bold text-[11px] group-hover:border-white/20">
            {project.pi.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-tight group-hover:text-white/40 leading-none mb-1">Lead Investigator</div>
            <div className="text-[12px] font-bold text-[var(--navy)] group-hover:text-white leading-none">{project.pi.name}</div>
          </div>
        </div>
        
        <div className="w-8 h-8 rounded-full bg-white text-[var(--navy)] flex items-center justify-center shadow-sm group-hover:bg-[var(--gold)] group-hover:scale-110 transition-all duration-300">
          <ArrowRight size={16} />
        </div>
      </div>
    </div>
  )
}
