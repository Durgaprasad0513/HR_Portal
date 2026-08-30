
import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { Sidebar } from './Sidebar';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 lg:px-8">
        <ErrorBoundary><Outlet /></ErrorBoundary>
      </main>
    </div>
  );
}
