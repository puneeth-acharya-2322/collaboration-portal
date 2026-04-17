import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess('Your account is under admin review. Once approved, you can log in.');
      setName('');
      setEmail('');
      setPassword('');
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
          Create an Account
        </h2>
        
        {error && (
          <div style={{ padding: '10px', background: 'var(--red-l)', color: 'var(--red)', borderRadius: '8px', marginBottom: '1rem', fontSize: '13px' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '10px', background: 'var(--green-l)', color: 'var(--green)', borderRadius: '8px', marginBottom: '1rem', fontSize: '13px' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Full Name</label>
            <input 
              type="text" 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'inherit' }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '13px' }}>
          Already registered? <Link to="/login" style={{ color: 'var(--navy)', fontWeight: 'bold' }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
