import { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';
import { Eye, EyeOff } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { toastSuccess, toastInfo, toastError } from '../utils/toast.jsx';

export default function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('identity');
  //   password chekcker
  const [password, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // foto profil
  const [profilePhoto, setProfilePhoto] = useState('/profile.png');

  // icon mata password
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [emailOriginal, setEmailOriginal] = useState('');

  const [role, setRole] = useState('');
  const [createdAt, setcreatedAt] = useState('');

  const [globalError, setGlobalError] = useState('');
  const [errors, setErrors] = useState({});

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  //   if (!res.ok) {
  //     // backend mengirim { errors: {...} }
  //     setErrors(data.errors || {});
  //     return;
  //   }

  const token = localStorage.getItem('token');
  const user = jwtDecode(token); // dapatkan id dari token
  const API_URL = import.meta.env.VITE_API_URL;

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePhoto(URL.createObjectURL(file));
  };

  useEffect(() => {
    // ambil data user dari backend
    fetch(`${API_URL}/users/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsername(data.username);
        setEmail(data.email);
        setRole(data.role);
        setEmailOriginal(data.email);
        setcreatedAt(
          new Date(data.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        );
      })
      .catch((err) => console.error(err));
  }, []);

  //   update data
  const handleUpdateProfile = async () => {
    setErrors({});
    setGlobalError('');
    try {
      const payload = {};

      if (username) payload.username = username;
      if (email !== emailOriginal) payload.email = email;

      const res = await fetch(`${API_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status === 400) {
        // Jika error Zod
        if (data.errors) {
          setErrors(data.errors);
          setGlobalError('');
          return;
        }

        // Jika duplicate atau error single message
        if (data.error) {
          setErrors({});
          setGlobalError(data.error);
          return;
        }

        // fallback
        setGlobalError('Terjadi kesalahan');
        return;
      }
      toastSuccess('Profile berhasil diperbarui!');
      // alert('Profile berhasil diperbarui!');
    } catch (err) {
      console.error(err);
      toastError('Terjadi kesalahan server!');
      // alert('Terjadi kesalahan server.');
    }
  };

  const handleUpdatePassword = async () => {
    setPasswordError('');
    setGlobalError('');

    if (!password || !confirmPassword) {
      setPasswordError('Password tidak boleh kosong');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Password tidak cocok');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/users/password/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.status === 400) {
        // error ZOD
        if (data.error?.fieldErrors) {
          setErrors(data.error.fieldErrors);
          setGlobalError('');
          return;
        }

        // duplicate / custom error ? why am i writng this? this is NOT GONNA BE USED!
        if (data.error) {
          setErrors({});
          setGlobalError(data.error);
          return;
        }
      }

      // alert('Password berhasil diubah!');
      toastSuccess('Password berhasil diubah!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      toastError('Terjadi kesalahan server!');
      setPasswordError('Terjadi kesalahan server');
    }
  };

  // delete account
  const handleDeleteAccount = async () => {
    setDeleteLoading(true);

    try {
      const res = await fetch(`${API_URL}/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Gagal menghapus akun');
        setDeleteLoading(false);
        return;
      }
      toastSuccess('Akun berhasil dihapus!');

      // Hapus token & redirect logout
      localStorage.removeItem('token');
      window.location.href = '/';
    } catch (error) {
      console.error(error);
      alert('Server error.');
    }

    setDeleteLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E3A8A]">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1">
        <Navbar setSidebarOpen={setSidebarOpen} />

        <div className="p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-gray-300 mb-6">
            Perbarui identitas & informasi akun kamu di sini.
          </p>

          <div className="bg-slate-900/70 rounded-xl p-6 shadow-md border border-slate-700 flex flex-col md:flex-row gap-8">
            {/* KIRI – FOTO & INFO */}
            <div className="w-full md:w-1/3 bg-slate-800/70 p-6 rounded-lg border border-slate-700 text-center">
              {/* FOTO + IKON KAMERA */}
              <div className="relative w-32 h-32 mx-auto mb-4">
                <img
                  src={profilePhoto}
                  alt=""
                  className="w-32 h-32 rounded-full border-4 border-blue-500 shadow object-cover"
                />

                <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow cursor-pointer transition">
                  {/* Ikon kamera */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7h2l1.2-2.4A2 2 0 018.1 3h7.8a2 2 0 011.9 1.6L19 7h2a2 2 0 012 2v9a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2zm9 4.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z"
                    />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </label>
              </div>

              <h2 className="text-xl font-bold">{username}</h2>
              <p className="text-gray-400">{role}</p>

              <div className="text-left mt-6 space-y-3 text-gray-300">
                <p>
                  Username:{' '}
                  <span className="font-medium text-blue-400">{username}</span>
                </p>
                <p>
                  Tanggal Daftar:{' '}
                  <span className="font-medium text-blue-400">{createdAt}</span>
                </p>
              </div>
              <button
                className="mt-6 bg-red-600 hover:bg-red-700 px-6 py-2 rounded font-semibold shadow"
                onClick={() => setShowDeleteModal(true)}
              >
                Hapus Akun
              </button>
            </div>

            {/* KANAN – FORM */}
            <div className="flex-1">
              <div className="border-b border-slate-600 pb-2 mb-6 flex gap-6 text-gray-300">
                <button
                  className={`${
                    activeTab === 'identity'
                      ? 'text-blue-400 font-semibold border-b-2 border-blue-400 pb-2'
                      : 'hover:text-white'
                  }`}
                  onClick={() => setActiveTab('identity')}
                >
                  Ubah Identitas
                </button>

                <button
                  className={`${
                    activeTab === 'password'
                      ? 'text-blue-400 font-semibold border-b-2 border-blue-400 pb-2'
                      : 'hover:text-white'
                  }`}
                  onClick={() => setActiveTab('password')}
                >
                  Ubah Password
                </button>
              </div>

              {/* FORM UBAH IDENTITAS */}
              {activeTab === 'identity' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-1">Username</label>
                    <input
                      className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    {errors.username && (
                      <p className="text-red-400 text-sm mb-2">
                        {errors.username.join(', ')}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1">Email</label>
                    <input
                      className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mb-2">
                        {errors.email.join(', ')}
                      </p>
                    )}
                  </div>
                  {globalError && (
                    <p className="text-red-400 text-sm mb-4">{globalError}</p>
                  )}
                  {/* Status - NON EDITABLE */}
                  <div>
                    <label className="block text-gray-300 mb-1">Status</label>
                    <div className="w-full px-3 py-2 rounded bg-slate-700 border border-slate-600 text-blue-300 font-semibold cursor-not-allowed select-none">
                      {role}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Status akun tidak dapat diubah.
                    </p>
                  </div>

                  <button
                    className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold shadow"
                    onClick={handleUpdateProfile}
                  >
                    Simpan Perubahan
                  </button>
                </div>
              )}

              {/* FORM UBAH PASSWORD */}
              {activeTab === 'password' && (
                <div className="space-y-4">
                  {/* PASSWORD BARU */}
                  <div className="relative">
                    <label className="block text-gray-300 mb-1">
                      Password Baru
                    </label>
                    <input
                      type={showNew ? 'text' : 'password'}
                      placeholder="********"
                      className="w-full px-3 py-2 pr-12 rounded bg-slate-800 border border-slate-600"
                      value={password}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-white"
                    >
                      {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {/* KONFIRMASI PASSWORD */}
                  <div className="relative">
                    <label className="block text-gray-300 mb-1">
                      Konfirmasi Password
                    </label>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="********"
                      className="w-full px-3 py-2 pr-12 rounded bg-slate-800 border border-slate-600"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {errors.password && (
                      <p className="text-red-400 text-sm">
                        {errors.password.join(', ')}
                      </p>
                    )}
                    {passwordError && (
                      <p className="text-red-400 text-sm">{passwordError}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-white"
                    >
                      {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <button
                    className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold shadow"
                    onClick={() => handleUpdatePassword()}
                  >
                    Perbarui Password
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800 p-6 rounded-xl shadow-xl w-80 border border-slate-600">
              <h2 className="text-xl font-bold text-red-400 mb-3">
                Hapus Akun?
              </h2>
              <p className="text-gray-300 mb-6">
                Apakah kamu yakin ingin menghapus akun ini? Tindakan ini tidak
                dapat dibatalkan.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded"
                >
                  Batal
                </button>

                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                >
                  {deleteLoading ? 'Menghapus...' : 'Hapus'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
