import { useState, useEffect } from 'react'
import { getProjects, createProject, updateProject, deleteProject } from '../../api'
import { Plus, Pencil, Trash2, X, Check, Save, AlertCircle, Eye, EyeOff, Lock, Globe } from 'lucide-react'

const PROJECT_FIELDS = [
  { id: 'title', label: 'Project Title' },
  { id: 'pi', label: 'Principal Investigator' },
  { id: 'domain', label: 'Expertise Domain' },
  { id: 'shortDescription', label: 'Short Abstract' },
  { id: 'skills', label: 'Required Skills' },
  { id: 'clinicalProblem', label: 'Clinical Problem' },
  { id: 'techStack', label: 'Tech Stack' },
  { id: 'perks', label: 'Perks / Benefits' },
  { id: 'timeline', label: 'Duration & Timeline' },
  { id: 'hoursPerWeek', label: 'Time Commitment' }
]

const EMPTY_PROJECT = {
  title: '', 
  type: 'Project', 
  status: 'Ongoing', 
  visibility: 'public',
  visibleFields: ['title', 'pi', 'domain', 'shortDescription', 'skills'],
  domain: '',
  pi: { name: '', email: '' }, 
  lookingFor: '', 
  skills: [],
  shortDescription: '', 
  clinicalProblem: '', 
  techStack: [],
  collaboratorRole: '', 
  perks: [], 
  timeline: '', 
  hoursPerWeek: 10,
  remoteOk: true, 
  deadline: '',
}

const DOMAINS = ['NLP in Healthcare', 'Medical Imaging', 'Predictive Analytics', 'Clinical Decision AI', 'Drug Discovery AI']

