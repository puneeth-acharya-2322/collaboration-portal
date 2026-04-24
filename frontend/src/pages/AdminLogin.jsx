import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api'
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login(email, password)
      localStorage.setItem('admin_token', data.token)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.error || 'Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4 font-['DM_Sans',sans-serif]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-[var(--gold)] flex items-center justify-center font-['Merriweather',serif] text-[var(--navy)] font-bold text-3xl mx-auto shadow-lg mb-4">
            K
          </div>
          <h1 className="text-2xl font-bold font-['Merriweather',serif] text-[var(--navy)]">FYRC Admin Portal</h1>
          <p className="text-[12px] text-[var(--muted)] mt-1 font-medium italic">Find Your Research Collaborator · MAHE</p>
        </div>

        <div className="bg-white border border-[var(--border)] rounded-2xl p-8 shadow-sm animate-fade-in">
          {error && (
            <div className="mb-6 p-3 bg-[var(--red-l)] border border-[var(--red)/20] rounded-xl text-[12px] text-[var(--red)] font-bold flex items-center gap-2">
              <span className="w-1 h-1 bg-[var(--red)] rounded-full" />
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="fi">
              <label className="block text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider mb-1">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  className="w-full pl-10 pr-4 py-2.5 text-[13px] border border-[var(--border)] rounded-xl outline-none focus:border-[var(--navy)] focus:ring-4 focus:ring-[var(--navy)]/5 transition-all text-[var(--text)]" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="admin@manipal.edu" 
                  required 
                />
                <Mail size={16} className="absolute left-3.5 top-3 text-[var(--muted)]" />
              </div>
            </div>
            <div className="fi">
              <label className="block text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider mb-1">Secure Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  className="w-full pl-10 pr-4 py-2.5 text-[13px] border border-[var(--border)] rounded-xl outline-none focus:border-[var(--navy)] focus:ring-4 focus:ring-[var(--navy)]/5 transition-all text-[var(--text)]" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  required 
                />
                <Lock size={16} className="absolute left-3.5 top-3 text-[var(--muted)]" />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-[var(--navy)] text-white text-[13px] font-bold rounded-xl hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 group border border-[var(--navy)]"
              style={{ width: '100%', display: 'flex' }}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Connect to Dashboard
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
        <div className="text-center mt-8 text-[11px] text-[var(--muted)] font-medium">
          <p>© 2026 Manipal Academy of Higher Education</p>
          <p className="mt-1">KMC · Department of AI in Healthcare</p>
        </div>
      </div>
    </div>
  )
}
