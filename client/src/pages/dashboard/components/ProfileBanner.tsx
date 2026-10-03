import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plane, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProfileBanner() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Only show for HR and EMPLOYEE. Exclude ADMIN and MANAGER.
  if (user?.role === 'HR') {
    return null;
  }

  const employee = user?.employee;
  const firstName = employee?.firstName || user?.email?.split('@')[0] || 'User';
  const lastName = employee?.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim();
  const employeeCode = employee?.employeeCode || 'N/A';
  
  // Combine designation, department, and location
  const details = [
    employee?.designation,
    employee?.department?.name,
    employee?.location
  ].filter(Boolean).join(' • ');

  return (
    <div className="bg-surface rounded-2xl p-6 border border-slate-border shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-slate-200 overflow-hidden shrink-0 border-4 border-white shadow-sm flex items-center justify-center text-3xl font-bold text-slate-500">
          {employee?.profilePhoto ? (
            <img src={employee.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            firstName.charAt(0)
          )}
        </div>
        
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-text-heading">Welcome, {fullName}!</h1>
            {employeeCode !== 'N/A' && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold tracking-wide uppercase border border-emerald-100">
                {employeeCode}
              </span>
            )}
          </div>
          <p className="text-slate-500 text-sm font-medium">
            {details || 'Employee'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button 
          onClick={() => navigate('/leaves')}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm"
        >
          <Calendar className="w-4 h-4" />
          Apply Leave
        </button>
        <button 
          onClick={() => navigate('/travel')}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm"
        >
          <Plane className="w-4 h-4" />
          Travel Claim
        </button>
        <button 
          onClick={() => navigate('/requests')}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm"
        >
          <MessageSquare className="w-4 h-4" />
          HR Query
        </button>
      </div>
    </div>
  );
}

