import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Decode Token
  const decode = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  };

  // Cek expired
  const isExpired = (payload) => payload.exp * 1000 < Date.now();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const payload = decode(token);

    if (!payload || isExpired(payload)) {
      logout();
      setLoading(false);
      return;
    }

    // Set user dari token
    setUser({
      id: payload.id,
      username: payload.username,
      role: payload.role,
      email: payload.email,
    });

    setLoading(false);

    // Auto cek expired tiap 30 detik
    const interval = setInterval(() => {
      const payload = decode(token);
      if (!payload || isExpired(payload)) logout();
    }, 30000);

    return () => clearInterval(interval);
  }, [token]);

  const login = (jwt) => {
    localStorage.setItem('token', jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
