import { Routes, Route, useLocation, Link } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import ResearchPage from './pages/ResearchPage.jsx'
import CollaboratePage from './pages/CollaboratePage.jsx'
import CompletedPage from './pages/CompletedPage.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AuthPage from './pages/AuthPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { useUser } from './context/UserContext.jsx'
import { Mail, MapPin } from 'lucide-react'
import logo from './assets/logo.webp'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const location = useLocation()
  const { role } = useUser()

  // Routes that render DashboardLayout (260px fixed sidebar) for public/guest users
  const discoveryRoutes = ['/', '/research', '/collaborators', '/preferences', '/collaborate', '/matches', '/profile']
  const authRoutes = ['/login', '/admin/login', '/register']
  const isGuestDiscovery = (discoveryRoutes.includes(location.pathname) && role === 'public')
    || authRoutes.includes(location.pathname)
    || location.pathname.startsWith('/dashboard')
    || location.pathname.startsWith('/admin')
  // Sidebar is visible only when on discovery routes AND user is public (guest)
  const hasSidebar = discoveryRoutes.includes(location.pathname) && role === 'public'

  return (
    <div className="app-root">
      <ScrollToTop />
      {!isGuestDiscovery && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<ResearchPage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/collaborators" element={<ResearchPage forceView="seeker" />} />

          <Route path="/collaborate" element={<CollaboratePage />} />
          <Route path="/matches" element={<CollaboratePage forceTab="matches" />} />
          <Route path="/profile" element={<CollaboratePage forceTab="prefs" />} />
          <Route path="/preferences" element={<CollaboratePage forceTab="prefs" />} />

          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/completed" element={<CompletedPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/*" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer hasSidebar={hasSidebar} />
    </div>
  )
}


function Footer({ hasSidebar }) {
  const GREEN = '#2D7A3A'

  const headingStyle = {
    fontSize: '18px',
    fontWeight: '700',
    color: GREEN,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '20px',
    fontFamily: "'Montserrat', 'DM Sans', sans-serif",
  }

  const textStyle = {
    fontSize: '14px',
    color: '#333',
    lineHeight: '1.9',
    fontFamily: "'Montserrat', 'DM Sans', sans-serif",
  }

  const socialIcons = [
    { title: 'LinkedIn',  svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> },
    { title: 'Instagram', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
    { title: 'YouTube',   svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg> },
    { title: 'X/Twitter', svg: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
    { title: 'Facebook',  svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
  ]

  return (
    <footer style={{
      fontFamily: "'Montserrat', 'DM Sans', sans-serif",
      background: '#fff',
      width: '100%',
      boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.08)',
    }}>
      {/* ── Main footer body ── */}
      <div style={{ padding: '48px 32px 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '40px',
          alignItems: 'start',
          marginBottom: '40px',
        }}>

          {/* Col 1 – Logo + brand */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <img
              src={logo} alt="KMC Logo"
              style={{ maxWidth: '220px', height: 'auto', objectFit: 'contain', display: 'block', marginBottom: '12px' }}
            />
            <hr style={{ border: 'none', borderTop: '1px solid #DDDDDD', width: '100%', margin: '0 0 12px 0' }} />
            <div style={{
              display: 'block',
              color: '#222',
              fontFamily: "'EB Garamond', serif",
              fontWeight: '700',
              fontSize: '22px',
              lineHeight: '1.1',
              marginBottom: '4px',
              textDecoration: 'none',
            }}>
              Collaboration Portal
            </div>
            <div style={{ fontSize: '13px', color: '#333', lineHeight: 1.5 }}>
              Kasturba Medical College, Manipal
            </div>
          </div>

          {/* Col 2 – About the Portal */}
          <div>
            <div style={headingStyle}>About the Portal</div>
            <p style={{ ...textStyle, margin: 0 }}>
              Bridging clinical experience with technical innovation.
              The premier platform for AI research matchmaking at
              Kasturba Medical College, Manipal.
            </p>
          </div>

          {/* Col 3 – Address */}
          <div>
            <div style={headingStyle}>Address</div>
            <p style={{ ...textStyle, margin: 0 }}>
              Room No: 18219<br />
              Ground floor<br />
              KMC Administrative block<br />
              Kasturba Medical College,<br />
              Madhav Nagar, Manipal – 576104
            </p>
          </div>

          {/* Col 4 – Contact */}
          <div>
            <div style={headingStyle}>Contact</div>
            {/* Email */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Mail size={15} style={{ color: GREEN, flexShrink: 0 }} />
              <a
                href="mailto:aihealthcare.kmc@manipal.edu"
                style={{ fontSize: '13.5px', color: '#333', textDecoration: 'none', wordBreak: 'break-all' }}
              >
                aihealthcare.kmc@manipal.edu
              </a>
            </div>
            {/* Social icons – circular white buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {socialIcons.map(({ title, svg }) => (
                <a key={title} href="#" title={title} style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: '#fff', border: '0.8px solid #DDDDDD',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#444', textDecoration: 'none', flexShrink: 0,
                  transition: 'border-color 0.2s, color 0.2s',
                }}>
                  {svg}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Newsletter row ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          paddingTop: '24px',
          borderTop: '1px solid #E0E0E0',
        }}>
          <span style={{ fontSize: '14px', color: '#333', whiteSpace: 'nowrap', fontWeight: '500' }}>Newsletter Signup</span>
          <input
            type="email"
            placeholder="Email id"
            style={{
              flex: 1, maxWidth: '320px', padding: '8px 16px',
              border: '0.8px solid #DDDDDD', borderRadius: '50px',
              fontSize: '13px', outline: 'none', background: '#fff',
              fontFamily: "'Montserrat', 'DM Sans', sans-serif",
            }}
          />
          <button style={{
            background: GREEN, color: '#fff',
            border: 'none', borderRadius: '50px',
            padding: '8px 24px', fontSize: '12px',
            fontWeight: '700', cursor: 'pointer',
            fontFamily: "'Montserrat', 'DM Sans', sans-serif",
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}>
            Subscribe
          </button>
        </div>
      </div>

      {/* ── Copyright bar ── */}
      <div style={{
        background: GREEN,
        padding: '16px 32px',
        textAlign: 'center',
      }}>
        <span style={{ fontSize: '14px', color: '#fff', fontFamily: "'Montserrat', 'DM Sans', sans-serif" }}>
          © {new Date().getFullYear()} Manipal Academy of Higher Education
        </span>
      </div>
    </footer>
  )
}
