import React from 'react';
import { X, Award, GraduationCap, Link2, BookOpen, Clock, Globe, Shield } from 'lucide-react';

export default function FacultyReviewModal({ user, onClose, onAction }) {
  if (!user) return null;

  const sections = [
    {
      title: 'A - Personal Information',
      items: [
        { label: 'Full Name', value: user.name },
        { label: 'Title', value: user.title || 'Dr.' },
        { label: 'Email', value: user.email },
        { label: 'Phone', value: user.phone || 'N/A' },
      ]
    },
    {
      title: 'B - Academic Identity',
      items: [
        { label: 'Designation', value: user.designation || 'N/A' },
        { label: 'Department', value: user.department || 'N/A' },
        { label: 'Institution', value: user.institution || 'MAHE, Manipal' },
        { label: 'Experience', value: user.experience || 'N/A' },
        { label: 'Scopus ID', value: user.scopusId || 'N/A' },
        { label: 'ORCID', value: user.orcid || 'N/A' },
        { label: 'h-Index', value: user.hIndex || '0' },
        { label: 'Publications', value: user.publications || '0' },
      ]
    },
    {
      title: 'C - Research Interests',
      items: [
        { label: 'Domains', value: Array.isArray(user.domain) ? user.domain.join(', ') : (user.domain || 'N/A') },
        { label: 'Technical Skills', value: Array.isArray(user.skills) ? user.skills.join(', ') : (user.skills || 'N/A') },
        { label: 'Collaboration Mode', value: user.collabMode || 'Hybrid' },
        { label: 'Availability', value: user.availability || 'N/A' },
      ]
    }
  ];

  const expertise = user.expertise || [];

  return (
    <div className="modal-bg" style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="modal" style={{ maxWidth: '800px', width: '90%' }}>
        <div className="modal-head">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="arb-badge">Profile Review</span>
            Verify Researcher: {user.name}
          </h3>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body" style={{ maxHeight: '80vh', overflowY: 'auto', padding: '1.5rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {sections.map((section, idx) => (
              <div key={idx} style={{ 
                border: '1px solid var(--border)', 
                borderRadius: '10px', 
                overflow: 'hidden',
                background: '#fff' 
              }}>
                <div style={{ 
                  background: '#f8fafc', 
                  padding: '0.75rem 1rem', 
                  fontSize: '11px', 
                  fontWeight: '700', 
                  color: 'var(--navy)', 
                  borderBottom: '1px solid var(--border)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {section.title}
                </div>
                <div style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem 2rem' }}>
                  {section.items.map((item, i) => (
                    <div key={i}>
                      <label style={{ display: 'block', fontSize: '10px', color: 'var(--muted)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
                        {item.label}
                      </label>
                      <div style={{ fontSize: '13px', color: 'var(--navy)', fontWeight: '500' }}>
                        {item.value || 'Not provided'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* D - Research Expertise */}
            <div style={{ border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', background: '#fff' }}>
              <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', fontSize: '11px', fontWeight: '700', color: 'var(--navy)', borderBottom: '1px solid var(--border)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                D - Research Expertise (FYRC Card)
              </div>
              <div style={{ padding: '1rem' }}>
                <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '1rem' }}>These points will appear on their public research card.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {expertise.length > 0 ? expertise.map((exp, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--navy)' }}>
                      <Award size={14} color="var(--gold)" /> {exp}
                    </div>
                  )) : <div style={{ color: 'var(--muted)', fontSize: '13px' }}>No expertise bullets provided.</div>}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <button 
              className="btn btn-gold" 
              style={{ flex: 1, justifyContent: 'center', padding: '12px' }}
              onClick={() => onAction('approve')}
            >
              Verify & Approve Faculty
            </button>
            <button 
              className="btn" 
              style={{ flex: 1, justifyContent: 'center', padding: '12px', color: 'var(--red)' }}
              onClick={() => onAction('reject')}
            >
              Reject Registration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
