import { LogOut } from 'lucide-react';
import { FiMenu } from 'react-icons/fi';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ setSidebarOpen }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = async () => {
    if (window.confirm('Apakah kamu yakin ingin logout?')) {
      //cleaned
      logout();
    }
  };

  return (
    <nav className="bg-slate-900 shadow-md px-4 py-4 flex items-center gap-4 border-b border-slate-700 md:pl-64">
      {/* Hamburger (Mobile Only) */}
      <button
        className="md:hidden text-white p-2 rounded hover:bg-slate-700 transition"
        onClick={() => setSidebarOpen(true)}
      >
        <FiMenu size={22} />
      </button>

      <h1 className="text-xl font-semibold text-white tracking-wide flex-1">
        Free Unlimited URL Shortener
      </h1>

      <button
        onClick={handleLogout}
        className="p-2 rounded-lg hover:bg-red-500/20 transition"
        title="Logout"
      >
        <LogOut className="w-5 h-5 text-red-400" />
      </button>
    </nav>
  );
}
