import { useState, useEffect, Fragment } from 'react'
import { getApplications, updateApplication } from '../../api'
import { FileDown, ChevronDown, ChevronUp, CheckCircle, Circle, ArrowRight } from 'lucide-react'

export default function ApplicationsTable() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)

  const fetchApps = async () => {
    try {
      const data = await getApplications()
      setApplications(data.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchApps() }, [])

  const toggleReviewed = async (app) => {
    try {
      await updateApplication(app.id, { reviewed: !app.reviewed })
      setApplications(prev => prev.map(a => a.id === app.id ? { ...a, reviewed: !a.reviewed } : a))
    } catch (err) {
      console.error(err)
    }
  }

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'Institution', 'Project', 'Availability', 'Start Date', 'Pitch', 'Submitted', 'Reviewed']
    const rows = applications.map(a => [
      a.name, a.email, a.role, a.institution, a.projectTitle || 'General',
      a.availability, a.startDate, `"${(a.pitch || '').replace(/"/g, '""')}"`,
      new Date(a.submittedAt).toLocaleDateString(), a.reviewed ? 'Yes' : 'No'
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `applications_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1,2,3].map(i => (
          <div key={i} className="h-16 bg-white border border-[var(--border)] rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-['Merriweather',serif] text-[var(--navy)] font-bold">Applications</h2>
          <p className="text-[12px] text-[var(--muted)]">{applications.length} submissions total</p>
        </div>
        <button 
          onClick={exportCSV} 
          className="px-4 py-2 bg-white border border-[var(--border)] text-[var(--navy)] text-[12px] font-bold rounded-lg hover:bg-[var(--primary-light)] transition-all flex items-center gap-2"
        >
          <FileDown size={16} />
          Export CSV
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white border border-[var(--border)] rounded-xl p-16 text-center shadow-sm">
          <div className="text-4xl mb-4 text-[var(--muted)]">📭</div>
          <h3 className="font-bold text-[var(--navy)] mb-1">No applications yet</h3>
          <p className="text-[13px] text-[var(--muted)]">Applications will appear here once submitted by researchers.</p>
        </div>
      ) : (
        <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[var(--bg)] border-b border-[var(--border)]">
                <tr>
                  <th className="px-6 py-3 text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">Applicant</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider hidden md:table-cell">Role</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider hidden lg:table-cell">Project</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider hidden lg:table-cell">Received</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider text-center">Reviewed</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {applications.map(app => (
                  <Fragment key={app.id}>
                    <tr
                      className={`hover:bg-[var(--bg)] transition-colors cursor-pointer group ${expandedId === app.id ? 'bg-[var(--bg)]' : ''}`}
                      onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[var(--primary-light)] text-[var(--navy)] flex items-center justify-center font-bold text-[12px]">
                            {app.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="text-[13px] font-bold text-[var(--navy)] leading-tight">{app.name}</div>
                            <div className="text-[11px] text-[var(--muted)]">{app.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="px-2.5 py-0.5 rounded-full bg-[var(--primary-light)] text-[var(--navy)] text-[10px] font-bold">
                          {app.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[12px] text-[var(--muted)] hidden lg:table-cell max-w-[180px] truncate">
                        {app.projectTitle || 'General Application'}
                      </td>
                      <td className="px-6 py-4 text-[11px] text-[var(--muted)] hidden lg:table-cell">
                        {formatDate(app.submittedAt)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleReviewed(app) }}
                          className={`w-8 h-8 rounded-lg mx-auto flex items-center justify-center transition-all ${
                            app.reviewed
                              ? 'bg-[var(--green-l)] text-[var(--green)]'
                              : 'bg-[var(--bg)] text-[var(--muted)] hover:text-[var(--navy)]'
                          }`}
                          title={app.reviewed ? 'Mark as unreviewed' : 'Mark as reviewed'}
                        >
                          {app.reviewed ? <CheckCircle size={18} /> : <Circle size={18} />}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className={`text-[var(--navy)] p-1 rounded-md transition-all ${expandedId === app.id ? 'rotate-180' : ''}`}>
                          <ChevronDown size={18} />
                        </div>
                      </td>
                    </tr>
                    {expandedId === app.id && (
                      <tr className="bg-[var(--bg)]">
                        <td colSpan={6} className="px-6 py-6 border-t border-[var(--border)] overflow-hidden">
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                            <div>
                              <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider mb-1">Institution</p>
                              <p className="text-[13px] text-[var(--text)] font-medium">{app.institution}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider mb-1">Availability</p>
                              <p className="text-[13px] text-[var(--text)] font-medium">{app.availability}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider mb-1">Est. Start Date</p>
                              <p className="text-[13px] text-[var(--text)] font-medium">{app.startDate}</p>
                            </div>
                            {app.orcid && (
                              <div>
                                <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider mb-1">Researcher ID</p>
                                <p className="text-[13px] text-[var(--teal)] font-bold">{app.orcid}</p>
                              </div>
                            )}
                            {app.companyName && (
                              <>
                                <div>
                                  <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider mb-1">Organization</p>
                                  <p className="text-[13px] text-[var(--text)] font-medium">{app.companyName}</p>
                                </div>
                                {app.website && (
                                  <div>
                                    <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider mb-1">Website</p>
                                    <a href={app.website} target="_blank" rel="noopener noreferrer" className="text-[13px] text-[var(--teal)] underline font-medium">{app.website}</a>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                          <div className="bg-white border border-[var(--border)] rounded-xl p-4 shadow-sm">
                            <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider mb-2">Collaboration Pitch</p>
                            <p className="text-[13px] text-[var(--text)] leading-relaxed">{app.pitch}</p>
                          </div>
                          {app.proposal && (
                            <div className="mt-4 bg-[var(--amber-l)] border border-[var(--amber)/20] rounded-xl p-4 shadow-sm">
                              <p className="text-[10px] text-[var(--amber)] font-bold uppercase tracking-wider mb-2">Industry Proposal</p>
                              <p className="text-[13px] text-[var(--text)] leading-relaxed">{app.proposal}</p>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

