import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toastSuccess, toastInfo, toastError } from '../utils/toast.jsx';
import { useAuth } from '../auth/AuthContext.jsx';
export default function LinkModal({ isOpen, onClose, onCreated }) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [expirationDate, setExpirationDate] = useState('');

  const [globalError, setGlobalError] = useState('');
  const [errors, setErrors] = useState({});
  const API_URL = import.meta.env.VITE_API_URL;

  const { token, user } = useAuth();

  const userId = user.id;
  // const role = localStorage.getItem('role');
  // const url =
  //   user.role === 'admin' ? `${API_URL}/urls/admin/${userId}` : `${API_URL}/urls`;

  if (!isOpen) return null;

  const handleCreate = async () => {
    setErrors({});
    setGlobalError('');
    try {
      const res = await fetch(`${API_URL}/urls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          originalUrl,
          shortCode: shortCode,
          expirationDate: expirationDate ? new Date(expirationDate + 'Z') : '',
        }),
      });

      const data = await res.json();

      if (res.status === 429) {
        toastError(
          `Terlalu sering membuat URL! Coba lagi dalam ${data.retryAfter}s`
        );
        return;
      }

      // error dari ZOD (status 400)
      if (res.status === 400) {
        if (data.errors) {
          // Error dari Zod
          setErrors(data.errors);
        } else if (data.message) {
          // Error custom backend (blocked URL)
          setGlobalError(data.message);
        }
        return;
      }

      // error duplicate shortCode (status 409)
      if (res.status === 409) {
        setGlobalError(data.message);
        return;
      }

      if (!res.ok) {
        // backend mengirim { errors: {...} }
        setErrors(data.errors || {});
        return;
      }

      // SUCCESS
      if (onCreated) onCreated(data); // ini nanti update table
      toastSuccess('URL ditambahkan!');
      onClose();
    } catch (err) {
      toastError('URL gagal ditambahkan!');
      console.error(err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#1F2937] rounded-xl p-6 w-full max-w-md shadow-xl border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-6 text-white tracking-wide">
          Create New Short URL
        </h2>

        {/* ORIGINAL URL */}
        <input
          type="text"
          placeholder="Enter long URL"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          className="w-full bg-[#111827] text-gray-200 border border-gray-700 px-3 py-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        {errors.originalUrl && (
          <p className="text-red-400 text-sm mb-2">
            {errors.originalUrl.join(', ')}
          </p>
        )}

        {/* SHORTCODE */}
        <input
          type="text"
          placeholder="ShortCode"
          value={shortCode}
          onChange={(e) => setShortCode(e.target.value)}
          className="w-full bg-[#111827] text-gray-200 border border-gray-700 px-3 py-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        {errors.shortCode && (
          <p className="text-red-400 text-sm mb-2">
            {errors.shortCode.join(', ')}
          </p>
        )}
        {globalError && (
          <p className="text-red-400 text-sm mb-4">{globalError}</p>
        )}

        {/* EXPIRATION DATE */}
        <input
          type="datetime-local"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          className="w-full bg-[#111827] text-gray-200 border border-gray-700 px-3 py-3 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        {errors.expirationDate && (
          <p className="text-red-400 text-sm mb-2">
            {errors.expirationDate.join(', ')}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            className="px-5 py-2 rounded-lg bg-cyan-600 text-white font-semibold hover:bg-cyan-700 transition"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
