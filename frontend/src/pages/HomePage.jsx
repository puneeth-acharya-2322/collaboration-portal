import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, Zap, Rocket, Target, Award, ChevronRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="home-container">
      {/* Premium Hero Section */}
      <section className="hero-section" style={{ 
        background: 'var(--navy)', 
        padding: '100px 0', 
        position: 'relative', 
        overflow: 'hidden',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center'
      }}>
        {/* Background Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '500px',
          height: '500px',
          background: 'var(--gold)',
          opacity: 0.05,
          filter: 'blur(100px)',
          borderRadius: '50%'
        }} />
        
        <div className="pw">
          <div style={{ maxWidth: '800px' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '6px 16px', 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '99px',
              border: '1px solid rgba(255,255,255,0.1)',
              marginBottom: '32px'
            }}>
              <Sparkles size={14} style={{ color: 'var(--gold)' }} />
              <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                Bridging AI & Clinical Excellence
              </span>
            </div>

            <h1 className="hero-title" style={{ 
              fontSize: 'clamp(40px, 8vw, 72px)', 
              fontWeight: '700', 
              fontFamily: "'Merriweather', serif", 
              color: '#fff', 
              lineHeight: 1.1,
              marginBottom: '24px'
            }}>
              Find Your <br />
              <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Research Match</span>
            </h1>

            <p style={{ 
              fontSize: '18px', 
              color: 'rgba(255,255,255,0.6)', 
              maxWidth: '600px', 
              lineHeight: 1.6,
              marginBottom: '40px'
            }}>
              The premier collaboration portal for KMC Manipal. Connect with world-class clinicians and AI researchers to turn breakthrough ideas into clinical reality.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/research" className="btn btn-navy" style={{ 
                padding: '16px 32px', 
                fontSize: '14px', 
                background: '#fff', 
                color: 'var(--navy)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none'
              }}>
                Find a Project <ArrowRight size={18} />
              </Link>
              <Link to="/collaborate" className="btn" style={{ 
                padding: '16px 32px', 
                fontSize: '14px', 
                background: 'transparent', 
                color: '#fff', 
                borderColor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none'
              }}>
                Join as Researcher <Zap size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '60px 0' }}>
        <div className="pw">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '40px' 
          }}>
            {[
              { label: 'Active Projects', value: '12+' },
              { label: 'Clinical Partners', value: '45+' },
              { label: 'AI Domains', value: '08' },
              { label: 'Research Papers', value: '15+' },
            ].map((stat, i) => (
              <div key={i}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--navy)', marginBottom: '4px' }}>{stat.value}</div>
                <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Concept Cards */}
      <section style={{ padding: '100px 0' }}>
        <div className="pw">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 className="page-title" style={{ fontSize: '32px' }}>The Matchmaking Journey</h2>
            <p className="page-desc" style={{ maxWidth: '500px', margin: '8px auto 0' }}>Personalised research discovery for the next generation of healthcare pioneers.</p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '32px' 
          }}>
            {[
              {
                title: 'Discover Opportunities',
                desc: 'Browse a list of clinical problems at KMC seeking AI/ML engineering talent.',
                icon: Rocket,
                step: '01'
              },
              {
                title: 'Perfect Match',
                desc: 'Our portal suggests project matches based on your technical stacking and interests.',
                icon: Target,
                step: '02'
              },
              {
                title: 'High Impact',
                desc: 'Collaborate with PIs, gain authorship, and deploy your code into clinical workflows.',
                icon: Award,
                step: '03'
              }
            ].map((card, i) => (
              <div key={i} style={{ 
                background: '#fff', 
                padding: '40px', 
                borderRadius: '24px', 
                border: '1px solid var(--border)',
                transition: 'all 0.3s'
              }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  background: 'var(--bg)', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--navy)',
                  marginBottom: '24px'
                }}>
                  <card.icon size={24} />
                </div>
                <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Step {card.step}</div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--navy)', marginBottom: '16px' }}>{card.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '24px' }}>{card.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', color: 'var(--navy)', cursor: 'pointer' }}>
                  Get Started <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