export default function ProjectEditor() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ ...EMPTY_PROJECT })
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [skillInput, setSkillInput] = useState('')
  const [techInput, setTechInput] = useState('')
  const [perkInput, setPerkInput] = useState('')

  const fetchProjects = async () => {
    try {
      const data = await getProjects()
      setProjects(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProjects() }, [])

  const openNew = () => {
    setEditing(null)
    setForm({ ...EMPTY_PROJECT, pi: { name: '', email: '' }, skills: [], techStack: [], perks: [], visibleFields: [...EMPTY_PROJECT.visibleFields] })
    setSkillInput(''); setTechInput(''); setPerkInput('')
    setShowForm(true)
  }

  const openEdit = (project) => {
    setEditing(project)
    setForm({ 
      ...project, 
      pi: { ...project.pi },
      visibleFields: project.visibleFields || [...EMPTY_PROJECT.visibleFields] 
    })
    setSkillInput(''); setTechInput(''); setPerkInput('')
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.pi.name.trim()) return
    setSaving(true)
    try {
      if (editing) {
        await updateProject(editing.id, form)
      } else {
        await createProject(form)
      }
      await fetchProjects()
      setShowForm(false)
    } catch (err) {
      console.error(err)
      alert('Failed to save project.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteProject(id)
      setDeleteConfirm(null)
      await fetchProjects()
    } catch (err) {
      console.error(err)
    }
  }

  const addTag = (field, input, setInput) => {
    const val = input.trim()
    if (val && !form[field].includes(val)) {
      setForm(prev => ({ ...prev, [field]: [...prev[field], val] }))
      setInput('')
    }
  }

  const removeTag = (field, tag) => {
    setForm(prev => ({ ...prev, [field]: prev[field].filter(t => t !== tag) }))
  }

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const toggleVisibleField = (fieldId) => {
    setForm(prev => {
      const current = prev.visibleFields || []
      const updated = current.includes(fieldId) 
        ? current.filter(f => f !== fieldId)
        : [...current, fieldId]
      return { ...prev, visibleFields: updated }
    })
  }

  if (loading) return <div className="p-12 text-center text-[var(--muted)]">Loading metrics...</div>

  return (
    <div className="animate-fade-in font-['DM_Sans',sans-serif]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-['Merriweather',serif] text-[var(--navy)] font-bold">Research Project Repository</h2>
          <p className="text-[12px] text-[var(--muted)]">Manage institutional visibility and collaborator discovery settings.</p>
        </div>
        <button onClick={openNew} className="px-5 py-2.5 bg-[var(--navy)] text-white text-[12px] font-bold rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
          <Plus size={16} />
          Create New Project
        </button>
      </div>

      {/* Projects Table */}
      <div className="bg-white border border-[var(--border)] rounded-14 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#f8fafc] border-b border-[var(--border)]">
            <tr>
              <th className="px-6 py-4 text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">Project Identity</th>
              <th className="px-6 py-4 text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">Internal Status</th>
              <th className="px-6 py-4 text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">Visibility</th>
              <th className="px-6 py-4 text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">PI</th>
              <th className="px-6 py-4 text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {projects.map(project => (
              <tr key={project.id} className="hover:bg-[#f9fafb] transition-all">
                <td className="px-6 py-4">
                  <div className="text-[13px] font-bold text-[var(--navy)] truncate max-w-[300px]">{project.title}</div>
                  <div className="text-[11px] text-[var(--muted)]">{project.domain}</div>
                </td>
                <td className="px-6 py-4">
                   <div className="flex flex-col gap-1">
                      <span className={`text-[10px] w-fit px-2 py-0.5 rounded-full font-bold ${
                        project.status === 'Ongoing' ? 'bg-[#E8F5EA] text-[#2D7A3A]' : 
                        project.status === 'Upcoming' ? 'bg-[#FEF3E2] text-[#D4820A]' : 
                        'bg-[#F1F5F9] text-[#475569]'
                      }`}>
                        {project.status}
                      </span>
                   </div>
                </td>
                <td className="px-6 py-4">
                   <span className={`flex items-center gap-1 text-[11px] font-semibold ${project.visibility === 'public' ? 'text-green-600' : 'text-red-500'}`}>
                      {project.visibility === 'public' ? <Globe size={12} /> : <Lock size={12} />}
                      {project.visibility?.toUpperCase()}
                   </span>
                </td>
                <td className="px-6 py-4 text-[12px] text-[var(--text)]">{project.pi?.name || project.pi}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 text-[var(--muted)]">
                    <button onClick={() => openEdit(project)} className="p-2 hover:bg-[var(--bg)] rounded-lg hover:text-[var(--navy)]"><Pencil size={15} /></button>
                    <button onClick={() => setDeleteConfirm(project.id)} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM */}
      {showForm && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0F172AC0] backdrop-blur-md" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-20 shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col animate-scale-in border border-white/20">
            {/* Header */}
            <div className="px-8 py-5 bg-[var(--navy)] flex items-center justify-between shrink-0">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--gold)] flex items-center justify-center font-bold text-[var(--navy)] text-sm">P</div>
                  <div>
                    <h3 className="text-white text-[15px] font-bold">{editing ? 'Edit Project Settings' : 'Initialize New Research Project'}</h3>
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Configuration & Visibility Portal</p>
                  </div>
               </div>
               <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white transition-all"><X size={22} /></button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-8 bg-[var(--bg)] grid grid-cols-[1fr_300px] gap-8">
               <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="bg-white p-6 rounded-14 border border-[var(--border)] shadow-sm space-y-5">
                     <div className="section-head mb-0">Identity & Domain</div>
                     <div className="fi">
                        <label className="text-[11px] font-bold text-[var(--muted)] uppercase mb-2 block">Project Title <span className="text-red-500">*</span></label>
                        <input className="w-full px-4 py-3 bg-[#F8FAFC] border border-[var(--border)] rounded-10 text-[13px] font-medium outline-none focus:border-[var(--navy)] transition-all" value={form.title} onChange={e => updateField('title', e.target.value)} placeholder="e.g. Sepsis prediction using multimodal EHR fusion" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="fi">
                           <label className="text-[11px] font-bold text-[var(--muted)] uppercase mb-2 block">Research Domain</label>
                           <select className="w-full px-4 py-3 bg-[#F8FAFC] border border-[var(--border)] rounded-10 text-[13px] outline-none" value={form.domain} onChange={e => updateField('domain', e.target.value)}>
                              <option>Select Domain</option>
                              {DOMAINS.map(d=><option key={d}>{d}</option>)}
                           </select>
                        </div>
                        <div className="fi">
                           <label className="text-[11px] font-bold text-[var(--muted)] uppercase mb-2 block">Principal Investigator</label>
                           <input className="w-full px-4 py-3 bg-[#F8FAFC] border border-[var(--border)] rounded-10 text-[13px] outline-none" value={form.pi.name} onChange={e => setForm({...form, pi: {...form.pi, name: e.target.value}})} placeholder="Dr. Name" />
                        </div>
                     </div>
                  </div>

                  {/* Submission Status Checklist */}
                  <div className="bg-white p-6 rounded-14 border border-[var(--border)] shadow-sm">
                     <div className="section-head">Current Research Phase</div>
                     <div className="flex gap-1.5 p-1 bg-[#F1F5F9] rounded-10 w-fit">
                        {['Ongoing', 'Upcoming', 'Completed'].map(status => (
                           <button 
                              key={status}
                              onClick={() => updateField('status', status)}
                              className={`px-4 py-2 rounded-8 text-[12px] font-bold transition-all ${form.status === status ? 'bg-white text-[var(--navy)] shadow-sm' : 'text-[#64748B] hover:text-[var(--navy)]'}`}
                           >
                              {status}
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* Details */}
                  <div className="bg-white p-6 rounded-14 border border-[var(--border)] shadow-sm space-y-5">
                     <div className="section-head">Clinical Abstract & Goals</div>
                     <div className="fi">
                        <label className="text-[11px] font-bold text-[var(--muted)] uppercase mb-2 block">The Clinical Problem</label>
                        <textarea className="w-full px-4 py-3 bg-[#F8FAFC] border border-[var(--border)] rounded-10 text-[13px] outline-none min-h-[100px]" value={form.clinicalProblem} onChange={e => updateField('clinicalProblem', e.target.value)} placeholder="Describe the medical challenge being addressed..." />
                     </div>
                     <div className="fi">
                        <label className="text-[11px] font-bold text-[var(--muted)] uppercase mb-2 block">Collaborator Role</label>
                        <textarea className="w-full px-4 py-3 bg-[#F8FAFC] border border-[var(--border)] rounded-10 text-[13px] outline-none min-h-[80px]" value={form.collaboratorRole} onChange={e => updateField('collaboratorRole', e.target.value)} placeholder="What precisely do you need the partner to do?" />
                     </div>
                  </div>
               </div>

               {/* SIDEBAR SETTINGS (Visibility & Field Locks) */}
               <div className="space-y-6">
                  {/* Access Level */}
                  <div className="bg-white p-5 rounded-14 border border-[var(--border)] shadow-sm">
                     <div className="section-head">Access Control</div>
                     <div className="space-y-2 mt-3">
                        <label className={`flex items-center gap-3 p-3 rounded-10 border-2 transition-all cursor-pointer ${form.visibility === 'public' ? 'border-[var(--green)] bg-green-50' : 'border-[#E2E8F0]'}`}>
                           <input type="radio" className="hidden" name="visibility" checked={form.visibility === 'public'} onChange={()=>updateField('visibility', 'public')} />
                           <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.visibility === 'public' ? 'border-[var(--green)] bg-[var(--green)]' : 'border-[#CBD5E1]'}`}>
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                           </div>
                           <div className="flex-1">
                              <div className="text-[12px] font-bold text-[var(--navy)]">Public Discovery</div>
                              <div className="text-[9px] text-[var(--muted)]">Visible to clinical partners outside KMC</div>
                           </div>
                        </label>
                        <label className={`flex items-center gap-3 p-3 rounded-10 border-2 transition-all cursor-pointer ${form.visibility === 'private' ? 'border-red-400 bg-red-50' : 'border-[#E2E8F0]'}`}>
                           <input type="radio" className="hidden" name="visibility" checked={form.visibility === 'private'} onChange={()=>updateField('visibility', 'private')} />
                           <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.visibility === 'private' ? 'border-red-500 bg-red-500' : 'border-[#CBD5E1]'}`}>
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                           </div>
                           <div className="flex-1">
                              <div className="text-[12px] font-bold text-[var(--navy)]">Department Only</div>
                              <div className="text-[9px] text-red-500 font-bold uppercase">Locked / Institutional</div>
                           </div>
                        </label>
                     </div>
                  </div>

                  {/* Field Visibility Checklist */}
                  <div className="bg-white p-5 rounded-14 border border-[var(--border)] shadow-sm">
                     <div className="section-head">Public Field Manifest</div>
                     <p className="text-[9px] text-[var(--muted)] mb-4 font-bold uppercase tracking-wider">Select what public users can see:</p>
                     <div className="space-y-2.5">
                        {PROJECT_FIELDS.map(f => (
                           <label key={f.id} className="flex items-center gap-2.5 cursor-pointer group">
                              <div 
                                 onClick={() => toggleVisibleField(f.id)}
                                 className={`w-4 h-4 rounded flex items-center justify-center transition-all ${form.visibleFields.includes(f.id) ? 'bg-[var(--navy)]' : 'bg-[#E2E8F0] group-hover:bg-[#CBD5E1]'}`}
                              >
                                 {form.visibleFields.includes(f.id) && <Check size={12} strokeWidth={4} className="text-white" />}
                              </div>
                              <span className="text-[11px] font-semibold text-[#475569]">{f.label}</span>
                              {form.visibleFields.includes(f.id) ? <Eye size={12} className="ml-auto text-green-500" /> : <EyeOff size={12} className="ml-auto text-[#CBD5E1]" />}
                           </label>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 bg-white border-t border-[var(--border)] flex justify-between items-center shrink-0">
               <div className="flex items-center gap-2 text-[var(--muted)]">
                  <Info size={14} />
                  <span className="text-[11px] font-medium">Auto-saving as draft...</span>
               </div>
               <div className="flex gap-3">
                  <button onClick={() => setShowForm(false)} className="px-6 py-2.5 text-[var(--navy)] text-[12px] font-bold border border-[var(--border)] rounded-10 hover:bg-[var(--bg)] transition-all">Discard</button>
                  <button 
                     onClick={handleSave}
                     disabled={saving}
                     className="px-8 py-2.5 bg-[var(--navy)] text-white text-[12px] font-bold rounded-10 hover:shadow-xl transition-all flex items-center gap-2"
                  >
                     {saving ? <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                     {editing ? 'Capture Updates' : 'Launch Project'}
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
