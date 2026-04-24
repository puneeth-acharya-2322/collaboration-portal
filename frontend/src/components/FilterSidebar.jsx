import { Check, X, Layers, Code, Globe, Activity, RotateCcw } from 'lucide-react'

const SKILLS = ['Python', 'MERN', 'Data Analysis', 'R', 'NLP', 'TensorFlow', 'PyTorch', 'OpenCV', 'SQL', 'HuggingFace']
const DOMAINS = ['NLP in Healthcare', 'Medical Imaging', 'Predictive Analytics', 'Clinical Decision AI', 'Drug Discovery AI']
const STATUSES = ['Open', 'Closing Soon', 'Closed']

export default function FilterSidebar({
  typeFilter, setTypeFilter,
  skillFilter, setSkillFilter,
  domainFilter, setDomainFilter,
  statusFilter, setStatusFilter,
  clearFilters, hasFilters
}) {
  const toggleArrayItem = (arr, setArr, item) => {
    setArr(arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item])
  }

  const SectionHeader = ({ title, icon: Icon }) => (
    <h4 className="flex items-center gap-2 text-[11px] font-bold text-[var(--muted)] uppercase tracking-widest mb-4">
      <Icon size={14} className="text-[var(--gold)]" />
      {title}
    </h4>
  )

  return (
    <div className="space-y-10 font-['DM_Sans',sans-serif]">
      {/* Type Section */}
      <div>
        <SectionHeader title="Opportunity Type" icon={Layers} />
        <div className="flex gap-2">
          {['Project', 'Paper'].map(type => (
            <button
              key={type}
              onClick={() => toggleArrayItem(typeFilter, setTypeFilter, type)}
              className={`flex-1 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all border ${
                typeFilter.includes(type)
                  ? 'bg-[var(--navy)] text-white border-[var(--navy)] shadow-md'
                  : 'bg-white text-[var(--navy)] border-[var(--border)] hover:border-[var(--muted)]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Section */}
      <div>
        <SectionHeader title="Technical Skills" icon={Code} />
        <div className="flex flex-wrap gap-2">
          {SKILLS.map(skill => {
            const active = skillFilter.includes(skill)
            return (
              <button
                key={skill}
                onClick={() => toggleArrayItem(skillFilter, setSkillFilter, skill)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all border ${
                  active
                    ? 'bg-[var(--teal-l)] text-[var(--teal)] border-[var(--teal)]/20'
                    : 'bg-white text-[var(--muted)] border-[var(--border)] hover:border-[var(--muted)] hover:text-[var(--navy)]'
                }`}
              >
                {skill}
              </button>
            )
          })}
        </div>
      </div>

      {/* Domain Section */}
      <div>
        <SectionHeader title="Research Domain" icon={Globe} />
        <div className="space-y-2">
          {DOMAINS.map(domain => {
            const active = domainFilter.includes(domain)
            return (
              <label 
                key={domain} 
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all group ${
                  active 
                    ? 'bg-[var(--bg)] border-[var(--navy)]/20 shadow-sm' 
                    : 'bg-white border-[var(--border)] hover:border-[var(--muted)]'
                }`}
              >
                <span className={`text-[13px] font-bold transition-colors ${active ? 'text-[var(--navy)]' : 'text-[var(--muted)] group-hover:text-[var(--navy)]'}`}>
                  {domain}
                </span>
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${active ? 'bg-[var(--navy)] border-[var(--navy)]' : 'border-[var(--border)]'}`}>
                  {active && <Check size={14} className="text-white" />}
                </div>
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggleArrayItem(domainFilter, setDomainFilter, domain)}
                  className="hidden"
                />
              </label>
            )
          })}
        </div>
      </div>

      {/* Status Section */}
      <div>
        <SectionHeader title="Current Status" icon={Activity} />
        <div className="grid grid-cols-1 gap-2">
          {STATUSES.map(status => {
            const active = statusFilter.includes(status)
            const colors = {
              'Open': 'text-[var(--teal)] bg-[var(--teal-l)]',
              'Closing Soon': 'text-[var(--gold)] bg-[var(--gold)]/10',
              'Closed': 'text-[var(--red)] bg-[var(--red-l)]',
            }
            return (
              <button
                key={status}
                onClick={() => toggleArrayItem(statusFilter, setStatusFilter, status)}
                className={`w-full px-4 py-2.5 rounded-xl text-[12px] font-bold text-left transition-all border ${
                  active
                    ? `${colors[status]} border-current shadow-sm`
                    : 'bg-white text-[var(--muted)] border-[var(--border)] hover:border-[var(--muted)]'
                }`}
              >
                {status}
              </button>
            )
          })}
        </div>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--red-l)] text-[var(--red)] text-[13px] font-bold rounded-xl border border-[var(--red)]/10 hover:bg-[var(--red)] hover:text-white transition-all shadow-sm"
        >
          <RotateCcw size={16} />
          Reset All Filters
        </button>
      )}
    </div>
  )
}
