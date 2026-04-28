import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { Loader2, Eye, EyeOff, ChevronRight, ChevronLeft } from 'lucide-react'
import logo from '../assets/logo.jpeg'
import illustration from '../assets/auth-flat.png'

const GREEN = '#22C55E'
const NAVY  = '#1B3A5C'

/* ─── tiny helpers ─────────────────────────────────────── */
function Input({ label, type = 'text', placeholder, value, onChange, required = true, half }) {
  const [focus, setFocus] = useState(false)
  const [show,  setShow]  = useState(false)
  const isPwd = type === 'password'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: half ? '1 1 45%' : '1 1 100%', minWidth: 0 }}>
      <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={isPwd && show ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            width: '100%', padding: isPwd ? '0.72rem 2.5rem 0.72rem 0.9rem' : '0.72rem 0.9rem',
            border: `1.5px solid ${focus ? GREEN : '#e2e8f0'}`,
            borderRadius: 10, fontSize: '0.88rem', fontFamily: 'inherit',
            color: NAVY, background: '#fff', outline: 'none',
            boxSizing: 'border-box', transition: 'border-color 0.18s',
            boxShadow: focus ? `0 0 0 3px rgba(34,197,94,0.10)` : 'none',
          }}
        />
        {isPwd && (
          <button type="button" onClick={() => setShow(!show)}
            style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#b0bcc8', display: 'flex', padding: 0 }}>
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  )
}

function Select({ label, value, onChange, options, placeholder, half }) {
  const [focus, setFocus] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: half ? '1 1 45%' : '1 1 100%', minWidth: 0 }}>
      <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</label>
      <select value={value} onChange={onChange} required onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          width: '100%', padding: '0.72rem 0.9rem',
          border: `1.5px solid ${focus ? GREEN : '#e2e8f0'}`,
          borderRadius: 10, fontSize: '0.88rem', fontFamily: 'inherit',
          color: value ? NAVY : '#b0bcc8', background: '#fff', outline: 'none',
          cursor: 'pointer', boxSizing: 'border-box', transition: 'border-color 0.18s',
          boxShadow: focus ? `0 0 0 3px rgba(34,197,94,0.10)` : 'none',
        }}>
        <option value="" disabled>{placeholder || 'Select…'}</option>
        {options.map(o => <option key={o} value={o} style={{ color: NAVY }}>{o}</option>)}
      </select>
    </div>
  )
}

function Row({ children }) {
  return <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>{children}</div>
}

/* ─── Step Progress Bar ─────────────────────────────────── */
const STEPS = ['Account', 'Identity', 'Research', 'Availability']

function StepBar({ step }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1.5rem', gap: 0 }}>
      {STEPS.map((label, i) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'unset' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 64 }}>
            <div style={{
              width: '100%', height: 4, borderRadius: 2,
              background: i <= step ? GREEN : '#e2e8f0',
              marginBottom: 4,
            }} />
            <span style={{
              fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.07em',
              textTransform: 'uppercase', color: i <= step ? GREEN : '#b0bcc8',
            }}>{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ flex: 1, height: 4, background: i < step ? GREEN : '#e2e8f0', borderRadius: 2, margin: '0 2px', marginBottom: 22 }} />
          )}
        </div>
      ))}
    </div>
  )
}

