import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ProjectForm from '../components/ProjectForm';

export default function EditProject() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [projectData, setProjectData] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/projects/my-projects', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          const proj = data.data.find(p => p.id === id);
          if (proj) setProjectData(proj);
          else setError('Project not found');
        }
      } catch (err) {
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, token]);

  const handleSubmit = async (updatedData) => {
    setSaving(true);
    setError('');

    try {
      const payload = {
        ...updatedData,
        approvalStatus: 'pending_approval' // Edits require re-approval
      };

      const res = await fetch(`http://localhost:3001/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Failed to sync edit');
      
      navigate('/dashboard/projects', { state: { message: 'Project edited and re-submitted for approval!' } });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pw">
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '1.5rem', paddingBottom: '4rem' }}>
        <h1 className="page-title">Edit Project</h1>
        <p className="page-desc">Updating to a live project will trigger a new admin approval review.</p>

        <div className="sidebar" style={{ padding: '2rem' }}>
          {error && <div style={{ color: 'var(--red)', marginBottom: '1rem' }}>{error}</div>}
          {loading ? (
            <div className="empty-state">Loading project details...</div>
          ) : projectData ? (
            <ProjectForm initialData={projectData} onSubmit={handleSubmit} loading={saving} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
