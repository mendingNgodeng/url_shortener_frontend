import { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';
import { useAuth } from '../auth/AuthContext';

export default function Dashboard() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token, user } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    topLink: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await fetch(`${API_URL}/urls`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!Array.isArray(data)) return;

      const totalLinks = data.length;
      const totalClicks = data.reduce((acc, item) => acc + item.clicks, 0);
      const topLink = data.length
        ? data.reduce((max, item) => (item.clicks > max.clicks ? item : max))
        : null;

      setStats({ totalLinks, totalClicks, topLink });
    } catch (err) {
      console.error('Gagal fetch dashboard:', err);
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E3A8A]">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1">
        <Navbar setSidebarOpen={setSidebarOpen} />

        <div className="p-6">
          {/* TITLE */}
          <h1 className="text-3xl font-bold mb-2 text-white">Dashboard</h1>
          <p className="text-gray-300 mb-6">
            {user?.role === 'admin'
              ? 'Ringkasan aktivitas semua user'
              : 'Ringkasan aktivitas kamu'}
          </p>

          {/* STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Links */}
            <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-700 flex items-center gap-4">
              <div className="bg-blue-600 text-white p-3 rounded-full shadow text-xl">
                🔗
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Link Dibuat</p>
                <h2 className="text-2xl font-semibold text-blue-400">
                  {stats.totalLinks}
                </h2>
              </div>
            </div>

            {/* Total Clicks */}
            <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-700 flex items-center gap-4">
              <div className="bg-emerald-600 text-white p-3 rounded-full shadow text-xl">
                👁️
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Klik</p>
                <h2 className="text-2xl font-semibold text-emerald-400">
                  {stats.totalClicks}
                </h2>
              </div>
            </div>

            {/* Top Link */}
            <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-700 flex items-center gap-4">
              <div className="bg-yellow-600 text-white p-3 rounded-full shadow text-xl">
                ⭐
              </div>
              <div>
                <p className="text-gray-400 text-sm">Link Favorit</p>
                <h2 className="text-lg font-semibold text-yellow-400">
                  {stats.topLink ? stats.topLink.alias : 'Tidak ada'}
                </h2>
              </div>
            </div>
          </div>

          {/* EXTRA: Aktivitas Terbaru */}
          <div className="mt-8 bg-gray-900/60 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Aktivitas Terbaru
            </h3>
            <ul className="space-y-3 text-gray-300">
              {stats.topLink ? (
                <>
                  <li>• Kamu membuat {stats.totalLinks} link</li>
                  <li>• Total klik {stats.totalClicks}</li>
                  <li>
                    • Link paling populer:
                    <span className="text-blue-400 font-medium">
                      {' '}
                      {stats.topLink.alias}
                    </span>
                  </li>
                </>
              ) : (
                <li>Belum ada aktivitas</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
