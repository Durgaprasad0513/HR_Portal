import re

with open("client/src/components/layout/MainLayout.tsx", "r", encoding="utf-8") as f:
    content = f.read()

new_layout = """import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on mobile when navigating
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-[#f4f7f6] dark:bg-[#0b1120] transition-colors overflow-hidden relative">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar with mobile toggle logic */}
      <div className={ixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out }>
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 lg:px-8">
          <ErrorBoundary><Outlet /></ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
"""

with open("client/src/components/layout/MainLayout.tsx", "w", encoding="utf-8") as f:
    f.write(new_layout)
print("Updated MainLayout.tsx")
