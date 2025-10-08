// PageTemplate.tsx
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

export default function PageTemplate() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(v => !v);
  const location = useLocation();

  const isBoardPage = location.pathname.startsWith("/flow");

  return (
    <div className="flex w-screen h-screen bg-gray-950 text-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onToggle={toggleSidebar} />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 h-screen">
        <Navbar />
        <main className="flex-1 min-w-0 overflow-hidden h-[calc(100vh-3rem)]">
          {isBoardPage ? (
            <div className="w-full h-[calc(100vh-3rem)]">
              <Outlet />
            </div>
          ) : (
            <div className="max-w-6xl mx-auto px-6 py-6">
              <Outlet />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
