import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api'
import { Lock, Mail, Loader2, ArrowRight, Apple, X } from 'lucide-react'
import illustration from '../assets/auth-flat.png'

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
    <div className="min-h-screen relative flex flex-col font-['DM_Sans',sans-serif] bg-white overflow-hidden">
      {/* BACKGROUND SPLIT */}
      <div className="absolute top-0 left-0 w-full h-[45vh] bg-[#1B3A5C]" />
      
      <div className="relative z-10 w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row min-h-screen px-6 lg:px-20 py-10 lg:py-0">
        
        {/* LEFT SECTION */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center pt-10 lg:pt-0">
          <div className="mb-8">
             <div className="text-white font-bold text-2xl tracking-tight">FYRC</div>
          </div>
          
          <div className="max-w-md">
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Sign in to
            </h1>
            <h2 className="text-2xl lg:text-3xl font-medium text-white/90 mb-6">
              Institutional Admin Portal
            </h2>
            <p className="text-white/60 text-sm lg:text-base leading-relaxed mb-12 max-w-sm">
              Manage research projects, moderate collaborations, and oversee the FYRC ecosystem for MAHE.
            </p>
            
            <div className="relative mb-12 hidden lg:block">
               <img 
                 src={illustration} 
                 alt="Research Illustration" 
                 className="w-[450px] object-contain drop-shadow-2xl"
               />
            </div>
            
            {/* LOGIN AS SECTION */}
            <div className="mt-auto">
              <h3 className="text-slate-500 font-bold text-sm mb-4">Login as</h3>
              <div className="flex gap-4">
                {/* Faculty Card */}
                <div 
                  onClick={() => navigate('/login')}
                  className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3 w-44 relative group cursor-pointer hover:bg-white hover:shadow-md transition-all"
                >
                  <div className="absolute top-2 right-2 text-slate-300 group-hover:text-slate-400">
                    <X size={14} />
                  </div>
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 shrink-0">
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="John" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">John peter</div>
                    <div className="text-[10px] text-slate-400">Active 1 days ago</div>
                  </div>
                </div>
                
                {/* Admin Card - Highlighted */}
                <div className="bg-white p-4 rounded-2xl border-2 border-[#22C55E] shadow-lg flex items-center gap-3 w-44 relative shrink-0">
                  <div className="absolute top-2 right-2 text-[#22C55E]">
                    <X size={14} />
                  </div>
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 shrink-0 border-2 border-[#22C55E]/20">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Alina" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Alina shmen</div>
                    <div className="text-[10px] text-[#22C55E] font-medium">Currently Admin</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* RIGHT SECTION - FORM CARD */}
        <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end py-10 lg:py-0">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl p-8 lg:p-14 relative z-20 border border-slate-50">
            
            <div className="flex justify-between items-start mb-8">
               <div>
                 <div className="text-slate-400 text-sm font-medium mb-1">Welcome to <span className="text-[#1B3A5C] font-bold">FYRC Admin</span></div>
                 <h2 className="text-4xl font-bold text-slate-900">Sign in</h2>
               </div>
            </div>
            
            {/* SOCIAL LOGINS */}
            <div className="flex gap-4 mb-10">
               <button className="flex-1 flex items-center justify-center gap-3 py-3 px-4 bg-blue-50/50 hover:bg-blue-50 border border-blue-100/50 rounded-xl transition-all group">
                 <div className="w-5 h-5 bg-white rounded flex items-center justify-center shadow-sm">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-3.5 h-3.5" alt="G" />
                 </div>
                 <span className="text-xs font-semibold text-blue-600">Admin Google SSO</span>
               </button>
               <button className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-xl transition-all">
                 <Apple size={20} className="text-black" fill="black" />
               </button>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-500 font-bold flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1">Admin Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-[#22C55E] focus:ring-4 focus:ring-[#22C55E]/5 transition-all text-sm font-medium"
                  placeholder="admin@manipal.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1">Secure Password</label>
                <input 
                  type="password" 
                  className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-[#22C55E] focus:ring-4 focus:ring-[#22C55E]/5 transition-all text-sm font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 bg-[#1B3A5C] text-white rounded-2xl font-bold text-base shadow-xl shadow-blue-900/20 hover:bg-[#152e4a] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 mt-4"
              >
                {loading ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <>
                    Connect to Dashboard
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-12 text-center">
              <Link to="/login" className="text-xs font-bold text-[#22C55E] hover:underline flex items-center justify-center gap-2">
                <ArrowRight size={14} className="rotate-180" />
                Back to Faculty Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
