import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';
import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';

export default function History() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/history/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
      })
      .catch((err) => console.error(err));
  }, []);

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
      selector: (row) => row.url?.originalUrl ?? '-',
      grow: 2,
    },

    { name: 'IP', selector: (row) => row.ip ?? '-' },
    { name: 'OS / Browser', selector: (row) => row.userAgent ?? '-', grow: 2 },

    {
      name: 'Tanggal Akses',
      selector: (row) =>
        row.clickedAt
          ? new Date(row.clickedAt).toLocaleDateString('id-ID')
          : '-',
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

          <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
            <div className="w-full overflow-x-auto">
              <div className="min-w-max">
                <DataTable
                  columns={columns}
                  data={history}
                  pagination
                  highlightOnHover
                  striped
                  customStyles={customStyles}
                  responsive={false}
                  fixedHeader
                  fixedHeaderScrollHeight="450px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
