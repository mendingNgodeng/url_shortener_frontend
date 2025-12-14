import { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';
import DataTable from 'react-data-table-component';
import { Copy, Pencil, Trash2, QrCode } from 'lucide-react';
import LinkModal from '../components/linkmodal';
import {
  toastSuccess,
  toastInfo,
  toastError,
  toastConfirm,
} from '../utils/toast.jsx';
import QRModal from '../components/qrmodal';
import { useAuth } from '../auth/AuthContext';

export default function Shortener() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [links, setLinks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  // qr code
  const [qrOpen, setQrOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const { token, user } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/urls`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          if (res.status === 429) {
            toastError(
              `Terlalu banyak request! Coba lagi dalam ${data.retryAfter}s`
            );
          } else {
            toastError(data.error || 'Gagal memuat data');
          }
          return;
        }

        setLinks(data);
      } catch (err) {
        toastError('Server tidak merespon');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredLinks = links.filter(
    (row) =>
      row.originalUrl.toLowerCase().includes(search.toLowerCase()) ||
      row.shortCode.toLowerCase().includes(search.toLowerCase()) ||
      row.user?.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = (shortCode) => {
    const full = `${API_URL}/urls/s/${shortCode}`;
    navigator.clipboard.writeText(full);
    // alert('URL copied!');
    toastInfo('URL dicopy!');
  };

  const columns = [
    {
      name: 'Original URL',
      selector: (row) => row.originalUrl,
      grow: 0,
      cell: (row) => (
        <span title={row.originalUrl} className="truncate block max-w-[200px]">
          {row.originalUrl}
        </span>
      ),
    },
    {
      name: 'Pemilik',
      selector: (row) => row.user?.username || 'Milik mu',
      wrap: true,
      grow: 0,
      cell: (row) => (
        <span
          title={row.user?.username}
          className="truncate block max-w-[200px]"
        >
          {row.user?.username}
        </span>
      ),
    },
    {
      name: 'Short Code',
      selector: (row) => row.shortCode,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span title={row.shortCode} className="truncate block max-w-[200px]">
            {row.shortCode}
          </span>
          <button
            onClick={() => handleCopy(row.shortCode)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <Copy className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      ),
      grow: 3,
    },
    {
      name: 'Clicks',
      selector: (row) => row.clicks,
      sortable: true,
    },
    {
      name: 'Expired At',
      selector: (row) =>
        row.expirationDate
          ? new Date(row.expirationDate).toLocaleString('id-ID', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
          : '-',
      grow: 1,
      sortable: true,
    },
    {
      name: 'Action',
      wrap: true,
      grow: 0,
      cell: (row) => (
        <div className="flex gap-3 justify-center">
          <button
            onClick={() =>
              toastConfirm('Yakin ingin hapus URL ini?', () =>
                handleDelete(row.id)
              )
            }
            className="p-1 hover:bg-red-700/40 rounded"
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </button>

          <button
            onClick={() => {
              const full = `${API_URL}/urls/s/${row.shortCode}`;
              setQrUrl(full);
              setQrOpen(true);
            }}
            className="p-1 hover:bg-blue-700/40 rounded"
          >
            <QrCode className="w-5 h-5 text-blue-400" />
          </button>
        </div>
      ),
    },
    {
      name: 'Status',
      selector: (row) => row.expirationDate,
      width: '120px',
      cell: (row) => {
        if (!row.expirationDate) {
          return (
            <span className="px-2 py-1 text-xs rounded bg-green-700/30 text-green-400">
              Active
            </span>
          );
        }

        const isExpired = new Date(row.expirationDate) < new Date();

        return isExpired ? (
          <span className="px-2 py-1 text-xs rounded bg-red-700/30 text-red-400">
            Expired
          </span>
        ) : (
          <span className="px-2 py-1 text-xs rounded bg-green-700/30 text-green-400">
            Active
          </span>
        );
      },
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
    try {
      const res = await fetch(`${API_URL}/urls/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        //adjusted for RL
        if (res.status === 429) {
          toastError(`Terlalu sering hapus URL! Tunggu ${result.retryAfter}s`);
        } else {
          toastError(result.error || 'Gagal menghapus URL');
        }
        return;
      }
      if (res.status === 403) {
        toastError(`tidak bisa hapus URL orang lain!`);
      }
      toastSuccess('URL berhasil dihapus!');
      loadData();
    } catch (err) {
      toastError('Terjadi kesalahan jaringan');
    }
  };
  // muat data
  const loadData = async () => {
    const res = await fetch(`${API_URL}/urls`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const data = await res.json();
    setLinks(data);
  };
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#0F172A] to-[#1E3A8A]">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* MAIN */}
      <div className="flex-1 overflow-y-auto">
        <Navbar setSidebarOpen={setSidebarOpen} />

        <div className="p-6">
          <h1 className="text-3xl font-bold text-white mb-6">URL Shortener</h1>
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
      >
        +
      </button>

      <LinkModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => loadData()}
      />

      <QRModal isOpen={qrOpen} onClose={() => setQrOpen(false)} url={qrUrl} />
    </div>
  );
}
