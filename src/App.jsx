import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import Shortener from './pages/shortener';
import History from './pages/history';
import Analytics from './pages/analytics';
import Profile from './pages/profile';
import ProtectedRoute from './auth/ProtectedRoute';
import { AuthProvider } from './auth/AuthContext';
import ShortenedAdmin from './pages/shortenerAdminOwn';
import Notfound from './pages/notfound';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Notfound />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shortener"
            element={
              <ProtectedRoute>
                <Shortener />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shortenerAdminOwn"
            element={
              <ProtectedRoute>
                <ShortenedAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
       
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
