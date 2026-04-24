import React, { useState, useEffect } from 'react'
import { getProjects, apiCall } from '../../api'
import { FileText, Users, Inbox, Clock, CheckCircle, XCircle, TrendingUp, AlertCircle, Eye, Check, X, ArrowRight, Info } from 'lucide-react'

export default function DashboardHome({ view = 'overview' }) {
  const [projects, setProjects] = useState([])
  const [pendingUsers, setPendingUsers] = useState([])
  const [pendingProjects, setPendingProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [comparison, setComparison] = useState(null)

  const fetchData = async () => {
    try {
      const all = await getProjects()
      const users = await apiCall('/api/admin/pending-users')
      const pends = await apiCall('/api/admin/pending-projects')
      setProjects(all)
      setPendingUsers(users)
      setPendingProjects(pends)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleAction = async (type, id, status) => {
    try {
      const endpoint = type === 'user' ? `/api/admin/approve-user/${id}` : `/api/admin/approve-project/${id}`
      await apiCall(endpoint, 'POST', { status })
      await fetchData()
      setComparison(null)
    } catch (err) {
      alert('Action failed')
    }
  }

  if (loading) return <div className="p-12 text-center text-[var(--muted)] font-['DM_Sans',sans-serif]">Loading dashboard metrics...</div>

  const stats = [
    { label: 'Live Projects', val: projects.filter(p => p.approvalStatus === 'approved').length, delta: 'Total active', color: 'var(--navy)' },
    { label: 'Pending Projects', val: pendingProjects.length, delta: 'Needs review', color: 'var(--amber)', alert: pendingProjects.length > 0 },
    { label: 'Pending Faculty', val: pendingUsers.length, delta: 'Needs approval', color: 'var(--teal)', alert: pendingUsers.length > 0 },
    { label: 'Total Discovery', val: projects.length, delta: 'Matches & seekers', color: 'var(--green)' }
  ]

  return (
    <div className="animate-fade-in font-['DM_Sans',sans-serif]">
      {/* ── HIGH DENSITY STATS GRID ── */}
      {(view === 'overview' || view === 'stats') && (
        <div className="admin-stats">
          {stats.map(s => (
            <div key={s.label} className="admin-stat relative overflow-hidden group hover:shadow-lg transition-all border-[#DDE3EA]">
              <div className="as-val" style={{ color: s.color }}>{s.val}</div>
              <div className="as-label">{s.label}</div>
              <div className={`as-delta ${s.alert ? 'text-[var(--amber)]' : 'text-green-600'} flex items-center gap-1 font-bold`}>
                 {s.alert ? <AlertCircle size={10} /> : <TrendingUp size={10} />}
                 {s.delta}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── PENDING MODIFICATIONS ── */}
      {(view === 'overview' || view === 'submissions') && (
        <div className="mt-8">
          <div className="section-head mb-4">Pending Project Submissions</div>
          <div className="admin-table">
            <div className="at-head grid grid-cols-[2fr_1.2fr_1fr_1fr_180px] gap-4 px-6 py-3">
               <span>Project Title</span>
               <span>Submitter</span>
               <span>Request Type</span>
               <span>Timeline</span>
               <span>Actions</span>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {pendingProjects.length === 0 && <div className="p-12 text-center text-slate-400 text-xs">No pending submissions found.</div>}
              {pendingProjects.map((proj) => (
                <div key={proj.id} className="at-row grid grid-cols-[2fr_1.2fr_1fr_1fr_180px] gap-4 px-6 items-center">
                  <div>
                    <div className="text-[13px] font-bold text-[var(--navy)]">{proj.title}</div>
                    <div className="text-[11px] text-[var(--muted)]">{proj.domain}</div>
                  </div>
                  <div className="text-[12px] font-medium">{proj.submitter?.name || 'Researcher'}</div>
                  <div>
                     <span className={`status-pill ${proj.approvalStatus === 'pending_delete' ? 'sp-rejected' : 'sp-pending'}`}>
                        {proj.approvalStatus?.replace('_', ' ').toUpperCase()}
                     </span>
                  </div>
                  <div className="text-[11px] text-[var(--muted)] flex items-center gap-1"><Clock size={10} /> {new Date(proj.createdAt || Date.now()).toLocaleDateString()}</div>
                  <div className="flex gap-2">
                     <button 
                        onClick={() => setComparison(proj)}
                        className="p-1.5 rounded-lg bg-[#f0f3f7] text-[var(--navy)] hover:bg-[#e2e8f0] transition-all" 
                        title="Review Comparison"
                      >
                        <Eye size={14} />
                      </button>
                     <button onClick={() => handleAction('project', proj.id, 'approved')} className="p-1.5 rounded-lg bg-[#E8F5EA] text-[#2D7A3A] hover:bg-[#D7EFDC] transition-all" title="Approve"><Check size={14} /></button>
                     <button onClick={() => handleAction('project', proj.id, 'rejected')} className="p-1.5 rounded-lg bg-[#FEF2F2] text-[#B91C1C] hover:bg-[#FEE2E2] transition-all" title="Reject"><X size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── FACULTY PENDING ── */}
      {(view === 'overview' || view === 'users') && (
        <div className="mt-8">
          <div className="section-head mb-4">Pending Faculty Registrations</div>
          <div className="admin-table">
            <div className="at-head grid grid-cols-[1.8fr_1.2fr_1fr_100px] gap-4 px-6 py-3">
               <span>Faculty Member</span>
               <span>Department</span>
               <span>Contact</span>
               <span>Actions</span>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {pendingUsers.length === 0 && <div className="p-12 text-center text-slate-400 text-xs">No pending account requests.</div>}
              {pendingUsers.map((user) => (
                <div key={user.id} className="at-row grid grid-cols-[1.8fr_1.2fr_1fr_100px] gap-4 px-6 items-center">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--navy)] text-white flex items-center justify-center font-bold text-[11px] border-2 border-white shadow-sm">{user.name?.[0]}</div>
                      <div>
                         <div className="text-[12px] font-bold">{user.name}</div>
                         <div className="text-[10px] text-[var(--muted)]">Researcher Access</div>
                      </div>
                   </div>
                   <div className="text-[12px] font-medium">{user.department || 'Not Specified'}</div>
                   <div className="text-[11px] text-[var(--muted)]">{user.email}</div>
                   <div className="flex gap-2">
                      <button onClick={() => handleAction('user', user.id, 'approved')} className="p-1.5 rounded-lg bg-[#E8F5EA] text-[#2D7A3A] hover:bg-[#D7EFDC] transition-all"><Check size={14} /></button>
                      <button onClick={() => handleAction('user', user.id, 'rejected')} className="p-1.5 rounded-lg bg-[#FEF2F2] text-[#B91C1C] hover:bg-[#FEE2E2] transition-all"><X size={14} /></button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── COMPARISON MODAL ── */}
      {comparison && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setComparison(null)} />
           <div className="relative bg-white w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
              <div className="px-6 py-4 bg-[var(--navy)] text-white flex justify-between items-center">
                 <div>
                    <h3 className="text-[15px] font-bold">Review Modification Request</h3>
                    <p className="text-[11px] text-white/50">Comparing current live data vs requested submission</p>
                 </div>
                 <button onClick={() => setComparison(null)}><X size={20} /></button>
              </div>

              <div className="p-8 grid grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto bg-slate-50">
                 {/* Live Version */}
                 <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Current Live Record</div>
                    <ProjectDetailView project={comparison} />
                 </div>

                 {/* Proposed Version */}
                 <div>
                    <div className="text-[11px] font-bold text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <TrendingUp size={14} /> Proposed Changes
                    </div>
                    <ProjectDetailView 
                      project={comparison.pendingChanges || comparison} 
                      isDiff={!!comparison.pendingChanges} 
                    />
                 </div>
              </div>

              <div className="px-6 py-4 bg-white border-t border-slate-200 flex justify-end gap-3">
                 <button onClick={() => setComparison(null)} className="px-6 py-2 text-slate-500 text-xs font-bold">Cancel</button>
                 <button onClick={() => handleAction('project', comparison.id, 'rejected')} className="px-6 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold">Reject Change</button>
                 <button onClick={() => handleAction('project', comparison.id, 'approved')} className="px-6 py-2 bg-[var(--navy)] text-white rounded-lg text-xs font-bold shadow-lg shadow-navy/20">Apply & Publish</button>
              </div>
           </div>
        </div>
      )}
    </div>
  )
}

function ProjectDetailView({ project, isDiff }) {
  return (
    <div className={`p-6 rounded-xl border-2 ${isDiff ? 'border-amber-100 bg-white' : 'border-slate-200 bg-slate-100/50'}`}>
       <div className="text-[16px] font-bold text-[var(--navy)] mb-1">{project.title}</div>
       <div className="text-[12px] text-slate-500 mb-6">{project.domain}</div>

       <div className="space-y-4">
          <div className="detail-item">
             <div className="text-[10px] font-bold text-slate-400 uppercase">Principal Investigator</div>
             <div className="text-[13px] text-slate-700 font-medium">{project.pi?.name || project.pi}</div>
          </div>
          <div className="detail-item">
             <div className="text-[10px] font-bold text-slate-400 uppercase">Short Abstract</div>
             <div className="text-[12px] text-slate-600 leading-relaxed">{project.shortDescription || 'No abstract provided.'}</div>
          </div>
          <div className="detail-item">
             <div className="text-[10px] font-bold text-slate-400 uppercase">Required Expertise</div>
             <div className="flex flex-wrap gap-2 mt-1">
                {(project.skills || []).map(s => <span key={s} className="px-2 py-0.5 bg-slate-200 rounded text-[10px] font-bold">{s}</span>)}
             </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
             <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Visibility</div>
                <div className="text-[11px] font-bold">{project.visibility?.toUpperCase()}</div>
             </div>
             <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Status</div>
                <div className="text-[11px] font-bold">{project.status}</div>
             </div>
          </div>
       </div>
    </div>
  )
}
