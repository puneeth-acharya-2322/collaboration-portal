import { useState } from 'react'
import { submitApplication } from '../api'
import { User, Mail, Building, Briefcase, Calendar, MessageSquare, CheckCircle, Loader2, Link2, Info, ArrowRight } from 'lucide-react'

const ROLES = [
  'PhD Student', 'Master\'s Student', 'Developer', 'Independent Researcher',
  'Faculty', 'Industry Partner', 'NGO', 'Other'
]

const AVAILABILITY = ['5 hrs/week', '10 hrs/week', '15+ hrs/week', 'Full-time']

export default function CollabForm({ projectId, projectTitle, onSuccess, roleTab = 'individual' }) {
  const [form, setForm] = useState({
    name: '', institution: '', email: '', role: '', orcid: '',
    availability: '', startDate: '', pitch: '',
    companyName: '', website: '', proposal: '', mouInterest: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const isIndustry = roleTab === 'industry'

  const onChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Full name is required.'
    if (!form.institution.trim()) errs.institution = 'Institution is required.'
    if (!form.email.trim()) errs.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Please enter a valid email.'
    if (!form.role) errs.role = 'Please select your role.'
    if (!form.availability) errs.availability = 'Please select your availability.'
    if (!form.startDate) errs.startDate = 'Please select a start date.'
    if (!form.pitch.trim()) errs.pitch = 'Your pitch is required.'
    else if (form.pitch.length > 500) errs.pitch = 'Pitch must be under 500 characters.'

    if (isIndustry) {
      if (!form.companyName.trim()) errs.companyName = 'Company name is required.'
      if (!form.proposal.trim()) errs.proposal = 'Brief proposal is required.'
      else if (form.proposal.length > 800) errs.proposal = 'Proposal must be under 800 characters.'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setSubmitError(null)

    try {
      await submitApplication({
        ...form,
        roleTab,
        projectId: projectId || null,
        projectTitle: projectTitle || null,
      })
      setSubmitted(true)
      if (onSuccess) setTimeout(onSuccess, 3000)
    } catch (err) {
      setSubmitError(err.errors ? err.errors.join(' ') : err.error || 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-[var(--teal-l)] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[var(--teal)]/10">
          <CheckCircle size={40} className="text-[var(--teal)]" />
        </div>
        <h3 className="text-2xl font-bold font-['Merriweather',serif] text-[var(--navy)] mb-2">Collaboration Brief Sent!</h3>
        <p className="text-[14px] text-[var(--muted)] max-w-sm mx-auto font-medium">
          Thank you for your interest. The Research Lead will review your brief and reach out to you within 5 working days.
        </p>
        <div className="mt-8 pt-8 border-t border-[var(--border)]">
          <p className="text-[11px] text-[var(--muted)] font-bold uppercase tracking-widest">Bridging AI & Clinical Excellence</p>
        </div>
      </div>
    )
  }

  const Field = ({ label, icon: Icon, error, children, required }) => (
    <div className="fi">
      <label className="block text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          {Icon && <Icon size={12} className="text-[var(--gold)]" />}
          {label} {required && <span className="text-[var(--red)]">*</span>}
        </span>
        {error && <span className="text-[var(--red)] lowercase font-bold tracking-tight normal-case">! {error}</span>}
      </label>
      <div className="relative">
        {children}
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {submitError && (
        <div className="p-4 bg-[var(--red-l)] border border-[var(--red)]/20 rounded-2xl text-[12px] text-[var(--red)] font-bold flex items-center gap-2 mb-6">
          <Info size={16} />
          {submitError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field label="Full Name" icon={User} error={errors.name} required>
          <input 
            type="text" 
            className={`w-full px-4 py-2.5 bg-white border ${errors.name ? 'border-[var(--red)]' : 'border-[var(--border)]'} rounded-xl text-[13px] font-medium outline-none focus:border-[var(--navy)] focus:ring-4 focus:ring-[var(--navy)]/5 transition-all`} 
            value={form.name} 
            onChange={e => onChange('name', e.target.value)} 
            placeholder="Dr. John Doe" 
          />
        </Field>

        <Field label="Contact Email" icon={Mail} error={errors.email} required>
          <input 
            type="email" 
            className={`w-full px-4 py-2.5 bg-white border ${errors.email ? 'border-[var(--red)]' : 'border-[var(--border)]'} rounded-xl text-[13px] font-medium outline-none focus:border-[var(--navy)] focus:ring-4 focus:ring-[var(--navy)]/5 transition-all`} 
            value={form.email} 
            onChange={e => onChange('email', e.target.value)} 
            placeholder="john@manipal.edu" 
          />
        </Field>
      </div>

      <Field label="Institution / Organisation" icon={Building} error={errors.institution} required>
        <input 
          type="text" 
          className={`w-full px-4 py-2.5 bg-white border ${errors.institution ? 'border-[var(--red)]' : 'border-[var(--border)]'} rounded-xl text-[13px] font-medium outline-none focus:border-[var(--navy)] focus:ring-4 focus:ring-[var(--navy)]/5 transition-all`} 
          value={form.institution} 
          onChange={e => onChange('institution', e.target.value)} 
          placeholder="e.g. KMC Manipal" 
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field label="Your Current Role" icon={Briefcase} error={errors.role} required>
          <select 
            className={`w-full px-4 py-2.5 bg-white border ${errors.role ? 'border-[var(--red)]' : 'border-[var(--border)]'} rounded-xl text-[13px] font-bold text-[var(--navy)] outline-none focus:border-[var(--navy)] transition-all cursor-pointer`} 
            value={form.role} 
            onChange={e => onChange('role', e.target.value)}
          >
            <option value="">Select your role</option>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>

        <Field label="ORCID / Research ID" icon={Link2}>
          <input 
            type="text" 
            className="w-full px-4 py-2.5 bg-white border border-[var(--border)] rounded-xl text-[13px] font-medium outline-none focus:border-[var(--navy)] transition-all" 
            value={form.orcid} 
            onChange={e => onChange('orcid', e.target.value)} 
            placeholder="0000-0002-XXXX-XXXX" 
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field label="Time Commitment" icon={Clock} error={errors.availability} required>
          <select 
            className={`w-full px-4 py-2.5 bg-white border ${errors.availability ? 'border-[var(--red)]' : 'border-[var(--border)]'} rounded-xl text-[13px] font-bold text-[var(--navy)] outline-none focus:border-[var(--navy)] transition-all cursor-pointer`} 
            value={form.availability} 
            onChange={e => onChange('availability', e.target.value)}
          >
            <option value="">Select availability</option>
            {AVAILABILITY.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </Field>

        <Field label="Preferred Start" icon={Calendar} error={errors.startDate} required>
          <input 
            type="month" 
            className={`w-full px-4 py-2.5 bg-white border ${errors.startDate ? 'border-[var(--red)]' : 'border-[var(--border)]'} rounded-xl text-[13px] font-bold text-[var(--navy)] outline-none focus:border-[var(--navy)] transition-all`} 
            value={form.startDate} 
            onChange={e => onChange('startDate', e.target.value)} 
          />
        </Field>
      </div>

      <Field label="Collaboration Pitch" icon={MessageSquare} error={errors.pitch} required>
        <textarea
          className={`w-full px-4 py-3 bg-white border ${errors.pitch ? 'border-[var(--red)]' : 'border-[var(--border)]'} rounded-2xl text-[13.5px] font-medium outline-none focus:border-[var(--navy)] focus:ring-4 focus:ring-[var(--navy)]/5 transition-all min-h-[140px] resize-none`}
          value={form.pitch}
          onChange={e => onChange('pitch', e.target.value)}
          maxLength={500}
          placeholder="Tell us: why this project, what clinical or AI expertise you bring, and your relevant experience."
        />
        <div className="absolute right-4 bottom-3 text-[10px] font-bold text-[var(--muted)] bg-white px-1.5 py-0.5 rounded-md border border-[var(--border)]">
          {form.pitch.length}/500
        </div>
      </Field>

      {/* Industry-only fields */}
      {isIndustry && (
        <div className="bg-[var(--bg)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1 h-3 bg-[var(--gold)] rounded-full" />
            <p className="text-[11px] font-bold text-[var(--navy)] uppercase tracking-widest">Partner Organisation Context</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field label="Organisation Name" error={errors.companyName} required>
              <input type="text" className="w-full px-4 py-2.5 bg-white border border-[var(--border)] rounded-xl text-[13px] font-medium" value={form.companyName} onChange={e => onChange('companyName', e.target.value)} placeholder="Organisation Name" />
            </Field>
            <Field label="Website URL">
              <input type="url" className="w-full px-4 py-2.5 bg-white border border-[var(--border)] rounded-xl text-[13px] font-medium" value={form.website} onChange={e => onChange('website', e.target.value)} placeholder="https://..." />
            </Field>
          </div>

          <Field label="Initial Partnership Proposal" error={errors.proposal} required>
            <textarea
              className="w-full px-4 py-3 bg-white border border-[var(--border)] rounded-2xl text-[13px] font-medium min-h-[100px] resize-none"
              value={form.proposal}
              onChange={e => onChange('proposal', e.target.value)}
              maxLength={800}
              placeholder="Describe the nature of partnership or resources you'd like to bring in."
            />
            <div className="text-right mt-1 text-[10px] text-[var(--muted)] font-bold">{form.proposal.length}/800</div>
          </Field>

          <div>
            <label className="block text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider mb-3">Institutional MOU Interest</label>
            <div className="flex gap-6">
              {['Yes', 'No'].map(opt => (
                <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${form.mouInterest === opt ? 'border-[var(--navy)] bg-[var(--navy)] shadow-lg shadow-[var(--navy)]/20' : 'border-[var(--border)] group-hover:border-[var(--muted)]'}`}>
                    {form.mouInterest === opt && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />}
                  </div>
                  <input type="radio" name="mou" value={opt} checked={form.mouInterest === opt} onChange={e => onChange('mouInterest', e.target.value)} className="hidden" />
                  <span className="text-[13px] font-bold text-[var(--navy)]">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="pt-4">
        <button 
          type="submit" 
          disabled={submitting} 
          className="w-full bg-[var(--navy)] text-white py-4 rounded-2xl font-bold text-[15px] hover:bg-[#152e4a] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[var(--navy)]/20 active:scale-[0.98]"
        >
          {submitting ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>
              Submit Application
              <ArrowRight size={18} />
            </>
          )}
        </button>
        <p className="text-center text-[11px] text-[var(--muted)] font-medium mt-4 italic">By submitting, you agree to share your profile with the Principal Investigator.</p>
      </div>
    </form>
  )
}
