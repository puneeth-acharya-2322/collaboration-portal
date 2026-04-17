import { useContext, useState, useEffect } from 'react';
import { Edit2, Microscope, Calendar, Search, BarChart2, Settings, Lock, LogOut } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EditableField = ({ label, name, val, isEdit, onChange, isTeal }) => (
  <div>
    <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '4px', textTransform: 'uppercase' }}>{label}</div>
    {isEdit ? (
      <input type="text" name={name} value={val} onChange={onChange} style={{ width: '100%', padding: '4px 0', border: 'none', borderBottom: '1px solid var(--border)', fontSize: '13px', color: 'var(--navy)', outline: 'none', background: 'transparent' }} />
    ) : (
      <div style={{ color: isTeal ? 'var(--teal)' : 'var(--navy)', fontWeight: 500 }}>{val || '—'}</div>
    )}
  </div>
);

const ToggleSwitch = ({ label, checked, onChange, isEdit }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div style={{ color: 'var(--navy)' }}>{label}</div>
    {isEdit ? (
      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <input type="checkbox" checked={checked} onChange={onChange} style={{ marginRight: '8px', cursor: 'pointer', accentColor: 'var(--teal)' }} />
      </label>
    ) : (
      <div style={{ width: '36px', height: '20px', background: checked ? 'var(--green)' : 'var(--border)', borderRadius: '10px', position: 'relative' }}>
        <div style={{ width: '16px', height: '16px', background: '#fff', borderRadius: '50%', position: 'absolute', [checked ? 'right' : 'left']: '2px', top: '2px', transition: 'all 0.2s' }}></div>
      </div>
    )}
  </div>
);

