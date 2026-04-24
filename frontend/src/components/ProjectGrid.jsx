import ProjectCard from './ProjectCard.jsx'
import { LayoutGrid, ListFilter, Search, Info } from 'lucide-react'

export default function ProjectGrid({ projects, totalCount, loading, sortBy, setSortBy, onSelect, onOpenFilters }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white border border-[var(--border)] rounded-2xl h-64 animate-pulse p-6">
            <div className="flex gap-2 mb-4">
              <div className="w-20 h-5 bg-[var(--bg)] rounded-full" />
              <div className="w-16 h-5 bg-[var(--bg)] rounded-full" />
            </div>
            <div className="w-3/4 h-6 bg-[var(--bg)] rounded-lg mb-4" />
            <div className="w-full h-16 bg-[var(--bg)]/50 rounded-xl mb-6" />
            <div className="flex gap-2">
              <div className="w-16 h-4 bg-[var(--bg)] rounded" />
              <div className="w-16 h-4 bg-[var(--bg)] rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Premium Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenFilters}
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--navy)] text-white text-[13px] font-bold hover:bg-[#152e4a] transition-all"
          >
            <ListFilter size={16} />
            Filters
          </button>
          <div className="flex items-center gap-2 text-[13px] font-medium text-[var(--muted)]">
            <LayoutGrid size={16} className="text-[var(--gold)]" />
            <span>Showing <span className="text-[var(--navy)] font-bold">{projects.length}</span> of <span className="text-[var(--navy)] font-bold">{totalCount}</span> Research Opportunities</span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="hidden sm:block text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">Sort by</label>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[13px] font-bold text-[var(--navy)] outline-none focus:border-[var(--navy)] transition-all cursor-pointer"
          >
            <option value="recent">Recently Added</option>
            <option value="deadline">Application Deadline</option>
            <option value="alpha">Project Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Grid Layout */}
      {projects.length === 0 ? (
        <div className="bg-white border border-[var(--border)] rounded-3xl p-16 text-center animate-fade-in shadow-sm">
          <div className="w-20 h-20 bg-[var(--bg)] rounded-full flex items-center justify-center mx-auto mb-6">
            <Search size={32} className="text-[var(--muted)]" />
          </div>
          <h3 className="text-xl font-bold font-['Merriweather',serif] text-[var(--navy)] mb-2">No matches found</h3>
          <p className="text-[14px] text-[var(--muted)] font-medium max-w-sm mx-auto">
            We couldn't find any projects matching your current filters. Try broadening your search or clearing all filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onClick={() => onSelect(project)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
