export default function StatsCard({ title, value, colorClass }) {
  // Pass colorClass like 'var(--teal)'
  return (
    <div className="sidebar" style={{ padding: '1.5rem', textAlign: 'center' }}>
      <div style={{ fontSize: '24px', fontWeight: '700', color: colorClass || 'var(--navy)' }}>{value}</div>
      <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>{title}</div>
    </div>
  );
}
