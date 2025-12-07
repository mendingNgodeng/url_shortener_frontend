import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';
import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

export default function Analytics() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clickData, setClickData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState('');
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await fetch(`${API_URL}/history/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setGlobalError(data.error || 'Failed loading analytics');
          setLoading(false);
          return;
        }

        // === TRANSFORM DATA SAFE ===
        const clicksMap = {};

        data.forEach((item) => {
          const code = item?.url?.shortCode || 'unknown';

          if (!clicksMap[code]) {
            clicksMap[code] = { name: code, clicks: 0 };
          }

          clicksMap[code].clicks += 1;
        });

        setClickData(Object.values(clicksMap));
        setLoading(false);
      } catch (error) {
        console.error(error);
        setGlobalError('Network error');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E3A8A]">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1">
        <Navbar setSidebarOpen={setSidebarOpen} />

        <div className="p-6">
          <h1 className="text-3xl font-bold text-white tracking-wide mb-1">
            Analytics Dashboard
          </h1>
          <p className="text-slate-300 mb-6">Ringkasan Performa Link</p>

          {globalError && (
            <div className="bg-red-600/30 border border-red-600 text-red-300 px-4 py-3 rounded-xl mb-6">
              {globalError}
            </div>
          )}

          {loading ? (
            <div className="text-blue-300 animate-pulse text-lg">
              Loading analytics...
            </div>
          ) : clickData.length === 0 ? (
            <div className="text-slate-300 text-lg">
              No analytics data yet. Share your link to see stats here.
            </div>
          ) : (
            <>
              {/* CHART */}
              <div className="bg-[#1E293B]/95 p-6 shadow-xl rounded-2xl border border-blue-900 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-blue-200">
                  Clicks Overview Chart
                </h2>

                <div className="h-72">
                  <ResponsiveContainer>
                    <BarChart data={clickData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" stroke="#E2E8F0" />
                      <YAxis stroke="#E2E8F0" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0F172A',
                          border: '1px solid #3B82F6',
                          color: 'white',
                        }}
                      />
                      <Bar
                        dataKey="clicks"
                        fill="#3B82F6"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* RANKING */}
              <div className="bg-[#1E293B]/95 p-6 shadow-xl rounded-2xl border border-blue-900">
                <h2 className="text-xl font-semibold mb-4 text-blue-200">
                  Clicks Ranking
                </h2>

                <table className="w-full text-white">
                  <tbody>
                    {[...clickData]
                      .sort((a, b) => b.clicks - a.clicks)
                      .map((row, i) => (
                        <tr
                          key={row.name}
                          className="border-b border-slate-600 hover:bg-[#0F172A] cursor-pointer transition"
                        >
                          <td className="py-3 underline text-blue-400 font-medium">
                            {`${API_URL}/urls/s/` + row.name}
                          </td>
                          <td className="text-center text-slate-300">
                            {row.clicks} clicks
                          </td>
                          <td className="text-center font-bold text-blue-400 text-lg">
                            #{i + 1}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
