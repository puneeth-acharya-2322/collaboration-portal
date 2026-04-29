import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { dummySeekers } from '../data/mockSeekers'
import DashboardLayout from '../components/DashboardLayout'
import { useUser } from '../context/UserContext'

export default function CollaboratorDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { role } = useUser()
  const [seeker, setSeeker] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const found = dummySeekers.find(s => s.id === id)
      setSeeker(found)
      setLoading(false)
    }, 400)
  }, [id])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="w-8 h-8 text-[#0D9488] animate-spin" />
      </div>
    )
  }

  if (!seeker) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>Collaborator not found</h2>
        <button onClick={() => navigate('/research')} style={{ color: '#0D9488', fontWeight: 'bold', textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer' }}>Return to Discovery</button>
      </div>
    )
  }

  const content = (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 24px 32px', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Back to results */}
      <button 
        onClick={() => navigate(-1)} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e', fontSize: '13px', fontWeight: 'bold', marginBottom: '24px', transition: 'all 0.2s', border: 'none', background: 'none', cursor: 'pointer' }}
      >
        <ArrowLeft size={16} strokeWidth={2.5} />
        Back to results
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {/* LEFT COLUMN: Profile info */}
        <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#22c55e', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 'bold', flexShrink: 0 }}>
                {seeker.initials}
              </div>
              <div>
                <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#22c55e', lineHeight: '1.2', marginBottom: '4px', margin: 0 }}>
                  {seeker.name}
                </h1>
                <div style={{ color: '#64748b', fontSize: '14px' }}>
                  {seeker.role}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
              {seeker.skills?.slice(0, 2).map((skill, i) => (
                <span key={i} style={{ padding: '4px 10px', background: '#F1F5F9', color: '#334155', borderRadius: '100px', fontSize: '11px', fontWeight: '700' }}>
                  {skill}
                </span>
              ))}
              <span style={{ padding: '4px 10px', background: '#ECFDF5', color: '#047857', borderRadius: '100px', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#047857' }} />
                {seeker.status}
              </span>
            </div>

            {/* Grid data */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '32px', rowGap: '24px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Scopus ID</div>
                <div style={{ fontWeight: '600', color: '#0D9488', fontSize: '14px' }}>{seeker.scopusId || 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>ORCID</div>
                <div style={{ fontWeight: '600', color: '#0D9488', fontSize: '14px' }}>{seeker.orcid || 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>h-index</div>
                <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>{seeker.hIndex}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Publications</div>
                <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>{seeker.publications}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Discussion hours</div>
                <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>{seeker.discussionHours || 'Not specified'}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Mode</div>
                <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>{seeker.mode}</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Action & Urgency */}
        <div style={{ flex: '1 1 320px', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b', marginBottom: '16px', marginTop: 0 }}>CONNECT WITH RESEARCHER</h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '24px', marginTop: 0 }}>
              Reach out to discuss potential collaboration opportunities aligned with your expertise.
            </p>
            <button 
              onClick={() => navigate('/login')}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#22c55e', color: 'white', fontSize: '13px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
            >
              Login to request meet
            </button>
          </div>

          <div style={{ backgroundColor: '#FFFBEB', borderRadius: '12px', border: '1px solid #FEF3C7', padding: '20px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#D97706', marginBottom: '8px' }}>
              Urgency level: {seeker.urgency}
            </div>
            <p style={{ fontSize: '12px', color: '#92400E', lineHeight: '1.6', margin: 0 }}>
              This researcher needs a collaborator soon. They are looking for someone who can start within the next 2-4 weeks.
            </p>
          </div>
        </div>
      </div>

      {/* FYRC CARD */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '16px', backgroundColor: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', letterSpacing: '0.05em', margin: 0 }}>FYRC CARD — RESEARCH IDENTITY</h2>
        </div>
        
        <div style={{ padding: '24px' }}>
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column' }}>
            
            {/* Top Green Bar */}
            <div style={{ backgroundColor: '#22c55e', padding: '16px 24px', textAlign: 'center', color: 'white' }}>
              <h3 style={{ fontFamily: 'serif', fontWeight: 'bold', fontSize: '18px', marginBottom: '4px', marginTop: 0 }}>Find Your Research Collaborator (FYRC) Portal</h3>
              <p style={{ fontSize: '11px', letterSpacing: '0.1em', color: '#f0fdf4', textTransform: 'uppercase', margin: 0 }}>KMC · AI in Healthcare · MAHE</p>
            </div>

            {/* Main Grid */}
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              
              {/* Left Side */}
              <div style={{ flex: '1 1 300px', padding: '24px', backgroundColor: '#F8FAFC' }}>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', padding: 0, margin: 0, listStyle: 'none' }}>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#22c55e' }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#22c55e', marginTop: '6px' }} />
                    <span style={{ fontWeight: '500' }}>{seeker.role?.split('·')[0].trim()}</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#22c55e' }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#22c55e', marginTop: '6px' }} />
                    <span>{seeker.department}</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#22c55e' }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#22c55e', marginTop: '6px' }} />
                    <span>MAHE, Manipal</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#22c55e' }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#22c55e', marginTop: '6px' }} />
                    <span>{seeker.coOrdinator}</span>
                  </li>
                </ul>

                <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '500', color: '#0D9488' }}>{seeker.email}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#EF4444' }}>Unavail.</span>
                    <div style={{ width: '40px', height: '20px', backgroundColor: '#059669', borderRadius: '9999px', position: 'relative' }}>
                      <div style={{ position: 'absolute', right: '4px', top: '4px', width: '12px', height: '12px', backgroundColor: 'white', borderRadius: '50%' }} />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#059669' }}>Available</span>
                  </div>
                </div>
              </div>

              {/* Right Side */}
              <div style={{ flex: '1.2 1 350px', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #e2e8f0' }}>
                <div style={{ backgroundColor: '#22c55e', color: 'white', padding: '24px', flex: 1 }}>
                  <h4 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14px', marginBottom: '16px', marginTop: 0 }}>My research expertise</h4>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', padding: 0, margin: 0, listStyle: 'none' }}>
                    {seeker.expertise?.map((exp, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px' }}>
                        <span style={{ color: 'white' }}>✓</span>
                        {exp}
                      </li>
                    ))}
                  </ul>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', opacity: 0.9, fontSize: '14px' }}>
                    <div>Scopus: {seeker.scopusId}</div>
                    <div>ORCID: {seeker.orcid}</div>
                  </div>
                </div>
                
                {/* Calendar Grid */}
                <div style={{ backgroundColor: 'white', padding: '16px', borderTop: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#22c55e', marginBottom: '12px', textAlign: 'center' }}>Available for discussion · {seeker.discussionHours}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', maxWidth: '300px', margin: '0 auto', textAlign: 'center', fontSize: '10px', color: '#94a3b8' }}>
                    <div style={{ paddingBottom: '4px' }}>M</div><div style={{ paddingBottom: '4px' }}>T</div><div style={{ paddingBottom: '4px' }}>W</div><div style={{ paddingBottom: '4px' }}>T</div><div style={{ paddingBottom: '4px' }}>F</div><div style={{ paddingBottom: '4px' }}>S</div><div style={{ paddingBottom: '4px' }}>S</div>
                    
                    {/* W1 */}
                    <div style={{ fontSize: '9px', textAlign: 'left', paddingTop: '4px' }}>W1</div>
                    <div style={{ backgroundColor: '#22c55e', borderRadius: '4px', height: '22px' }} />
                    <div style={{ backgroundColor: '#F1F5F9', borderRadius: '4px', height: '22px' }} />
                    <div style={{ backgroundColor: '#22c55e', borderRadius: '4px', height: '22px' }} />
                    <div style={{ backgroundColor: '#F1F5F9', borderRadius: '4px', height: '22px' }} />
                    <div style={{ backgroundColor: '#22c55e', borderRadius: '4px', height: '22px' }} />
                    <div style={{ backgroundColor: '#F1F5F9', borderRadius: '4px', height: '22px' }} />
                    <div style={{ backgroundColor: '#F1F5F9', borderRadius: '4px', height: '22px' }} />
                    
                    {/* W2 */}
                    <div style={{ fontSize: '9px', textAlign: 'left', paddingTop: '4px' }}>W2</div>
                    <div style={{ backgroundColor: '#22c55e', borderRadius: '4px', height: '22px' }} />
                    <div style={{ backgroundColor: '#F1F5F9', borderRadius: '4px', height: '22px' }} />
                    <div style={{ backgroundColor: '#22c55e', borderRadius: '4px', height: '22px' }} />
                    <div style={{ backgroundColor: '#F1F5F9', borderRadius: '4px', height: '22px' }} />
                    <div style={{ backgroundColor: '#F1F5F9', borderRadius: '4px', height: '22px' }} />
                    <div style={{ backgroundColor: '#F1F5F9', borderRadius: '4px', height: '22px' }} />
                    <div style={{ backgroundColor: '#F1F5F9', borderRadius: '4px', height: '22px' }} />
                    
                    {/* W3 */}
                    <div style={{ fontSize: '9px', textAlign: 'left', paddingTop: '4px' }}>W3</div>
                    <div style={{ backgroundColor: '#F1F5F9', borderRadius: '4px', height: '22px' }} />
                    <div style={{ backgroundColor: '#F1F5F9', borderRadius: '4px', height: '22px' }} />
                    <div style={{ backgroundColor: '#22c55e', borderRadius: '4px', height: '22px' }} />
                    <div style={{ backgroundColor: '#F1F5F9', borderRadius: '4px', height: '22px' }} />
                    <div style={{ backgroundColor: '#22c55e', borderRadius: '4px', height: '22px' }} />
                    <div style={{ backgroundColor: '#F1F5F9', borderRadius: '4px', height: '22px' }} />
                    <div style={{ backgroundColor: '#F1F5F9', borderRadius: '4px', height: '22px' }} />
                    
                    {/* W4 */}
                    <div style={{ fontSize: '9px', textAlign: 'left', paddingTop: '4px' }}>W4</div>
                    <div style={{ backgroundColor: '#22c55e', borderRadius: '4px', height: '22px' }} />
                    <div style={{ backgroundColor: '#F1F5F9', borderRadius: '4px', height: '22px' }} />
                    <div style={{ backgroundColor: '#F1F5F9', borderRadius: '4px', height: '22px' }} />
                    <div style={{ backgroundColor: '#F1F5F9', borderRadius: '4px', height: '22px' }} />
                    <div style={{ backgroundColor: '#22c55e', borderRadius: '4px', height: '22px' }} />
                    <div style={{ backgroundColor: '#F1F5F9', borderRadius: '4px', height: '22px' }} />
                    <div style={{ backgroundColor: '#F1F5F9', borderRadius: '4px', height: '22px' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row - Resources */}
            <div style={{ display: 'flex', flexWrap: 'wrap', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ flex: '1 1 300px', padding: '20px', backgroundColor: '#E8F5F3' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#0D9488', marginBottom: '12px', textAlign: 'center', marginTop: 0 }}>Resources I can provide:</h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: 0, margin: 0, listStyle: 'none' }}>
                  {seeker.resources?.map((res, i) => (
                    <li key={i} style={{ fontSize: '11px', color: '#0D9488', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', border: '1px solid #0D9488', borderRadius: '2px' }} /> {res}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ flex: '1.2 1 350px', padding: '20px', backgroundColor: '#FFFBEB', borderLeft: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#D97706', marginBottom: '12px', textAlign: 'center', marginTop: 0 }}>I am seeking:</h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: 0, margin: 0, listStyle: 'none' }}>
                  {seeker.seekingList?.map((item, i) => (
                    <li key={i} style={{ fontSize: '11px', color: '#D97706', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', border: '1px solid #D97706', borderRadius: '2px' }} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Green Bar */}
            <div style={{ backgroundColor: '#22c55e', padding: '12px 24px', textAlign: 'center', color: '#f0fdf4', fontStyle: 'italic', fontSize: '11px' }}>
              Find the missing piece of puzzle to expand to newer horizons of interdisciplinary research
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (role === 'public') {
    return (
      <DashboardLayout>
        <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
          {content}
        </div>
      </DashboardLayout>
    )
  }

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      {content}
    </div>
  )
}
