import React from 'react';
import { X } from 'lucide-react';

export default function ComparisonModal({ project, onClose, onAction }) {
  const current = project;
  const updates = project.pendingUpdates;
  if (!updates || Object.keys(updates).length === 0) {
    return (
      <div className="modal-bg" style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
        <div className="modal" style={{ maxWidth: '500px', width: '90%' }}>
          <div className="modal-head">
            <h3>Update Data Missing</h3>
            <button className="modal-close" onClick={onClose}><X size={20} /></button>
          </div>
          <div className="modal-body" style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>This project was flagged for an update, but no modified data was found. You may want to Reject this request to clear the queue.</p>
            <button className="btn" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  const fields = [
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    { key: 'domain', label: 'Domain' },
    { key: 'skills', label: 'Required Skills' },
    { key: 'status', label: 'Project Status' },
    { key: 'visibility', label: 'Visibility' }
  ];

  const formatVal = (val) => {
    if (Array.isArray(val)) return val.join(', ');
    return String(val);
  };

  return (
    <div className="modal-bg" style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="modal" style={{ maxWidth: '900px', width: '90%' }}>
        <div className="modal-head">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="arb-badge">Edit Review</span>
            Comparing Changes for: {current.title}
          </h3>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <div className="diff-grid">
            <div className="diff-label" style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '13px' }}>Current Live Version</div>
            <div className="diff-label" style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '13px' }}>Proposed Updates</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
            {fields.map(field => {
              const oldVal = formatVal(current[field.key]);
              const newVal = formatVal(updates[field.key] ?? current[field.key]);
              const isChanged = oldVal !== newVal;

              return (
                <div key={field.key} className="diff-item">
                  <span className="diff-label">{field.label}</span>
                  <div className="diff-grid" style={{ marginTop: '0.25rem' }}>
                    <div className="diff-card">{oldVal}</div>
                    <div className={`diff-card ${isChanged ? 'diff-changed' : ''}`}>
                      {newVal}
                      {isChanged && <div style={{ fontSize: '10px', marginTop: '4px', fontWeight: 'bold' }}>CHANGED</div>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <button 
              className="btn btn-gold" 
              style={{ flex: 1, justifyContent: 'center', padding: '12px' }}
              onClick={() => onAction('approve')}
            >
              Approve & Apply Changes
            </button>
            <button 
              className="btn" 
              style={{ flex: 1, justifyContent: 'center', padding: '12px' }}
              onClick={() => onAction('reject')}
            >
              Reject Edits
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
