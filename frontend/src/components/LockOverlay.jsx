import { Link } from 'react-router-dom'
import { Lock, ArrowRight } from 'lucide-react'

export default function LockOverlay() {
  return (
    <div className="lock-wrapper" style={{ margin: '.75rem 0' }}>
      {/* Ghost project cards (blurred) */}
      <div className="lock-blurred" aria-hidden="true">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="project-card"
            style={{ marginBottom: '.75rem', height: '160px' }}
          />
        ))}
      </div>

      {/* The overlay */}
      <div className="lock-overlay" role="complementary" aria-label="Login required">
        <div className="lock-icon-big">🔒</div>
        <div className="lock-title">
          Login or Register to continue exploring
        </div>
        <div className="lock-sub">
          You are viewing public projects only. Create a free account to unlock all projects,
          see your personalised match score, and apply to collaborate.
        </div>
        <Link
          to="/register"
          className="lock-cta-btn"
          style={{ textDecoration: 'none' }}
        >
          Create free account <ArrowRight size={15} />
        </Link>
        <Link
          to="/login"
          className="lock-small"
          style={{ textDecoration: 'none' }}
        >
          <Lock size={11} />
          Already registered? Sign in
        </Link>
      </div>
    </div>
  )
}
