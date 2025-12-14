import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { toastSuccess, toastError } from '../utils/toast.jsx';
export default function Login() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { login } = useAuth();

  // console.log('API:', API_URL);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState([]);

  async function handleLogin(e) {
    e.preventDefault();
    setError([]);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      // RATE LIMIT
      if (res.status === 429) {
        const retry = data.retryAfter || 60;
        setError([`Terlalu banyak percobaan. Coba lagi dalam ${retry} detik.`]);
        toastError('Terlalu banyak request');
        return;
      }

      // VALIDATION
      if (!res.ok) {
        if (data.errors) {
          const allErrors = Object.values(data.errors).flat();
          setError(allErrors);
        } else {
          setError([data.error || 'Login gagal']);
        }
        return;
      }

      login(data.token);
      navigate('/dashboard');
      toastSuccess('Login berhasil!');
    } catch (err) {
      toastError('Terjadi kesalahan');
      setError(['Gagal menghubungi server']);
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100 overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-700 
        animate-[gradientMove_8s_ease_infinite] bg-[length:300%_300%] opacity-60"
      ></div>

      <div className="relative bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Email/Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />

          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Belum punya akun?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Daftar disini
          </Link>
        </p>
      </div>

      {/* animasi gradient */}
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
