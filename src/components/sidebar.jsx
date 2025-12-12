import { Link, useLocation } from 'react-router-dom';
import { FiX, FiUser } from 'react-icons/fi';
import { getUserFromToken } from '../utils/auth';
// import { useAuth } from '../auth/AuthContext';
import { useAuth } from '../auth/AuthContext';

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();
  const { user } = useAuth();
  const isActive = (path) =>
    location.pathname === path
      ? 'bg-blue-700 text-white shadow-md'
      : 'text-slate-300 hover:bg-slate-700 hover:text-white';

  return (
    <>
      {/* OVERLAY MOBILE */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-50
          bg-gradient-to-b from-[#0F172A] to-[#1E293B]
          text-white border-r border-slate-700 min-h-screen w-64
          shadow-xl backdrop-blur-md
          transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Close Button (Mobile) */}
        <button
          className="md:hidden absolute top-3 right-3 text-white"
          onClick={() => setOpen(false)}
        >
          <FiX size={24} />
        </button>

        {/* USER HEADER */}
        <div className="p-6 flex items-center space-x-3 border-b border-slate-700 bg-[#1E293B]">
          <div className="bg-blue-700 text-white p-2 rounded-full shadow-lg">
            <FiUser size={20} />
          </div>

          <div>
            <p className="font-semibold text-white text-lg">
              {' '}
              {user?.username || 'Unknown'}
            </p>
            <p className="text-sm text-slate-300">{user?.role || 'User'}</p>
          </div>
        </div>

        {/* MENU LIST */}
        <ul className="p-6 space-y-3">
          <li>
            <Link
              to="/dashboard"
              className={`block px-3 py-2 rounded-lg font-medium transition ${isActive(
                '/dashboard'
              )}`}
            >
              Dashboard
            </Link>
          </li>

          <li>
            <Link
              to="/shortener"
              className={`block px-3 py-2 rounded-lg font-medium transition ${isActive(
                '/shortener'
              )}`}
            >
              Shortener
            </Link>
          </li>

          {user?.role === 'admin' && (
            <li>
              <Link
                to="/shortenerAdminOwn"
                className={`block px-3 py-2 rounded-lg font-medium transition ${isActive(
                  '/shortenerAdminOwn'
                )}`}
              >
                Shortener Admin
              </Link>
            </li>
          )}
          {user?.role === 'admin' && (
            <li>
              <Link
                to="/users"
                className={`block px-3 py-2 rounded-lg font-medium transition ${isActive(
                  '/users'
                )}`}
              >
                Users
              </Link>
            </li>
          )}
          <li>
            <Link
              to="/history"
              className={`block px-3 py-2 rounded-lg font-medium transition ${isActive(
                '/history'
              )}`}
            >
              History
            </Link>
          </li>

          <li>
            <Link
              to="/analytics"
              className={`block px-3 py-2 rounded-lg font-medium transition ${isActive(
                '/analytics'
              )}`}
            >
              Analytics
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className={`block px-3 py-2 rounded-lg font-medium transition ${isActive(
                '/profile'
              )}`}
            >
              Profile
            </Link>
          </li>
        </ul>
      </aside>
    </>
  );
}
