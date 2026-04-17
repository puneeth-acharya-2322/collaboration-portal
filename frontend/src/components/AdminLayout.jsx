import { useState, useEffect, useContext } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import AdminSubnav from './AdminSubnav';

export default function AdminLayout() {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [data, setData] = useState({ stats: null, pendingUsers: [], pendingProjects: [], allProjects: [], allFaculty: [], allRequests: [], deletionRequests: [], updateRequests: [] });
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchAdminData();
    
    // Live refreshing every 30 seconds
    const interval = setInterval(fetchAdminData, 30000);
    return () => clearInterval(interval);
  }, [user, token, navigate]);

  const handleAction = async (endpoint, id, action) => {
    try {
      const res = await fetch(`http://localhost:3001/api/admin/${endpoint}/${id}/${action}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchAdminData();
    } catch {}
  };

  if (loading) return <div className="pw empty-state">Loading Admin System...</div>;

  return (
    <>
      <AdminSubnav pendingCount={(data.pendingProjects?.length || 0) + (data.deletionRequests?.length || 0) + (data.updateRequests?.length || 0) + (data.pendingUsers?.length || 0)} />
      
      <div className="pw" style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', paddingTop: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Outlet context={{ data, fetchAdminData, handleAction }} />
        </div>
      </div>
    </>
  );
}
