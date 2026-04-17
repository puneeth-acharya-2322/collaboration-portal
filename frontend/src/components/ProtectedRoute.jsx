import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="empty-state">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is pending, they shouldn't generally be able to login,
  // but if they somehow get here, redirect to out or show message.
  if (user.status === 'pending') {
    return <div className="empty-state">Your account is pending admin approval. Please wait. <br /> <button className="btn" onClick={() => { localStorage.clear(); window.location='/'; }}>Logout</button></div>;
  }

  return children;
}
