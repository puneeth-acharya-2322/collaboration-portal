import { useState } from 'react';

export default function ProjectForm({ initialData = {}, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    domain: initialData.domain || 'Medical Imaging',
    skills: initialData.skills?.join(', ') || '',
    status: initialData.status || 'upcoming',
    visibility: initialData.isPublic === undefined ? 'public' : (initialData.isPublic ? 'public' : 'private'),
    perks: initialData.perks?.join(', ') || '',
    hoursPerWeek: initialData.hoursPerWeek || 10
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const submitWrapper = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      perks: formData.perks.split(',').map(p => p.trim()).filter(Boolean),
      hoursPerWeek: parseInt(formData.hoursPerWeek) || 0,
      visibility: formData.visibility
    });
  };

  return (
    <form onSubmit={submitWrapper} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Project Title</label>
        <input type="text" name="title" required value={formData.title} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }} />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Description</label>
        <textarea name="description" required rows="4" value={formData.description} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}></textarea>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Domain</label>
          <select name="domain" value={formData.domain} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <option>Medical Imaging</option>
            <option>NLP in Healthcare</option>
            <option>Predictive Analytics</option>
            <option>Federated Learning</option>
            <option>Genomics</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Status</label>
          <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Skills Needed (comma separated)</label>
        <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g. Python, PyTorch, SQL" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }} />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Perks (comma separated)</label>
        <input type="text" name="perks" value={formData.perks} onChange={handleChange} placeholder="e.g. Co-authorship, LoR" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Visibility</label>
          <select name="visibility" value={formData.visibility} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <option value="public">Public</option>
            <option value="private">Private (Department Only)</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Hours/Week</label>
          <input type="number" name="hoursPerWeek" value={formData.hoursPerWeek} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }} />
        </div>
      </div>

      <button type="submit" className="btn btn-gold" disabled={loading} style={{ justifyContent: 'center', padding: '12px' }}>
        {loading ? 'Submitting...' : 'Save & Submit for Approval'}
      </button>
    </form>
  );
}
