import { useState } from 'react';
import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E3A8A]">
      {/* SIDEBAR */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* MAIN CONTENT */}
      <div className="flex-1">
        {/* NAVBAR */}
        <Navbar setSidebarOpen={setSidebarOpen} />

        {/* PAGE CONTENT */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
