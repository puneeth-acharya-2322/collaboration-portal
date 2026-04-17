import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      login(data.token, data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pw" style={{ maxWidth: '400px', marginTop: '3rem', marginBottom: '3rem' }}>
      <div className="sidebar" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '20px', color: 'var(--navy)', marginBottom: '1.5rem', textAlign: 'center' }}>
          Welcome back
        </h2>
        
        {error && (
          <div style={{ padding: '10px', background: 'var(--red-l)', color: 'var(--red)', borderRadius: '8px', marginBottom: '1rem', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Email</label>
            <input 
              type="email" 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'inherit' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Password</label>
            <input 
              type="password" 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'inherit' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: '10px', padding: '12px' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '13px' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--navy)', fontWeight: 'bold' }}>Register</Link>
        </div>
      </div>
    </div>
  );
}
