import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

import ProjectForm from '../components/ProjectForm';

export default function AddProject() {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (projectData) => {
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...projectData,
        pi: { name: user?.name || "Current User", dept: "TBD" }
      };

      const res = await fetch('http://localhost:3001/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Failed to submit');
      
      navigate('/dashboard/projects', { state: { message: 'Project submitted for approval!' } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pw">
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '1.5rem', paddingBottom: '4rem' }}>
        <h1 className="page-title">Add New Project</h1>
        <p className="page-desc">Submit a new research project. It will remain pending until approved by the admin.</p>

        <div className="sidebar" style={{ padding: '2rem' }}>
          {error && <div style={{ color: 'var(--red)', marginBottom: '1rem' }}>{error}</div>}
          <ProjectForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
}
