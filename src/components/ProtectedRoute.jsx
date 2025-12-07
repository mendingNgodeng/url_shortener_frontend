import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    // jika tidak ada token throw lempar ke login
    return <Navigate to="/" replace />;
  }
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.removeItem('token');
      return <Navigate to="/" replace />;
    }
  } catch (err) {
    localStorage.removeItem('token');
    return <Navigate to="/" replace />;
  }

  return children;
}
