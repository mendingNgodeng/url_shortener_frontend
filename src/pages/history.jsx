import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';
import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useAuth } from '../auth/AuthContext';

export default function History() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const API_URL = import.meta.env.VITE_API_URL;
  const { token, user } = useAuth();

  useEffect(() => {
    fetch(`${API_URL}/history/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
      })
      .catch((err) => console.error(err));
  }, []);

  // search data
  const filteredHistory = history.filter((row) => {
    const keyword = search.toLowerCase();

    return (
      row.url?.shortCode?.toLowerCase().includes(keyword) ||
      row.url?.originalUrl?.toLowerCase().includes(keyword) ||
      row.ip?.toLowerCase().includes(keyword) ||
      row.country?.toLowerCase().includes(keyword) ||
      row.city?.toLowerCase().includes(keyword) ||
      row.device?.toLowerCase().includes(keyword) ||
      row.browser?.toLowerCase().includes(keyword) ||
      row.os?.toLowerCase().includes(keyword) ||
      row.userAgent?.toLowerCase().includes(keyword)
    );
  });

  const columns = [
    { name: 'No', selector: (row, index) => index + 1, width: '60px' },

    {
      name: 'Short URL',
      selector: (row) => row.url?.shortCode ?? '-',
      sortable: true,
      cell: (row) => (
        <span className="text-blue-400 font-semibold">
          {row.url?.shortCode ?? '-'}
        </span>
      ),
    },

    {
      name: 'Original URL',
      selector: (row) => row.originalUrl,
      grow: 1,
      cell: (row) => (
        <span
          title={row.url?.originalUrl}
          className="truncate block max-w-[200px]"
        >
          {row.url?.originalUrl}
        </span>
      ),
    },

    { name: 'IP', selector: (row) => row.ip ?? '-' },
    { name: 'Country', selector: (row) => row.country ?? '-' },
    { name: 'City', selector: (row) => row.city ?? '-' },
    { name: 'device', selector: (row) => row.device ?? '-' },
    { name: 'Os', selector: (row) => row.os ?? '-' },
    { name: 'Browser', selector: (row) => row.browser ?? '-' },
    { name: 'Referer', selector: (row) => row.referer ?? '-' },
    { name: 'OS / Browser', selector: (row) => row.userAgent ?? '-', grow: 2 },

    {
      name: 'Tanggal Akses',
      selector: (row) =>
        row.clickedAt
          ? new Date(row.clickedAt).toLocaleDateString('id-ID')
          : '-',
      sortable: true,
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#1F2937',
        color: '#CBD5E1',
        fontSize: '14px',
      },
    },
    rows: {
      style: {
        backgroundColor: '#111827',
        color: '#E5E7EB',
        borderBottomColor: '#374151',
      },
      highlightOnHoverStyle: {
        backgroundColor: '#374151',
      },
    },
    pagination: {
      style: {
        backgroundColor: '#1F2937',
        color: '#FFF',
      },
    },
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#0F172A] to-[#1E3A8A]">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 overflow-y-auto">
        <Navbar setSidebarOpen={setSidebarOpen} />

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-white">
            History Akses Short URL
          </h1>
          {/* search input */}
          <input
            type="text"
            placeholder="Cari history..."
            className="mb-3 w-full p-3 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
            <div className="w-full overflow-x-auto">
              <div className="min-w-max">
                <DataTable
                  columns={columns}
                  data={filteredHistory}
                  pagination
                  highlightOnHover
                  striped
                  customStyles={customStyles}
                  responsive={false}
                  // fixedHeader
                  fixedHeaderScrollHeight="800px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
