import { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';
import { useAuth } from '../auth/AuthContext';

export default function Dashboard() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token, user } = useAuth();
  const [adminUrls, setAdminUrls] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    topLink: null,
  });

  // 🆕 khusus admin
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    fetchData();
    if (user?.role === 'admin') {
      fetchUserCount(); // hanya admin panggil ini
      fetchAdminUrls();
    }
  }, []);

  async function fetchData() {
    try {
      const res = await fetch(`${API_URL}/urls`, {
        headers: { Authorization: `Bearer ${token}` },
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

  // fetch total user untuk admin saja
  async function fetchUserCount() {
    try {
      const res = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (Array.isArray(data)) {
        setTotalUsers(data.length);
      }
    } catch (err) {
      console.error('Gagal fetch jumlah user:', err);
    }
  }

  // for admin data
  async function fetchAdminUrls() {
    try {
      const res = await fetch(`${API_URL}/urls/admin/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setAdminUrls(data);
      }
    } catch (err) {
      console.error('Gagal fetch URL admin:', err);
    }
  }

  // statistic for admin
  const adminTotalLinks = adminUrls.length;

  const adminTotalClicks = adminUrls.reduce(
    (acc, item) => acc + item.clicks,
    0
  );

  const adminTopLink =
    adminUrls.length > 0
      ? adminUrls.reduce((max, item) => (item.clicks > max.clicks ? item : max))
      : null;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E3A8A]">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1">
        <Navbar setSidebarOpen={setSidebarOpen} />

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2 text-white">Dashboard</h1>

          <p className="text-gray-300 mb-6">
            {user?.role === 'admin'
              ? 'Ringkasan aktivitas semua user'
              : 'Ringkasan aktivitas kamu'}
          </p>

          {/* GRID STAT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Admin: jumlah user */}
            {user?.role === 'admin' && (
              <div className=" p-6 rounded-xl border border-purple-600 flex items-center gap-4">
                <div className="bg-purple-600 text-white p-3 rounded-full shadow text-xl">
                  👥
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Total User Terdaftar</p>
                  <h2 className="text-2xl font-semibold text-purple-300">
                    {totalUsers}
                  </h2>
                </div>
              </div>
            )}

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
                  {stats.topLink
                    ? `${API_URL}/` + stats.topLink.shortCode
                    : 'Tidak ada'}
                </h2>
              </div>
            </div>
          </div>

          {/* Aktivitas */}
          <div className="mt-8 bg-gray-900/60 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Aktivitas Terbaru
            </h3>
            <ul className="space-y-3 text-gray-300">
              {user?.role === 'admin' ? (
                <>
                  <li>• Link yang admin buat: {adminTotalLinks}</li>
                  <li>• Total klik pada link admin: {adminTotalClicks}</li>
                  <li>
                    • Link admin paling populer :
                    <span className="text-blue-400 font-medium">
                      {adminTopLink
                        ? ` ${API_URL}/` + adminTopLink.shortCode
                        : 'Belum ada'}
                    </span>
                  </li>
                </>
              ) : (
                <>
                  <li>• Link yang kamu buat: {stats.totalLinks}</li>
                  <li>• Total klik link kamu: {stats.totalClicks}</li>
                  <li>
                    • Link populer :
                    <span className="text-blue-400 font-medium">
                      {stats.topLink
                        ? ' ' + ` ${API_URL}/` + stats.topLink.shortCode
                        : ' Belum ada'}
                    </span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
