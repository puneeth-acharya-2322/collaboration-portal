import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Info, ChevronRight, User, Settings, Heart, Shield, HelpCircle, LogOut } from 'lucide-react'
import { useUser } from '../context/UserContext'

export default function CollaboratePage({ forceTab }) {
  const [tab, setTab] = useState(forceTab || 'matches') // 'matches' or 'prefs'
  const { user, setRole } = useUser()

  useEffect(() => {
    if (forceTab) setTab(forceTab)
  }, [forceTab])

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Sub-navigation Tabs */}
      <div className="subnav" style={{ position: 'sticky', top: '56px', zIndex: 90 }}>
        <button 
          className={`snb ${tab === 'matches' ? 'active' : ''}`}
          onClick={() => setTab('matches')}
        >
          My Matches <span className="badge-count">12</span>
        </button>
        <button 
          className={`snb ${tab === 'prefs' ? 'active' : ''}`}
          onClick={() => setTab('prefs')}
        >
          Collaboration Prefs
        </button>
      </div>

      <div className="pw">
        <div className="profile-wrap">
          {/* LEFT SIDEBAR: Personal Card */}
          <aside className="profile-card">
            <div className="pc-banner">
              <div className="pc-av-big">{user?.initials || 'DR'}</div>
              <div className="pc-pname">{user?.name || 'Dr. Anitha Rao'}</div>
              <div className="pc-pid">ID: {user?.id || 'FYRC-2401-92'}</div>
            </div>
            <div className="pc-actions">
              <div className="pc-action-link"><span className="al-icon"><User size={14}/></span> Edit My Profile</div>
              <div className="pc-action-link"><span className="al-icon"><Settings size={14}/></span> Account Settings</div>
              <div className="pc-action-link"><span className="al-icon"><Shield size={14}/></span> Privacy Options</div>
              <div className="divider"></div>
              <div className="pc-action-link" style={{ color: 'var(--red)' }} onClick={() => setRole('public')}><span className="al-icon"><LogOut size={14}/></span> Sign Out</div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main>
            {tab === 'matches' ? (
              <MatchesView />
            ) : (
              <PreferencesView />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

function MatchesView() {
  return (
    <>
      <div className="matches-tabs">
        <button className="mt-tab active">New Matches <span className="today-badge">Today</span></button>
        <button className="mt-tab">Shortlisted</button>
        <button className="mt-tab">Requests Sent</button>
        <button className="mt-tab">Filtered Out</button>
      </div>

      <div className="info-box">
        <Info size={16} />
        <div>We found 12 new projects that match your expertise in <strong>Medical Imaging</strong> and <strong>Clinical NLP</strong>.</div>
      </div>

      <div className="results-list">
         <MatchCard 
            title="Retinal OCT scan classifier for early diabetic retinopathy"
            pi="Dr. Priya Nair"
            dept="Ophthalmology"
            score="94%"
         />
         <MatchCard 
            title="AI-powered triage for emergency cardiac admissions"
            pi="Dr. Rajesh Kumar"
            dept="Cardiology"
            score="88%"
         />
      </div>
    </>
  )
}

function MatchCard({ title, pi, dept, score }) {
  const percent = parseInt(score);
  return (
    <div className="project-card featured">
      <div className="pc-left">
        <div className="pc-top">
          <div className="pc-avatar" style={{ background: 'var(--navy)' }}>{pi[4]}</div>
          <div>
            <div className="pc-title">{title}</div>
            <div className="pc-pi">{pi} · {dept}</div>
          </div>
        </div>
        <div className="pc-meta">
          <span className="pc-tag tag-domain">Computer Vision</span>
          <span className="pc-tag tag-status-on">Priority</span>
        </div>
        <p className="pc-abstract">Personalised recommendations based on your Collaboration Preferences. This project matches your recent publication on OCT analysis.</p>
        <div className="pc-footer">
           <span className="pc-perk">Match discovered 2h ago</span>
        </div>
      </div>
      <div className="pc-right" style={{ paddingLeft: '1.5rem', borderLeft: '1px solid var(--border)', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: '60px', height: '60px' }} className="mb-3">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
             <circle cx="18" cy="18" r="16" fill="none" stroke="#f0f3f7" strokeWidth="3" />
             <circle 
                cx="18" cy="18" r="16" 
                fill="none" 
                stroke="var(--teal)" 
                strokeWidth="3" 
                strokeDasharray="100" 
                strokeDashoffset={100 - percent} 
                strokeLinecap="round" 
             />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
             <div className="text-[12px] font-bold text-[var(--navy)]">{score}</div>
             <div className="text-[7px] text-[var(--muted)] font-bold uppercase">match</div>
          </div>
        </div>
        <button className="collab-btn" style={{ minWidth: '100px' }}>Request Info</button>
      </div>
    </div>
  )
}

function PreferencesView() {
  return (
    <div className="profile-sections">
      <div className="ps-card">
         <div className="ps-header">
            <h3 className="ps-title">Partner Preferences</h3>
            <button className="ps-edit">Global Edit</button>
         </div>
         
         <div className="pref-section">
            <div className="pref-row">
               <div className="pref-left">
                  <div className="pref-icon" style={{ background: '#E8F5F3', color: '#1A7A6E' }}><Settings size={14}/></div>
                  <div>
                     <div className="pref-name">Research Domain</div>
                     <div className="pref-val">Medical Imaging, Clinical NLP, Telemedicine</div>
                  </div>
               </div>
               <ChevronRight size={14} className="pref-arrow" />
            </div>

            <div className="pref-row">
               <div className="pref-left">
                  <div className="pref-icon" style={{ background: '#FEF3E2', color: '#D4820A' }}><Shield size={14}/></div>
                  <div>
                     <div className="pref-name">Time Commitment</div>
                     <div className="pref-val">4-8 hours per week (Hybrid)</div>
                  </div>
               </div>
               <ChevronRight size={14} className="pref-arrow" />
            </div>

            <div className="pref-row">
               <div className="pref-left">
                  <div className="pref-icon" style={{ background: '#F0F3F7', color: 'var(--navy)' }}><User size={14}/></div>
                  <div>
                     <div className="pref-name">Team Seniority</div>
                     <div className="pref-val">Assistant Professor and above</div>
                  </div>
               </div>
               <ChevronRight size={14} className="pref-arrow" />
            </div>
         </div>
      </div>

      <div className="ps-card">
         <div className="ps-header">
            <h3 className="ps-title">Privacy & Visibility</h3>
         </div>
         <div className="pref-row" style={{ border: 'none' }}>
            <div className="pref-left">
               <div>
                  <div className="pref-name">Show my profile to all faculty</div>
                  <div className="pref-val">Currently visible to 24 departments</div>
               </div>
            </div>
            <div className="toggle-sw on"></div>
         </div>
      </div>
    </div>
  )
}