/* ─── Main Component ────────────────────────────────────── */
const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function AuthPage() {
  const [isLogin,    setIsLogin]    = useState(true)
  const [regStep,    setRegStep]    = useState(0)
  const [regSuccess, setRegSuccess] = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState('')

  // Login
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')

  // Step 0 – Account
  const [title,    setTitle]    = useState('')
  const [fullName, setFullName] = useState('')
  const [rEmail,   setREmail]   = useState('')
  const [rPwd,     setRPwd]     = useState('')
  const [phone,    setPhone]    = useState('')

  // Step 1 – Identity
  const [desig,    setDesig]    = useState('')
  const [dept,     setDept]     = useState('')
  const [inst,     setInst]     = useState('MAHE, Manipal')
  const [exp,      setExp]      = useState('')
  const [scopus,   setScopus]   = useState('')
  const [orcid,    setOrcid]    = useState('')

  // Step 2 – Research
  const [hIndex,   setHIndex]   = useState('')
  const [pubs,     setPubs]     = useState('')
  const [domains,  setDomains]  = useState('')
  const [skills,   setSkills]   = useState('')

  // Step 3 – Availability
  const [collab,   setCollab]   = useState('')
  const [avail,    setAvail]    = useState('')
  const [b1,       setB1]       = useState('')
  const [b2,       setB2]       = useState('')
  const [b3,       setB3]       = useState('')

  const navigate = useNavigate()
  const { setRole, setUser, setToken } = useUser()

  // ── Real Login ──────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed.')
      localStorage.setItem('faculty_token', data.token)
      setToken(data.token)
      setRole('user')
      const initials = (data.name || 'Dr Researcher').split(' ').map(n => n[0]).join('')
      setUser({ name: data.name || 'Dr. Researcher', initials, id: data.id || 'FYRC-2401' })
      navigate('/collaborate')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Real Registration (final step submit) ───────────────
  const handleStep = async (e) => {
    e.preventDefault(); setError('')
    if (regStep < 3) { setRegStep(s => s + 1); return }
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${title} ${fullName}`.trim(),
          email: rEmail,
          password: rPwd,
          department: dept || inst,
          roleTitle: desig,
          phone, exp, scopus, orcid, hIndex, pubs, domains, skills, collab, avail,
          expertise: [b1, b2, b3].filter(Boolean),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Registration failed.')
      setRegSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => { setIsLogin(!isLogin); setError(''); setRegStep(0); setRegSuccess(false) }

  return (
    <>
      <style>{`
        @keyframes authFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .rc:hover { border-color:${GREEN}!important; transform:translateY(-2px); box-shadow:0 8px 22px rgba(34,197,94,0.18)!important; }
        .rc:hover .ra { background:${GREEN}!important; color:#fff!important; }
        .gbtn:hover { background:#f0fdf4!important; }
        .ibtn:hover { background:#f0fdf4!important; }
        .sbtn:hover:not(:disabled) { background:#1daf53!important; transform:translateY(-1px); }
        .pbtn:hover { background:#f0fdf4!important; border-color:${GREEN}!important; }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem 1rem', fontFamily:"'DM Sans',sans-serif" }}>
        <div style={{ width:'100%', maxWidth:1120, minHeight:660, borderRadius:28, overflow:'hidden', display:'flex', boxShadow:'0 24px 64px rgba(0,0,0,0.14)' }}>

          {/* ── LEFT PANEL ──────────────────────────────── */}
          <div style={{ flex:1, background: GREEN, display:'flex', flexDirection:'column', padding:'2.2rem', position:'relative', overflow:'hidden' }}>
            {/* grid overlay */}
            <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(0,0,0,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.06) 1px,transparent 1px)', backgroundSize:'36px 36px', pointerEvents:'none' }}/>
            {/* white strip at bottom */}
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'18%', background:'#f8fafc', borderRadius:'24px 24px 0 0' }}/>

            {/* Brand */}
            <div style={{ display:'flex', alignItems:'center', gap:12, position:'relative', zIndex:2 }}>
              <div style={{ width:48, height:48, background:'#fff', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', flexShrink:0, boxShadow:'0 2px 8px rgba(0,0,0,0.15)' }}>
                <img src={logo} alt="KMC" style={{ width:36, height:36, objectFit:'contain' }}/>
              </div>
              <span style={{ fontWeight:800, fontSize:'1rem', color:'#fff', letterSpacing:'0.01em', lineHeight:1.3 }}>Kasturba Medical College, Manipal</span>
            </div>

            {/* Hero */}
            <div style={{ position:'relative', zIndex:2, marginTop:'1.75rem' }}>
              <h1 style={{ fontSize:'2.4rem', fontWeight:800, color:'#fff', lineHeight:1.15, marginBottom:4 }}>Sign in to</h1>
              <h2 style={{ fontSize:'1.2rem', fontWeight:700, color:'#fff', marginBottom:'0.7rem' }}>KMC Research Discovery</h2>
              <p style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.42)', lineHeight:1.7, maxWidth:320 }}>
                Discover collaborative opportunities, manage your research portfolio, and connect with domain experts across MAHE.
              </p>
            </div>

            {/* Discover Projects CTA */}
            <div style={{ position:'relative', zIndex:2, marginTop:'1.2rem' }}>
              <button
                onClick={() => navigate('/research')}
                style={{ width:'100%', padding:'0.75rem 1.2rem', background:'rgba(255,255,255,0.22)', color:'#fff', border:'2px solid rgba(255,255,255,0.8)', borderRadius:12, cursor:'pointer', fontSize:'0.92rem', fontWeight:700, fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:8, transition:'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.36)' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.22)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                Discover Projects
              </button>
            </div>

            {/* Illustration */}
            <div style={{ position:'relative', zIndex:2, flex:1, display:'flex', alignItems:'center', justifyContent:'center', minHeight:0 }}>
              <img src={illustration} alt="Research" style={{ maxWidth:'88%', maxHeight:200, objectFit:'contain', filter:'drop-shadow(0 16px 32px rgba(0,0,0,0.22))', animation:'authFloat 4s ease-in-out infinite' }}/>
            </div>
          </div>

          {/* ── RIGHT PANEL ─────────────────────────────── */}
          <div style={{ width:480, flexShrink:0, background:'#f8fafc', display:'flex' }}>
            <div style={{ background:'#fff', width:'100%', borderRadius:'0 28px 28px 0', padding:'2.2rem 2.6rem', display:'flex', flexDirection:'column', overflowY:'auto', boxShadow:'-6px 0 30px rgba(0,0,0,0.05)' }}>

              {/* Top row – hidden on success screen */}
              {!regSuccess && (
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: isLogin ? '0.9rem' : '0.8rem' }}>
                <div>
                  <div style={{ fontSize:'0.78rem', color:'#8899aa', fontWeight:500, marginBottom:3 }}>
                    Welcome to <span style={{ color: NAVY, fontWeight:800 }}>KMC</span>
                  </div>
                  <div style={{ fontSize:'2rem', fontWeight:800, color:'#0f172a', lineHeight:1.1, letterSpacing:'-0.02em' }}>
                    {isLogin ? 'Sign in' : 'Sign up'}
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:'0.68rem', fontWeight:700, color:'#b0bcc8', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:3 }}>
                    {isLogin ? 'No Account?' : 'Have one?'}
                  </div>
                  <button style={{ background:'none', border:'none', cursor:'pointer', fontSize:'0.82rem', fontWeight:700, color: GREEN, fontFamily:'inherit' }} onClick={switchMode}>
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </div>
              </div>
              )}

              {/* ── LOGIN ── */}
              {isLogin && (
                <>
                  {error && <div style={{ padding:'0.6rem 0.85rem', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:9, fontSize:'0.78rem', color:'#b91c1c', fontWeight:600, marginBottom:'1rem' }}>{error}</div>}
                  <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:'0.55rem' }}>
                    <Input label="Username or email address" type="email" placeholder="Username or email address" value={email} onChange={e=>setEmail(e.target.value)}/>
                    <Input label="Enter your Password" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>
                    <div style={{ textAlign:'right', marginTop:-8 }}>
                      <button type="button" style={{ background:'none', border:'none', cursor:'pointer', fontSize:'0.76rem', fontWeight:600, color: GREEN, fontFamily:'inherit' }}>Forgot Password?</button>
                    </div>
                    <button type="submit" className="sbtn" disabled={loading}
                      style={{ width:'100%', padding:'0.88rem', background: GREEN, color:'#fff', border:'none', borderRadius:13, cursor:'pointer', fontSize:'0.95rem', fontWeight:700, fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:7, transition:'all 0.2s', boxShadow:'0 6px 18px rgba(34,197,94,0.28)', marginTop:4 }}>
                      {loading ? <Loader2 size={19} className="animate-spin"/> : 'Sign in'}
                    </button>
                  </form>
                </>
              )}

              {/* ── REGISTER SUCCESS ── */}
              {!isLogin && regSuccess && (
                <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'1rem 0' }}>
                  <div style={{ width:64, height:64, borderRadius:'50%', background:'#f0fdf4', border:`2px solid ${GREEN}`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.25rem' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div style={{ fontSize:'1.3rem', fontWeight:800, color: NAVY, marginBottom:8 }}>Registration Submitted!</div>
                  <div style={{ fontSize:'0.85rem', color:'#6b7a8d', lineHeight:1.7, maxWidth:310, marginBottom:'1.5rem' }}>
                    Your application is under review. You'll receive an email once your account is approved by the department admin.
                  </div>
                  <div style={{ background:'#f0fdf4', border:`1px solid ${GREEN}20`, borderRadius:12, padding:'0.85rem 1.2rem', fontSize:'0.8rem', color:'#15803d', fontWeight:600, marginBottom:'1.5rem', width:'100%', textAlign:'left' }}>
                    📋 <strong>What's next?</strong><br/>
                    <span style={{ fontWeight:400 }}>The admin will review your credentials and approve your account. This usually takes 1–2 business days.</span>
                  </div>
                  <button onClick={() => { switchMode() }} style={{ width:'100%', padding:'0.85rem', background: GREEN, color:'#fff', border:'none', borderRadius:12, cursor:'pointer', fontSize:'0.9rem', fontWeight:700, fontFamily:'inherit' }}>
                    Back to Sign In
                  </button>
                </div>
              )}

              {/* ── REGISTER FORM ── */}
              {!isLogin && !regSuccess && (
                <>
                  <StepBar step={regStep}/>
                  <div style={{ marginBottom:'1.2rem' }}>
                    <div style={{ fontSize:'1.25rem', fontWeight:800, color: NAVY, marginBottom:2 }}>Researcher Registration</div>
                    <div style={{ fontSize:'0.82rem', color:'#8899aa', fontWeight:500 }}>
                      Step {regStep + 1} of 4: {['Personal Information','Academic Identity','Research & Metrics','Expertise & Settings'][regStep]}
                    </div>
                  </div>

                  {error && <div style={{ padding:'0.6rem 0.85rem', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:9, fontSize:'0.78rem', color:'#b91c1c', fontWeight:600, marginBottom:'1rem' }}>{error}</div>}

                  <form onSubmit={handleStep} style={{ display:'flex', flexDirection:'column', gap:'0.9rem', flex:1 }}>

                    {/* Step 0 — Account */}
                    {regStep === 0 && <>
                      <Row>
                        <Select label="Title" value={title} onChange={e=>setTitle(e.target.value)} options={['Dr.','Mr.','Mrs.','Ms.','Prof.']} placeholder="Dr." half/>
                        <Input label="Full Name" placeholder="e.g. Dr. Priya Nair" value={fullName} onChange={e=>setFullName(e.target.value)} half/>
                      </Row>
                      <Input label="Institutional Email" type="email" placeholder="priya.nair@manipal.edu" value={rEmail} onChange={e=>setREmail(e.target.value)}/>
                      <Row>
                        <Input label="Password" type="password" placeholder="" value={rPwd} onChange={e=>setRPwd(e.target.value)} half/>
                        <Input label="Phone Number" type="tel" placeholder="+91…" value={phone} onChange={e=>setPhone(e.target.value)} half/>
                      </Row>
                    </>}

                    {/* Step 1 — Identity */}
                    {regStep === 1 && <>
                      <Row>
                        <Input label="Designation" placeholder="Assistant Professor" value={desig} onChange={e=>setDesig(e.target.value)} half/>
                        <Input label="Department" placeholder="Ophthalmology" value={dept} onChange={e=>setDept(e.target.value)} half/>
                      </Row>
                      <Input label="Institution" placeholder="MAHE, Manipal" value={inst} onChange={e=>setInst(e.target.value)}/>
                      <Select label="Experience" value={exp} onChange={e=>setExp(e.target.value)} options={['< 2 years','2–5 years','5–10 years','10–20 years','20+ years']} placeholder="Select Experience"/>
                      <Row>
                        <Input label="Scopus ID" placeholder="57200…" value={scopus} onChange={e=>setScopus(e.target.value)} required={false} half/>
                        <Input label="ORCID" placeholder="0000-000…" value={orcid} onChange={e=>setOrcid(e.target.value)} required={false} half/>
                      </Row>
                    </>}

                    {/* Step 2 — Research */}
                    {regStep === 2 && <>
                      <Row>
                        <Input label="H-Index" type="number" placeholder="" value={hIndex} onChange={e=>setHIndex(e.target.value)} required={false} half/>
                        <Input label="Total Publications" type="number" placeholder="" value={pubs} onChange={e=>setPubs(e.target.value)} required={false} half/>
                      </Row>
                      <Input label="Research Domains (comma separated)" placeholder="Medical Imaging, Clinical NLP" value={domains} onChange={e=>setDomains(e.target.value)}/>
                      <Input label="Technical Skills (comma separated)" placeholder="Python, PyTorch, SQL" value={skills} onChange={e=>setSkills(e.target.value)}/>
                    </>}

                    {/* Step 3 — Availability */}
                    {regStep === 3 && <>
                      <Row>
                        <Select label="Collab Mode" value={collab} onChange={e=>setCollab(e.target.value)} options={['Remote','On-site','Hybrid']} placeholder="Hybrid" half/>
                        <Input label="Availability" placeholder="Mon/Wed 4–5:30 PM" value={avail} onChange={e=>setAvail(e.target.value)} half/>
                      </Row>
                      <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                        <label style={{ fontSize:'0.68rem', fontWeight:700, color:'#8899aa', textTransform:'uppercase', letterSpacing:'0.07em' }}>Research Expertise (3 bullets for public card)</label>
                        {[b1,b2,b3].map((v,i) => {
                          const setters = [setB1,setB2,setB3]
                          return <Input key={i} label="" placeholder={`Bullet ${i+1}`} value={v} onChange={e=>setters[i](e.target.value)} required={false}/>
                        })}
                      </div>
                    </>}

                    {/* Nav buttons */}
                    <div style={{ display:'flex', gap:'0.7rem', marginTop:4 }}>
                      {regStep > 0 && (
                        <button type="button" className="pbtn" onClick={() => setRegStep(s=>s-1)}
                          style={{ flex:1, padding:'0.82rem', background:'#fff', color: NAVY, border:`1.5px solid #e2e8f0`, borderRadius:13, cursor:'pointer', fontSize:'0.88rem', fontWeight:700, fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:6, transition:'all 0.18s' }}>
                          <ChevronLeft size={16}/> Prev
                        </button>
                      )}
                      <button type="submit" className="sbtn" disabled={loading}
                        style={{ flex:2, padding:'0.82rem', background: GREEN, color:'#fff', border:'none', borderRadius:13, cursor:'pointer', fontSize:'0.88rem', fontWeight:700, fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:6, transition:'all 0.2s', boxShadow:'0 5px 15px rgba(34,197,94,0.25)' }}>
                        {loading ? <Loader2 size={18} className="animate-spin"/> : regStep < 3 ? <><span>Next</span><ChevronRight size={16}/></> : 'Complete Registration'}
                      </button>
                    </div>

                    <div style={{ textAlign:'center', fontSize:'0.75rem', color:'#8899aa', marginTop:2 }}>
                      By registering, you agree to{' '}
                      <span style={{ color: GREEN, fontWeight:600, cursor:'pointer' }}>institutional research guidelines</span>.
                    </div>
                  </form>
                </>
              )}

            </div>
          </div>

        </div>
      </div>
    </>
  )
}
