
import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { Sidebar } from './Sidebar';

import { Header } from './Header';

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-gray-950 transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 lg:px-8">
          <ErrorBoundary><Outlet /></ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
