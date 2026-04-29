import { useState, useEffect } from 'react'
import { useNavigate, Outlet, Link } from 'react-router-dom'
import AdminSubnav from './AdminSubnav'
import { LogOut } from 'lucide-react'
import logo from '../assets/logo.jpeg'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function AdminLayout() {
  const navigate  = useNavigate()
  const token     = localStorage.getItem('admin_token')

  const [data,    setData]    = useState({
    stats:           null,
    pendingUsers:    [],
    pendingProjects: [],
    allProjects:     [],
    allFaculty:      [],
  })
  const [loading, setLoading] = useState(true)

  // ----- helpers -----
  const authHeaders = { Authorization: `Bearer ${token}` }

  const fetchAdminData = async () => {
    try {
      const [usersRes, projsRes, pendProjRes] = await Promise.all([
        fetch(`${API}/api/admin/pending-users`,    { headers: authHeaders }),
        fetch(`${API}/api/projects`,               { headers: authHeaders }),
        fetch(`${API}/api/admin/pending-projects`, { headers: authHeaders }),
      ])

      const pendingUsers    = await usersRes.json()
      const allProjectsRaw  = await projsRes.json()
      const pendingProjects = await pendProjRes.json()

      const allProjects = Array.isArray(allProjectsRaw)
        ? allProjectsRaw
        : (allProjectsRaw.data || [])

      const allFaculty = []          // populated from allProjects submitters if needed

      const stats = {
        totalUsers:       (Array.isArray(pendingUsers) ? pendingUsers.length : 0),
        activeProjects:   allProjects.filter(p => p.approvalStatus === 'approved').length,
        pendingApprovals: (Array.isArray(pendingUsers) ? pendingUsers.length : 0)
                        + (Array.isArray(pendingProjects) ? pendingProjects.length : 0),
        totalRequests:    0,
      }

      setData({
        stats,
        pendingUsers:    Array.isArray(pendingUsers)    ? pendingUsers    : [],
        pendingProjects: Array.isArray(pendingProjects) ? pendingProjects : [],
        allProjects,
        allFaculty,
      })
    } catch (e) {
      console.error('Admin data fetch error:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token) { navigate('/admin/login'); return }
    fetchAdminData()
    const interval = setInterval(fetchAdminData, 30000)
    return () => clearInterval(interval)
  }, [token])

  // ----- action handler -----
  const handleAction = async (type, id, status) => {
    try {
      const endpoint = type === 'user'
        ? `/api/admin/approve-user/${id}`
        : `/api/admin/approve-project/${id}`
      await fetch(`${API}${endpoint}`, {
        method:  'POST',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status }),
      })
      await fetchAdminData()
    } catch (err) {
      console.error('Action failed:', err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  if (loading) return (
    <div className="pw empty-state" style={{ paddingTop: '4rem', textAlign: 'center', color: 'var(--muted)' }}>
      Loading Admin System...
    </div>
  )

  const pendingCount = (data.pendingUsers?.length || 0) + (data.pendingProjects?.length || 0)

  return (
    <>
      {/* ── Topbar ── */}
      <div className="topbar">
        <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '15px', textDecoration: 'none' }}>
          <div className="logo-box">K</div>
          <div>
            <div className="brand" style={{ color: '#fff' }}>KMC · Department of AI in Healthcare</div>
            <div className="brand-sub" style={{ color: 'rgba(255,255,255,0.7)' }}>FYRC — Find Your Research Collaborator Portal</div>
          </div>
        </Link>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.12)', padding: '4px 12px 4px 4px', borderRadius: '99px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--amber)', color: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
              AD
            </div>
            <span style={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}>Administrator</span>
          </div>
          <button onClick={handleLogout} title="Logout" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
            <LogOut size={14} />
          </button>
        </div>
      </div>

      {/* ── Sub-nav ── */}
      <AdminSubnav pendingCount={pendingCount} />

      {/* ── Content ── */}
      <div className="pw" style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', paddingTop: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Outlet context={{ data, fetchAdminData, handleAction }} />
        </div>
      </div>
    </>
  )
}
