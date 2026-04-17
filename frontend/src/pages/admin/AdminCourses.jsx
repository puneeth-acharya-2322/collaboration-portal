import { BookOpen } from 'lucide-react';

export default function AdminCourses() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ fontSize: '24px', marginBottom: '8px' }}>Course Management</h1>
        <p className="page-desc">Integrate elective courses with research projects to enable credit-based collaboration.</p>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', padding: '5rem 3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <BookOpen size={32} color="#64748b" />
        </div>
        <h3 style={{ fontSize: '20px', color: 'var(--navy)', marginBottom: '12px' }}>Course Integration System</h3>
        <p style={{ color: '#64748b', maxWidth: '500px', margin: '0 auto 2rem', fontSize: '15px', lineHeight: 1.6 }}>
          Automatically link registered elective courses with verified research projects. 
          Students applying for these projects can receive research credits directly through the portal.
        </p>
        <button className="btn btn-gold" style={{ fontSize: '13px', padding: '10px 24px' }}>Configure Course Catalog</button>
      </div>
    </div>
  );
}
