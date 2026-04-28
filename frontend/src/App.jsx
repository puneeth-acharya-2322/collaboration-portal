import { Routes, Route, useLocation, Link } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import ResearchPage from './pages/ResearchPage.jsx'
import CollaboratePage from './pages/CollaboratePage.jsx'
import CompletedPage from './pages/CompletedPage.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import HomePage from './pages/HomePage.jsx'
import { useUser } from './context/UserContext.jsx'
import { Mail, MapPin } from 'lucide-react'

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
  
  // Detect if we should use the new guest layout for discovery portal
  const discoveryRoutes = ['/research', '/collaborators', '/preferences']
  const isGuestDiscovery = discoveryRoutes.includes(location.pathname) && role === 'public'

  return (
    <div className="app-root">
        <ScrollToTop />
        {!isGuestDiscovery && <Navbar />}
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/research" element={<ResearchPage />} />
            <Route path="/collaborators" element={<ResearchPage forceView="seeker" />} />
            
            <Route path="/collaborate" element={<CollaboratePage />} />
            <Route path="/matches" element={<CollaboratePage forceTab="matches" />} />
            <Route path="/profile" element={<CollaboratePage forceTab="prefs" />} />
            <Route path="/preferences" element={<CollaboratePage forceTab="prefs" />} />
            
            <Route path="/completed" element={<CompletedPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        {!isGuestDiscovery && <Footer />}
    </div>
  )
}

function Footer() {
  return (
    <footer style={{ background: 'var(--navy)', color: 'rgba(255,255,255,0.6)', padding: '80px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="pw">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '64px', marginBottom: '64px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div className="logo-box">K</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>FYRC · Manipal</div>
            </div>
            <p style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '32px' }}>
              Bridging clinical experience with technical innovation. The premier platform for AI research matchmaking at Kasturba Medical College.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
                <Mail size={16} style={{ color: 'var(--gold)' }} />
                <span>ai.healthcare@manipal.edu</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
                <MapPin size={16} style={{ color: 'var(--gold)' }} />
                <span>KMC Manipal, Karnataka - 576104</span>
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '11px', fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '24px' }}>Opportunities</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
              <li><Link to="/research" style={{ color: 'inherit', textDecoration: 'none' }}>Browse Projects</Link></li>
              <li><Link to="/collaborate" style={{ color: 'inherit', textDecoration: 'none' }}>Individual Researcher</Link></li>
              <li><Link to="/admin" style={{ color: 'inherit', textDecoration: 'none' }}>Admin Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '11px', fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '24px' }}>Institutional</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
              <li>MAHE Manipal</li>
              <li>KMC Excellence</li>
              <li>Ethics Policy</li>
            </ul>
          </div>
        </div>

        <div style={{ paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ fontSize: '12px', fontStyle: 'italic' }}>Developed by the Department of AI in Healthcare</div>
          <div style={{ fontSize: '12px' }}>© {new Date().getFullYear()} KMC Manipal. All Rights Reserved.</div>
        </div>
      </div>
    </footer>
  )
}
