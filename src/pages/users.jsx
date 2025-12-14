import { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';
import DataTable from 'react-data-table-component';
import { Copy, Pencil, Trash2, QrCode } from 'lucide-react';
import {
  toastSuccess,
  toastInfo,
  toastError,
  toastConfirm,
} from '../utils/toast.jsx';
import { useAuth } from '../auth/AuthContext';

export default function Users() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [links, setLinks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  const { token, user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetch(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      // 🔴 RATE LIMIT
      if (res.status === 429) {
        toastError(`Terlalu sering request 🚫 Tunggu ${data.retryAfter}s`);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        toastError('Gagal mengambil data user');
        setLoading(false);
        return;
      }

      setLinks(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toastError('Server error saat mengambil data user');
      setLoading(false);
    }
  };

  const filteredLinks = links.filter(
    (row) =>
      row.username.toLowerCase().includes(search.toLowerCase()) ||
      row.createdAt.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      name: 'Username',
      selector: (row) => row.username,
      grow: 0,
      cell: (row) => (
        <span title={row.username} className="truncate block max-w-[200px]">
          {row.username}
        </span>
      ),
    },
    {
      name: 'Role',
      selector: (row) => row.role || 'Milik mu',
      wrap: true,
      grow: 0,
      cell: (row) => (
        <span title={row.role} className="truncate block max-w-[200px]">
          {row.role}
        </span>
      ),
    },

    {
      name: 'Jumlah links',
      selector: (row) => row._count.urls,
      sortable: true,
      grow: 1,
    },
    {
      name: 'Daftar Pada',
      selector: (row) =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleString('id-ID', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
          : '-',
      grow: 3,
      sortable: true,
    },
    {
      name: 'Action',
      wrap: true,
      cell: (row) => (
        <div className="flex gap-3 justify-center">
          <button
            onClick={() =>
              toastConfirm('Yakin Ingin hapus user ini?', () =>
                handleDelete(row.id)
              )
            }
            className="p-1 hover:bg-red-700/40 rounded"
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </button>
        </div>
      ),
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
  // delete
  const handleDelete = async (id) => {
    // toastInfo('Klik OK untuk menghapus user ini...');

    // const ok = confirm('Yakin ingin menghapus user ini?');
    // if (!ok) return;

    try {
      const res = await fetch(`${API_URL}/users/a/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (res.status === 429) {
        toastError(
          `Terlalu sering menghapus user 🚫 Tunggu ${data.retryAfter}s`
        );
        return;
      }

      if (!res.ok) {
        toastError(data.message || 'User gagal dihapus!');
        return;
      }

      toastSuccess('User berhasil dihapus!');
      loadData();
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menghapus');
    }
  };
  // muat data
  // const loadData = async () => {
  //   const res = await fetch(`${API_URL}/users`, {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('token')}`,
  //     },
  //   });

  //   const data = await res.json();
  //   setLinks(data);
  // };
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#0F172A] to-[#1E3A8A]">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* MAIN */}
      <div className="flex-1 overflow-y-auto">
        <Navbar setSidebarOpen={setSidebarOpen} />

        <div className="p-6">
          <h1 className="text-3xl font-bold text-white mb-6">
            Users Table Data
          </h1>
          {/* <button
            onClick={() => setModalOpen(true)}
            className="mb-4 px-4 py-2 rounded-lg bg-cyan-600 text-white font-semibold hover:bg-cyan-700 transition"
          >
            Create New
          </button> */}
          {/* Search Box */}
          <input
            type="text"
            placeholder="Cari URL..."
            className="mb-3 w-full p-3 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
            <div className="w-full overflow-x-auto">
              <div className="min-w-max max-h-[450px] overflow-y-auto">
                <DataTable
                  columns={columns}
                  data={filteredLinks}
                  progressPending={loading}
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
      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center text-3xl font-bold hover:bg-blue-700 transition shadow-2xl border border-blue-400/40"
      ></button>
    </div>
  );
}
