import { useState } from 'react';
import { X } from 'lucide-react';

export default function CollaborateModal({ project, onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    message: '',
    skills: '',
    experience: '',
    availability: '10 hrs/week'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setSubmitting(true);
    await onSubmit({
      projectId: project.id,
      message: formData.message,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      experience: formData.experience,
      availability: formData.availability
    });
    setSubmitting(false);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000, 
      background: 'rgba(11,26,44,.52)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div className="sidebar" style={{
        width: '100%', maxWidth: '500px', background: '#fff', 
        position: 'relative', overflow: 'hidden'
      }}>
        <div className="sb-header" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '15px' }}>Apply to Collaborate</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '14px', color: 'var(--navy)', marginBottom: '4px' }}>{project.title}</h3>
          <p style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '1.5rem' }}>
            PI: {project.pi.name} • {project.domain}
          </p>

          <div style={{ display: 'flex', gap: '5px', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1, height: '4px', background: step >= 1 ? 'var(--teal)' : 'var(--teal-l)', borderRadius: '2px' }}></div>
            <div style={{ flex: 1, height: '4px', background: step >= 2 ? 'var(--teal)' : 'var(--teal-l)', borderRadius: '2px' }}></div>
            <div style={{ flex: 1, height: '4px', background: step >= 3 ? 'var(--teal)' : 'var(--teal-l)', borderRadius: '2px' }}></div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {step === 1 && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Why are you interested in this project?</label>
                <textarea 
                  required rows="5" name="message" value={formData.message} 
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                  placeholder="Tell the PI why you are a good fit..."
                ></textarea>
              </div>
            )}

            {step === 2 && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Relevant Skills (comma separated)</label>
                  <input type="text" required name="skills" value={formData.skills} 
                    onChange={e => setFormData({ ...formData, skills: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                    placeholder="e.g. PyTorch, Clinical Research" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Short Experience Summary / Institution</label>
                  <input type="text" required name="experience" value={formData.experience} 
                    onChange={e => setFormData({ ...formData, experience: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                    placeholder="e.g. 2nd Year MD Student, KMC" />
                </div>
              </>
            )}

            {step === 3 && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Time Commitment Availability</label>
                <select name="availability" value={formData.availability} 
                    onChange={e => setFormData({ ...formData, availability: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <option>Up to 5 hrs/week</option>
                  <option>10 hrs/week</option>
                  <option>15+ hrs/week</option>
                </select>
                <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '8px', lineHeight: '1.5' }}>
                  By submitting this request, your profile and matched skills will be sent to the PI for review.
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)} className="btn">Back</button>
              )}
              <button type="submit" className="btn btn-gold" disabled={submitting} style={{ flex: 1, justifyContent: 'center' }}>
                {step < 3 ? 'Next Step' : submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
