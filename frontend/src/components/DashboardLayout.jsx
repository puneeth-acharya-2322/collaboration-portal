import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Search, 
  Bell, 
  MessageSquare, 
  Clock, 
  Briefcase, 
  Layout, 
  Calendar 
} from 'lucide-react'
import { useUser } from '../context/UserContext.jsx'
import logo from '../assets/logo.jpeg'

export default function DashboardLayout({ children, searchValue, onSearchChange }) {
  const location = useLocation()
  const { role } = useUser()
  
  return (
    <div className="dash-container">
      {/* SIDEBAR */}
      <aside className="dash-sidebar">
        <div className="dash-sidebar-header">
          <div className="dash-logo">
            <img src={logo} alt="KMC Logo" />
          </div>
          <span className="dash-brand-name">KMC Collaboration</span>
        </div>

        <nav className="dash-menu">
          <div className="dash-menu-label">Discovery Portal</div>
          <Link to="/research" className={`dash-menu-item ${(location.pathname === '/research' || location.pathname === '/') ? 'active' : ''}`}>
            <Search size={18} /> Find a Project
          </Link>
          <Link to="/collaborators" className={`dash-menu-item ${location.pathname === '/collaborators' ? 'active' : ''}`}>
            <Briefcase size={18} /> Find a Collaborator
          </Link>
        </nav>
      </aside>

      {/* CONTENT AREA */}
      <div className="dash-content-wrap">
        <header className="dash-topnav">
          <div className="dash-search">
            <Search size={16} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search projects, tasks, people..." 
              value={searchValue || ''}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            />
          </div>

          <div className="dash-actions">
            {role === 'public' ? (
              <Link to="/login" className="btn-login-premium">
                LOGIN / REGISTER
              </Link>
            ) : (
              <>
                <div className="dash-avatar-stack">
                   <div className="dash-avatar dash-avatar-blue">TE</div>
                   <div className="dash-avatar dash-avatar-red">SR</div>
                   <div className="dash-avatar dash-avatar-purple">RL</div>
                   <div className="dash-avatar dash-avatar-gray">+3</div>
                </div>
                
                <Bell size={20} className="dash-action-btn" />
                <MessageSquare size={20} className="dash-action-btn" />
                
                <button className="dash-filter-btn">
                  <Clock size={16} /> Activity Log
                </button>
              </>
            )}
          </div>
        </header>

        <main className="dash-main-content">
          {children}
        </main>
      </div>
    </div>
  )
}
