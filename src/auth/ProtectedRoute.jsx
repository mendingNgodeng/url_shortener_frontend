import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) return <div className="text-center p-6">Loading...</div>;

  if (!token) return <Navigate to="/" replace />;

  return children;
}
