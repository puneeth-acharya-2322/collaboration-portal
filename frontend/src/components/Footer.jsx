import { MapPin, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="pw">
        <div className="footer-grid">
          {/* Brand column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div className="logo-box">K</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>
                FYRC · KMC Manipal
              </div>
            </div>
            <p className="footer-brand-desc">
              Bridging clinical experience with technical innovation. The premier platform for AI research matchmaking at Kasturba Medical College, Manipal.
            </p>
            <div className="footer-contact">
              <div className="footer-contact-item">
                <Mail size={14} style={{ color: 'var(--gold)' }} />
                <span>ai.healthcare@manipal.edu</span>
              </div>
              <div className="footer-contact-item">
                <MapPin size={14} style={{ color: 'var(--gold)' }} />
                <span>KMC Manipal, Karnataka — 576104</span>
              </div>
            </div>
          </div>

          {/* Opportunities column */}
          <div>
            <div className="footer-col-heading">Opportunities</div>
            <ul className="footer-links">
              <li><Link to="/">Browse Projects</Link></li>
              <li><Link to="/collaborators">Find Collaborators</Link></li>
              <li>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); alert('Register — coming in Step 2') }}
                >
                  Join as Faculty
                </a>
              </li>
            </ul>
          </div>

          {/* Institutional column */}
          <div>
            <div className="footer-col-heading">Institutional</div>
            <ul className="footer-links">
              <li><a href="https://manipal.edu" target="_blank" rel="noreferrer">MAHE Manipal</a></li>
              <li><a href="https://manipal.edu/kmc" target="_blank" rel="noreferrer">KMC Excellence</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Ethics Policy</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>IRB Guidelines</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="footer-bottom">
          <div style={{ fontStyle: 'italic' }}>Developed by the Department of AI in Healthcare</div>
          <div>© {new Date().getFullYear()} KMC Manipal. All Rights Reserved.</div>
        </div>
      </div>
    </footer>
  )
}
