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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function Analytics() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clickData, setClickData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [browserData, setBrowserData] = useState([]);
  const [osData, setOsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState('');

  // date input
  const [rawData, setRawData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  const COLORS = ['#3B82F6', '#06B6D4', '#F59E0B', '#10B981', '#EC4899'];

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

        //  CLICK PER SHORTCODE:
        const clicksMap = {};
        const countryMap = {};
        const deviceMap = {};
        const browserMap = {};
        const osMap = {};

        data.forEach((item) => {
          const short = item?.url?.shortCode || 'unknown';
          const ct = item.country || 'unknown';
          const dev = item.device || 'unknown';
          const br = item.browser || 'unknown';
          const os = item.os || 'unknown';

          if (!clicksMap[short]) clicksMap[short] = { name: short, clicks: 0 };
          clicksMap[short].clicks += 1;

          countryMap[ct] = (countryMap[ct] || 0) + 1;
          deviceMap[dev] = (deviceMap[dev] || 0) + 1;
          browserMap[br] = (browserMap[br] || 0) + 1;
          osMap[os] = (osMap[os] || 0) + 1;
        });

        setClickData(Object.values(clicksMap));

        setCountryData(
          Object.entries(countryMap).map(([key, val]) => ({
            name: key,
            value: val,
          }))
        );

        setDeviceData(
          Object.entries(deviceMap).map(([key, val]) => ({
            name: key,
            value: val,
          }))
        );

        setBrowserData(
          Object.entries(browserMap).map(([key, val]) => ({
            name: key,
            value: val,
          }))
        );

        setOsData(
          Object.entries(osMap).map(([key, val]) => ({
            name: key,
            value: val,
          }))
        );

        setLoading(false);
      } catch (e) {
        console.error(e);
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
              {/* CLICK BAR CHART */}
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
                      <Tooltip />
                      <Bar
                        dataKey="clicks"
                        fill="#3B82F6"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* COUNTRY PIE */}
              <ChartSection
                title="Country Distribution"
                data={countryData}
                colors={COLORS}
              />

              {/* DEVICE PIE */}
              <ChartSection
                title="Device Usage"
                data={deviceData}
                colors={COLORS}
              />

              {/* BROWSER PIE */}
              <ChartSection
                title="Browser Breakdown"
                data={browserData}
                colors={COLORS}
              />

              {/* OS PIE */}
              <ChartSection
                title="Operating Systems"
                data={osData}
                colors={COLORS}
              />

              {/* RANKING */}
              <div className="bg-[#1E293B]/95 mt-6 p-6 shadow-xl rounded-2xl border border-blue-900">
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

//     REUSABLE PIE CHART
function ChartSection({ title, data, colors }) {
  return (
    <div className="bg-[#1E293B]/95 p-6 shadow-xl rounded-2xl border border-blue-900 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-blue-200">{title}</h2>

      {data.length === 0 ? (
        <p className="text-slate-300">No data</p>
      ) : (
        <div className="h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label={(entry) => `${entry.name} (${entry.value})`}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => [
                  `${value} clicks`,
                  props.payload.name,
                ]}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  border: '1px solid #3B82F6',
                  color: 'white',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
