import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api'
import { Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import logo from '../assets/logo.jpeg'

const NAVY  = '#1B3A5C'
const GREEN = '#22C55E'
const GOLD  = '#C9A84C'

export default function AdminLogin() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login(email, password)
      localStorage.setItem('admin_token', data.token)
      navigate('/admin')
    } catch (err) {
      setError(err.error || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @keyframes adminFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .adm-input:focus { border-color: ${GREEN} !important; box-shadow: 0 0 0 3px rgba(34,197,94,0.12) !important; }
        .adm-submit:hover:not(:disabled) { background: #1daf53 !important; transform: translateY(-1px); }
        .adm-submit:disabled { opacity: 0.7; cursor: not-allowed; }
        .adm-back:hover { color: ${NAVY} !important; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#f0f3f7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'DM Sans', sans-serif",
        padding: '1.5rem 1rem',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 460,
          background: '#fff',
          borderRadius: 24,
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
          overflow: 'hidden',
        }}>

          {/* ── Header Banner ── */}
          <div style={{
            background: NAVY,
            padding: '2rem 2rem 1.5rem',
            textAlign: 'center',
            position: 'relative',
          }}>
            {/* Logo */}
            <div style={{
              width: 64, height: 64,
              borderRadius: '50%',
              background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              overflow: 'hidden',
              flexShrink: 0,
            }}>
              <img src={logo} alt="KMC Logo" style={{ width: 48, height: 48, objectFit: 'contain' }} />
            </div>

            {/* Shield icon badge */}
            <div style={{
              position: 'absolute', top: 16, right: 20,
              background: 'rgba(34,197,94,0.15)',
              border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: 8,
              padding: '4px 10px',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <ShieldCheck size={13} color={GREEN} />
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: GREEN, letterSpacing: '0.04em' }}>ADMIN</span>
            </div>

            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>
              FYRC Admin Portal
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: 4, lineHeight: 1.2 }}>
              Institutional Admin
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
              Find Your Research Collaborator · MAHE
            </p>
          </div>

          {/* ── Form Body ── */}
          <div style={{ padding: '2rem 2rem 2.5rem' }}>

            {error && (
              <div style={{
                padding: '0.65rem 0.9rem',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 10,
                fontSize: '0.8rem',
                color: '#b91c1c',
                fontWeight: 600,
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#b91c1c', flexShrink: 0 }} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Email */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  Admin Email Address
                </label>
                <input
                  className="adm-input"
                  type="email"
                  placeholder="admin@manipal.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.9rem',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: 10,
                    fontSize: '0.88rem',
                    fontFamily: 'inherit',
                    color: NAVY,
                    background: '#fff',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.18s, box-shadow 0.18s',
                  }}
                />
              </div>

              {/* Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  Secure Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="adm-input"
                    type={showPwd ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    style={{
                      width: '100%',
                      padding: '0.75rem 2.5rem 0.75rem 0.9rem',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: 10,
                      fontSize: '0.88rem',
                      fontFamily: 'inherit',
                      color: NAVY,
                      background: '#fff',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.18s, box-shadow 0.18s',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    style={{
                      position: 'absolute', right: 12, top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none', border: 'none',
                      cursor: 'pointer', color: '#b0bcc8',
                      display: 'flex', padding: 0,
                    }}
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="adm-submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  background: GREEN,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 12,
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.2s',
                  boxShadow: '0 6px 18px rgba(34,197,94,0.28)',
                  marginTop: 8,
                }}
              >
                {loading
                  ? <Loader2 size={20} className="animate-spin" />
                  : 'Connect to Dashboard'
                }
              </button>
            </form>

            {/* Back link */}
            <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
              <Link
                to="/login"
                className="adm-back"
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#8899aa',
                  textDecoration: 'none',
                  transition: 'color 0.18s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                ← Back to Faculty Portal
              </Link>
            </div>
          </div>

          {/* ── Footer ── */}
          <div style={{
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            padding: '0.85rem 2rem',
            textAlign: 'center',
            fontSize: '0.72rem',
            color: '#b0bcc8',
            fontWeight: 500,
          }}>
            © {new Date().getFullYear()} Manipal Academy of Higher Education
            &nbsp;·&nbsp; KMC · Department of AI in Healthcare
          </div>
        </div>
      </div>
    </>
  )
}
