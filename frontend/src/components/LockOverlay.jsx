import { Lock, LogIn } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function LockOverlay({ type = 'project' }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center reveal-blur-anim">
      {/* High-density Blur Backdrop */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[12px]" />
      
      <div className="relative z-20 flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-[var(--amber-l)] border border-[var(--amber)] flex items-center justify-center text-[var(--amber)] mb-4 shadow-sm">
          <Lock size={24} strokeWidth={2.5} />
        </div>
        
        <h4 className="text-[15px] font-bold text-[var(--navy)] mb-2">Institutional Access Required</h4>
        <p className="text-[12px] text-[var(--muted)] max-w-[240px] leading-relaxed mb-6">
          This {type} is private to department researchers. Login or register with your institutional ID to view full details.
        </p>
        
        <div className="flex flex-col gap-3 w-full max-w-[200px] mt-4">
          <Link 
            to="/admin/login" 
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--navy)] text-white text-[12px] font-bold rounded-xl hover:shadow-lg transition-all"
            style={{ textDecoration: 'none' }}
          >
            <LogIn size={14} />
            Login to View
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="flex-1 h-[1px] bg-slate-200" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">OR</span>
            <div className="flex-1 h-[1px] bg-slate-200" />
          </div>

          <Link 
            to="/register" 
            className="px-5 py-2.5 bg-white border border-[var(--navy)] text-[var(--navy)] text-[11px] font-bold rounded-xl hover:bg-slate-50 transition-all text-center"
            style={{ textDecoration: 'none' }}
          >
            Create Researcher Account
          </Link>
        </div>
      </div>

      {/* Circle match-score ring placeholder (matching the reference) */}
      <div className="absolute top-6 right-6 opacity-20">
        <div className="w-16 h-16 rounded-full border-[3px] border-[var(--muted)] flex items-center justify-center">
          <Lock size={16} className="text-[var(--muted)]" />
        </div>
      </div>
    </div>
  )
}
