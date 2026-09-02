import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const location = useLocation();

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Listen to window resize to handle default state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-[#f4f7f6] dark:bg-[#0b1120] transition-colors overflow-hidden relative">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out lg:relative 
          ${sidebarOpen ? 'translate-x-0 lg:w-[18rem] lg:opacity-100' : '-translate-x-full lg:w-0 lg:opacity-0 lg:-ml-4 overflow-hidden'}`}
      >
        <div className="w-[18rem]">
          <Sidebar />
        </div>
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