export default function Profile() {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState({ A: false, B: false, C: false, D: false, E: false });
  const [formData, setFormData] = useState({
    name: user?.name || 'Dr. Anitha Rao',
    title: 'Dr.',
    email: user?.email || 'anitha.rao@manipal.edu',
    phone: '+91 98765 43210',
    designation: 'Assistant Professor',
    department: 'AI in Healthcare, KMC',
    institution: 'MAHE, Manipal',
    experience: '6-10 years',
    scopus: '57200412888',
    orcid: '0000-0002-1234-5678',
    hindex: '8',
    pubs: '24',
    domains: 'Medical Imaging, NLP in Healthcare, Federated Learning',
    skills: 'Python, PyTorch, DICOM, FHIR',
    collabMode: 'Hybrid',
    availability: 'Available · Mon/Wed 4–5:30 PM',
    expertise: 'Medical image analysis using CNNs, Clinical NLP and EHR data mining, Federated learning in healthcare',
    vis: 'All FYRC researchers',
    notif1: true,
    notif2: true,
    notif3: false
  });

  useEffect(() => {
    // Optionally fetch if backend supports full schema...
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/user/profile', { headers: { Authorization: `Bearer ${token}` }});
        const data = await res.json();
        if (data.success && data.data) {
          // Initialize DB properties
          setFormData(prev => ({
            ...prev,
            name: data.data.name || prev.name,
            department: data.data.department || prev.department,
            designation: data.data.designation || prev.designation,
            institution: data.data.institution || prev.institution,
            skills: data.data.skills?.join(', ') || prev.skills,
            domains: data.data.domain?.join(', ') || prev.domains
          }));
        }
      } catch (e) {}
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleEdit = async (card) => {
    if (editMode[card]) {
      // Save is clicked
      setEditMode({ ...editMode, [card]: false });
      
      // Build payload based on actual backend schema map
      const payload = {
        name: formData.name,
        department: formData.department,
        designation: formData.designation,
        institution: formData.institution,
        skills: formData.skills.split(',').map(s=>s.trim()).filter(Boolean),
        domain: formData.domains.split(',').map(s=>s.trim()).filter(Boolean)
      };

      try {
        await fetch('http://localhost:3001/api/user/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
      } catch (e) {}
    } else {
      setEditMode({ ...editMode, [card]: true });
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  };

  const initials = getInitials(formData.name);

  return (
    <div className="pw">
      <div className="split" style={{ alignItems: 'flex-start', paddingTop: '1.5rem' }}>
        
        {/* Left Column */}
        <div style={{ width: '100%' }}>
          
          {/* Identity Card */}
          <div style={{ background: 'var(--navy)', borderRadius: '12px 12px 0 0', padding: '2rem 1rem', textAlign: 'center', color: '#fff' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--gold)', color: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700, margin: '0 auto 1rem' }}>
              {initials}
            </div>
            <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '2px' }}>{formData.name}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '10px' }}>FYRC-2026-0042</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.15)', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 500 }}>
              ✓ Verified
            </div>
          </div>
          
          {/* Sidebar Menu */}
          <div style={{ background: '#fff', border: '.5px solid var(--border)', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>MANAGE YOUR PROFILE</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div onClick={() => setEditMode({...editMode, A: true})} style={{ color: 'var(--navy)', display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' }}><Edit2 size={15} color="var(--gold)" /> Edit personal info</div>
              <div onClick={() => setEditMode({...editMode, B: true, C: true})} style={{ color: 'var(--navy)', display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' }}><Microscope size={15} color="var(--navy)" /> Edit research expertise</div>
              <div onClick={() => setEditMode({...editMode, C: true})} style={{ color: 'var(--navy)', display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' }}><Calendar size={15} color="var(--gold)" /> Edit availability calendar</div>
              <div style={{ color: 'var(--navy)', display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' }}><Search size={15} color="var(--navy)" /> View FYRC card preview</div>
              <div style={{ color: 'var(--navy)', display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' }}><BarChart2 size={15} color="var(--gold)" /> View profile stats</div>
              
              <hr style={{ border: 'none', borderTop: '.5px solid var(--border)', margin: '4px 0' }}/>
              
              <div onClick={() => setEditMode({...editMode, E: true})} style={{ color: 'var(--navy)', display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' }}><Settings size={15} color="var(--muted)" /> Account settings</div>
              <div style={{ color: 'var(--navy)', display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' }}><Lock size={15} color="var(--navy)" /> Privacy options</div>
              <div onClick={handleLogout} style={{ color: 'var(--red)', fontWeight: 500, display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px', cursor: 'pointer' }}><LogOut size={15} color="var(--red)" /> Logout</div>
            </div>
          </div>

          {/* Activity Summary */}
          <div style={{ background: '#fff', border: '.5px solid var(--border)', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>ACTIVITY SUMMARY</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ background: '#f8fafc', padding: '12px 8px', borderRadius: '6px', textAlign: 'center', border: '.5px solid var(--border)' }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>4</div>
                <div style={{ fontSize: '10px', color: 'var(--muted)' }}>Applications sent</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px 8px', borderRadius: '6px', textAlign: 'center', border: '.5px solid var(--border)' }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--teal)', marginBottom: '4px' }}>2</div>
                <div style={{ fontSize: '10px', color: 'var(--muted)' }}>Projects posted</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px 8px', borderRadius: '6px', textAlign: 'center', border: '.5px solid var(--border)' }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--amber)', marginBottom: '4px' }}>7</div>
                <div style={{ fontSize: '10px', color: 'var(--muted)' }}>Profile views</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px 8px', borderRadius: '6px', textAlign: 'center', border: '.5px solid var(--border)' }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--green)', marginBottom: '4px' }}>1</div>
                <div style={{ fontSize: '10px', color: 'var(--muted)' }}>FYRC card active</div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Setting Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Card A */}
          <div style={{ background: '#fff', border: '.5px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '.05em' }}>A · PERSONAL INFORMATION</div>
              <div onClick={() => toggleEdit('A')} style={{ fontSize: '11px', color: editMode.A ? 'var(--green)' : 'var(--navy)', cursor: 'pointer', fontWeight: 600 }}>
                {editMode.A ? 'Save' : 'Edit'}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem', fontSize: '13px' }}>
              <EditableField label="FULL NAME" name="name" val={formData.name} isEdit={editMode.A} onChange={handleChange} />
              <EditableField label="TITLE" name="title" val={formData.title} isEdit={editMode.A} onChange={handleChange} />
              <EditableField label="EMAIL" name="email" val={formData.email} isEdit={editMode.A} onChange={handleChange} />
              <EditableField label="PHONE" name="phone" val={formData.phone} isEdit={editMode.A} onChange={handleChange} />
            </div>
          </div>

          {/* Card B */}
          <div style={{ background: '#fff', border: '.5px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '.05em' }}>B · ACADEMIC IDENTITY</div>
              <div onClick={() => toggleEdit('B')} style={{ fontSize: '11px', color: editMode.B ? 'var(--green)' : 'var(--teal)', cursor: 'pointer', fontWeight: 500 }}>
                {editMode.B ? 'Save' : 'Edit'}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem', fontSize: '13px' }}>
              <EditableField label="DESIGNATION" name="designation" val={formData.designation} isEdit={editMode.B} onChange={handleChange} />
              <EditableField label="DEPARTMENT" name="department" val={formData.department} isEdit={editMode.B} onChange={handleChange} />
              <EditableField label="INSTITUTION" name="institution" val={formData.institution} isEdit={editMode.B} onChange={handleChange} />
              <EditableField label="EXPERIENCE" name="experience" val={formData.experience} isEdit={editMode.B} onChange={handleChange} />
              <EditableField label="SCOPUS ID" name="scopus" val={formData.scopus} isEdit={editMode.B} onChange={handleChange} isTeal />
              <EditableField label="ORCID" name="orcid" val={formData.orcid} isEdit={editMode.B} onChange={handleChange} isTeal />
              <EditableField label="H-INDEX" name="hindex" val={formData.hindex} isEdit={editMode.B} onChange={handleChange} />
              <EditableField label="PUBLICATIONS" name="pubs" val={formData.pubs} isEdit={editMode.B} onChange={handleChange} />
            </div>
          </div>

          {/* Card C */}
          <div style={{ background: '#fff', border: '.5px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '.05em' }}>C · RESEARCH INTERESTS</div>
              <div onClick={() => toggleEdit('C')} style={{ fontSize: '11px', color: editMode.C ? 'var(--green)' : 'var(--teal)', cursor: 'pointer', fontWeight: 500 }}>
                {editMode.C ? 'Save' : 'Edit'}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '13px' }}>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '8px', textTransform: 'uppercase' }}>DOMAINS</div>
                {editMode.C ? (
                  <input type="text" name="domains" value={formData.domains} onChange={handleChange} style={{ width: '100%', padding: '4px 0', border: 'none', borderBottom: '1px solid var(--border)', fontSize: '13px', color: 'var(--navy)', outline: 'none' }} />
                ) : (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {formData.domains.split(',').map((d,i) => d.trim() && (
                      <span key={i} style={{ padding: '4px 10px', background: '#eff6ff', color: '#1e40af', borderRadius: '4px', fontSize: '11px', fontWeight: 500 }}>{d.trim()}</span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '8px', textTransform: 'uppercase' }}>TECHNICAL SKILLS</div>
                {editMode.C ? (
                  <input type="text" name="skills" value={formData.skills} onChange={handleChange} style={{ width: '100%', padding: '4px 0', border: 'none', borderBottom: '1px solid var(--border)', fontSize: '13px', color: 'var(--navy)', outline: 'none' }} />
                ) : (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {formData.skills.split(',').map((s,i) => s.trim() && (
                      <span key={i} style={{ padding: '4px 10px', background: '#f3e8ff', color: '#6b21a8', borderRadius: '4px', fontSize: '11px', fontWeight: 500 }}>{s.trim()}</span>
                    ))}
                  </div>
                )}
              </div>
              <EditableField label="COLLABORATION MODE" name="collabMode" val={formData.collabMode} isEdit={editMode.C} onChange={handleChange} />
              
              <div>
                <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '4px', textTransform: 'uppercase' }}>AVAILABILITY</div>
                {editMode.C ? (
                  <input type="text" name="availability" value={formData.availability} onChange={handleChange} style={{ width: '100%', padding: '4px 0', border: 'none', borderBottom: '1px solid var(--border)', fontSize: '13px', color: 'var(--navy)', outline: 'none' }} />
                ) : (
                  <div style={{ color: 'var(--green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '16px', lineHeight: 0 }}>•</span> {formData.availability}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card D */}
          <div style={{ background: '#fff', border: '.5px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '.05em' }}>D · RESEARCH EXPERTISE (FYRC CARD)</div>
              <div onClick={() => toggleEdit('D')} style={{ fontSize: '11px', color: editMode.D ? 'var(--green)' : 'var(--teal)', cursor: 'pointer', fontWeight: 500 }}>
                {editMode.D ? 'Save' : 'Edit'}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>These appear on your public FYRC card.</div>
              {editMode.D ? (
                <textarea name="expertise" value={formData.expertise} onChange={handleChange} rows={4} style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '13px', color: 'var(--navy)', outline: 'none', resize: 'vertical' }} />
              ) : (
                formData.expertise.split(',').map((e,i) => e.trim() && (
                  <div key={i} style={{ color: 'var(--navy)', fontWeight: 500 }}>✓ {e.trim()}</div>
                ))
              )}
            </div>
          </div>

          {/* Card E Account Settings */}
          <div style={{ background: '#fff', border: '.5px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '.05em' }}>E · ACCOUNT SETTINGS</div>
              <div onClick={() => toggleEdit('E')} style={{ fontSize: '11px', color: editMode.E ? 'var(--green)' : 'var(--teal)', cursor: 'pointer', fontWeight: 500 }}>
                {editMode.E ? 'Save' : 'Edit'}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '13px' }}>
              <EditableField label="PROFILE VISIBILITY" name="vis" val={formData.vis} isEdit={editMode.E} onChange={handleChange} />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <ToggleSwitch label="New collaboration request alerts" checked={formData.notif1} onChange={handleChange} name="notif1" isEdit={editMode.E} />
                <ToggleSwitch label="New match notifications" checked={formData.notif2} onChange={handleChange} name="notif2" isEdit={editMode.E} />
                <ToggleSwitch label="Weekly digest" checked={formData.notif3} onChange={handleChange} name="notif3" isEdit={editMode.E} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
