import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toastSuccess, toastError } from '../utils/toast.jsx';

export default function Register() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429) {
          const retry = data.retryAfter || 60;
          setError([
            `Terlalu banyak percobaan. Coba lagi dalam ${retry} detik.`,
          ]);
          toastError('Terlalu banyak request');
          return;
        }

        // VALIDATION ZOD
        if (data.errors) {
          const allErrors = Object.values(data.errors).flat();
          setError(allErrors);
          return;

          // ERROR LAIN
          setError([data.message || 'Register gagal']);
        }
        return;
      }

      setSuccess('Register berhasil! Silakan login.');
      toastSuccess('Register berhasil!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      toastSuccess('Register gagal!');
      setError('Gagal menghubungi server.');
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100 overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-700 
          animate-[gradientMove_8s_ease_infinite] bg-[length:300%_300%] opacity-60"
      ></div>

      <div className="relative bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        <form className="space-y-4" onSubmit={handleRegister}>
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error.length > 0 && (
            <div className="text-red-500 text-sm text-left space-y-1">
              {error.map((err, idx) => (
                <p key={idx}>• {err}</p>
              ))}
            </div>
          )}
          {success && (
            <p className="text-green-500 text-sm text-center">{success}</p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Sudah punya akun?{' '}
          <Link to="/" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </div>

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
