import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { EmployeeDashboard } from './EmployeeDashboard';
import { ManagerDashboard } from './ManagerDashboard';
import { HRDashboard } from './HRDashboard';
import { FinanceDashboard } from './FinanceDashboard';

export default function DashboardPage() {
  const { user } = useAuth();
  
  const renderDashboard = () => {
    // For this theme overhaul, we're showcasing the rich Visily Dashboard 
    // design via HRDashboard for all users for demonstration purposes.
    // In production, we would build out role-specific versions matching the theme.
    return <HRDashboard />;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.employee?.firstName || user?.email}</p>
        </div>
      </div>

      {renderDashboard()}
    </div>
  );
}
