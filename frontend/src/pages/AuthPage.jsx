import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { Mail, Lock, User, ArrowRight, Loader2, Apple, X } from 'lucide-react'
import logo from '../assets/logo.jpeg'
import illustration from '../assets/auth-flat.png'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const navigate = useNavigate()
  const { setRole, setUser } = useUser()

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    // Simulate auth for demo
    setTimeout(() => {
      if (email && password) {
        setRole('user')
        setUser({
          name: name || 'Dr. Researcher',
          initials: name ? name.split(' ').map(n => n[0]).join('') : 'DR',
          id: 'FYRC-2401-92'
        })
        navigate('/research')
      } else {
        setError('Please fill in all fields.')
      }
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen relative flex flex-col font-['DM_Sans',sans-serif] bg-white overflow-hidden">
      {/* BACKGROUND SPLIT */}
      <div className="absolute top-0 left-0 w-full h-[48vh] bg-[#1B3A5C]" />
      
      <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen px-6 lg:px-16">
        
        {/* LEFT SECTION */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 lg:py-0">
          <div className="mb-12">
             <div className="text-white font-bold text-2xl tracking-tight flex items-center gap-2">
               <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                 <img src={logo} alt="L" className="w-5 h-5 object-contain" />
               </div>
               FYRC
             </div>
          </div>
          
          <div className="max-w-md">
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
              Sign in to
            </h1>
            <h2 className="text-2xl lg:text-3xl font-medium text-white/90 mb-8">
              KMC Research Discovery
            </h2>
            <p className="text-white/50 text-sm lg:text-base leading-relaxed mb-12 max-w-sm">
              Discover collaborative opportunities, manage your research portfolio, and connect with domain experts across MAHE.
            </p>
            
            {/* ILLUSTRATION */}
            <div className="relative mb-16 hidden lg:flex items-center justify-center animate-float" style={{ minHeight: '400px' }}>
               <div className="absolute inset-0 bg-[var(--dash-green)] opacity-10 blur-[100px] rounded-full" />
               <img 
                 src={illustration} 
                 alt="Research" 
                 className="max-w-full max-h-[450px] relative z-10 object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.2)]"
                 style={{ width: 'auto', height: 'auto' }}
               />
            </div>
            
            {/* LOGIN AS SECTION */}
            <div className="mt-auto">
              <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6">Login as</h3>
              <div className="flex flex-wrap gap-5">
                {/* Faculty Card */}
                <div 
                  onClick={() => { setEmail('researcher@kmc.edu'); setPassword('password123'); }}
                  className="bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/10 flex items-center gap-4 w-52 relative group cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all shadow-xl"
                >
                  <div className="absolute top-3 right-3 text-white/20 group-hover:text-white/40">
                    <X size={14} />
                  </div>
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-800 shrink-0 border border-white/10">
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="John" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-white">John peter</div>
                    <div className="text-[10px] text-white/40">Faculty · 1d ago</div>
                  </div>
                </div>
                
                {/* Admin Card */}
                <div 
                  onClick={() => navigate('/admin/login')}
                  className="bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/10 flex items-center gap-4 w-52 relative group cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all shadow-xl"
                >
                  <div className="absolute top-3 right-3 text-white/20 group-hover:text-white/40">
                    <X size={14} />
                  </div>
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-800 shrink-0 border border-white/10">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Alina" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-white">Alina shmen</div>
                    <div className="text-[10px] text-white/40">Admin · 4d ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* RIGHT SECTION - FORM CARD */}
        <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end py-12 lg:py-0">
          <div className="bg-white w-full max-w-lg rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] p-10 lg:p-16 relative z-20 animate-fade-in">
            
            <div className="flex justify-between items-start mb-10">
               <div>
                 <div className="text-slate-400 text-sm font-medium mb-1">Welcome to <span className="text-[#1B3A5C] font-bold">FYRC</span></div>
                 <h2 className="text-5xl font-bold text-slate-900 tracking-tight">Sign in</h2>
               </div>
               <div className="text-right">
                 <div className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">No Account?</div>
                 <button 
                   onClick={() => setIsLogin(!isLogin)}
                   className="text-[#22C55E] text-sm font-bold hover:underline transition-all"
                 >
                   {isLogin ? 'Sign up' : 'Sign in'}
                 </button>
               </div>
            </div>
            
            {/* SOCIAL LOGINS */}
            <div className="flex gap-4 mb-12">
               <button className="flex-1 flex items-center justify-center gap-3 py-4 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-2xl transition-all group">
                 <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-50">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="G" />
                 </div>
                 <span className="text-[13px] font-bold text-slate-600">Google Login</span>
               </button>
               <button className="w-14 h-14 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all border border-slate-100">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" className="w-6 h-6" alt="F" />
               </button>
               <button className="w-14 h-14 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all border border-slate-100">
                 <Apple size={22} className="text-black" fill="black" />
               </button>
            </div>
            
            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-[13px] text-red-500 font-bold flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                {error}
              </div>
            )}
            
            <form onSubmit={handleAuth} className="space-y-8">
              {!isLogin && (
                <div className="space-y-3">
                  <label className="text-[13px] font-bold text-slate-800 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#22C55E] focus:bg-white focus:ring-4 focus:ring-[#22C55E]/5 transition-all text-sm font-medium placeholder:text-slate-300"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="space-y-3">
                <label className="text-[13px] font-bold text-slate-800 ml-1">Username or email address</label>
                <input 
                  type="email" 
                  className="w-full px-6 py-4.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#22C55E] focus:bg-white focus:ring-4 focus:ring-[#22C55E]/5 transition-all text-sm font-medium placeholder:text-slate-300"
                  placeholder="Username or email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-[13px] font-bold text-slate-800 ml-1">Enter your Password</label>
                <input 
                  type="password" 
                  className="w-full px-6 py-4.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#22C55E] focus:bg-white focus:ring-4 focus:ring-[#22C55E]/5 transition-all text-sm font-medium placeholder:text-slate-300"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <div className="text-right">
                  <button type="button" className="text-[11px] font-bold text-slate-400 hover:text-blue-500 transition-all uppercase tracking-wider">Forgot Password?</button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 bg-[#22C55E] text-white rounded-2xl font-bold text-lg shadow-2xl shadow-green-500/20 hover:bg-[#1fb354] hover:shadow-green-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 mt-6"
              >
                {loading ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Sign in' : 'Create Account'}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
