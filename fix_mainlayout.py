code = """import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const location = useLocation();

  // Close sidebar on mobile when navigating
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleMenuClick = () => {
    if (window.innerWidth < 1024) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopCollapsed(!desktopCollapsed);
    }
  };

  return (
    <div className="flex h-screen bg-[#f4f7f6] dark:bg-[#0b1120] transition-colors overflow-hidden relative">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar with mobile toggle logic and desktop collapse */}
      <div className={`fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar collapsed={desktopCollapsed} />
      </div>

      <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden">
        <Header onMenuClick={handleMenuClick} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 lg:px-8">
          <ErrorBoundary><Outlet /></ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
"""

with open("client/src/components/layout/MainLayout.tsx", "w", encoding="utf-8") as f:
    f.write(code)
print("Fixed MainLayout.tsx properly")
