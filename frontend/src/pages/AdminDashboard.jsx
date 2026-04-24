import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FolderKanban, Inbox, LogOut, Bell, Search, PlusCircle } from 'lucide-react'
import ProjectEditor from '../components/admin/ProjectEditor.jsx'
import ApplicationsTable from '../components/admin/ApplicationsTable.jsx'
import DashboardHome from '../components/admin/DashboardHome.jsx'

export default function AdminDashboard() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const isOverview = location.pathname === '/admin/dashboard' || location.pathname === '/admin'
  const isProjects = location.pathname.includes('projects')
  const isApps = location.pathname.includes('applications')

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] font-['DM_Sans',sans-serif]">
      {/* FYRC Topbar */}
      <div className="bg-[var(--navy)] px-6 py-3 flex items-center gap-3 sticky top-0 z-100">
        <div className="w-9 h-9 rounded-lg bg-[var(--gold)] flex items-center justify-center font-['Merriweather',serif] text-[var(--navy)] font-bold text-lg flex-shrink-0">
          K
        </div>
        <div>
          <div className="text-[13px] font-medium text-white">KMC · Department of AI in Healthcare</div>
          <div className="text-[10px] text-white/45">FYRC — Find Your Research Collaborator Portal</div>
        </div>

        {/* Search Bar */}
        <div className="ml-auto hidden md:flex items-center bg-white/10 rounded-full px-3 py-1.5 w-72">
          <Search size={14} className="text-white/40" />
          <input 
            type="text" 
            placeholder="Search projects or faculty..." 
            className="bg-transparent border-none text-white text-xs px-2 outline-none w-full placeholder:text-white/30"
          />
        </div>

        <div className="flex items-center gap-4 ml-4 md:ml-0">
          <button className="text-white/60 hover:text-white transition-colors relative">
            <Bell size={18} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-[var(--navy)]" />
          </button>
          
          <div className="flex items-center gap-3 px-3 py-1.5 bg-white/12 rounded-full cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-[var(--gold)] flex items-center justify-center text-[10px] font-bold text-[var(--navy)]">
              TE
            </div>
            <div className="hidden sm:block">
              <div className="text-[11px] font-semibold text-white leading-tight">Tamil Eniyan</div>
              <div className="text-[9px] text-white/40 leading-tight">Administrator</div>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* FYRC Subnav */}
      <div className="bg-[var(--navy)] border-t border-white/5 px-6 flex items-center justify-between">
        <div className="flex">
          <Link
            to="/admin/dashboard"
            className={`px-4 py-3 text-[12px] font-medium transition-all border-b-[2.5px] ${
              isOverview ? 'text-[var(--gold)] border-[var(--gold)]' : 'text-white/45 border-transparent hover:text-white/75'
            }`}
          >
            Overview
          </Link>
          <Link
            to="/admin/users"
            className={`px-4 py-3 text-[12px] font-medium transition-all border-b-[2.5px] ${
              location.pathname.includes('users') ? 'text-[var(--gold)] border-[var(--gold)]' : 'text-white/45 border-transparent hover:text-white/75'
            }`}
          >
            Faculty Accounts <span className="ml-1 px-1.5 py-0.5 bg-red-600 text-white text-[9px] font-bold rounded-full">2</span>
          </Link>
          <Link
            to="/admin/projects"
            className={`px-4 py-3 text-[12px] font-medium transition-all border-b-[2.5px] ${
              isProjects ? 'text-[var(--gold)] border-[var(--gold)]' : 'text-white/45 border-transparent hover:text-white/75'
            }`}
          >
            Manage Projects
          </Link>
          <Link
            to="/admin/submissions"
            className={`px-4 py-3 text-[12px] font-medium transition-all border-b-[2.5px] ${
              location.pathname.includes('submissions') ? 'text-[var(--gold)] border-[var(--gold)]' : 'text-white/45 border-transparent hover:text-white/75'
            }`}
          >
            Submissions <span className="ml-1 px-1.5 py-0.5 bg-red-600 text-white text-[9px] font-bold rounded-full">5</span>
          </Link>
        </div>

        <button 
          onClick={() => navigate('/admin/projects')}
          className="bg-[var(--teal)] hover:bg-[#155f55] text-white px-4 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-2 transition-all"
        >
          <PlusCircle size={14} />
          Create New Project
        </button>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-6 overflow-auto">
        <Routes>
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="projects" element={<ProjectEditor />} />
          <Route path="submissions" element={<DashboardHome view="submissions" />} />
          <Route path="users" element={<DashboardHome view="users" />} />
          <Route path="applications" element={<ApplicationsTable />} />
          <Route path="*" element={<DashboardHome />} />
        </Routes>
      </div>
    </div>
  )
}
