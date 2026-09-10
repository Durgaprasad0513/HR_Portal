import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { departmentsApi } from '@/api/departments';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function TeamCard() {
  const { data: deptData, isLoading } = useQuery({
    queryKey: ['departments', 'dashboard'],
    queryFn: () => departmentsApi.getAll().then(res => res.data),
  });

  const teams = deptData || [];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col h-full hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Team</h3>
        <Link to="/employees" className="text-sm font-medium text-blue-500 hover:text-blue-600">
          View All
        </Link>
      </div>
      
      {isLoading ? (
        <div className="py-8"><LoadingSpinner /></div>
      ) : (
        <div className="space-y-4 flex-1">
          {teams.slice(0, 5).map((team: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50">
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{team.name}</h4>
                <p className="text-xs text-slate-400 font-medium">
                  Member <span className="text-blue-500">{team._count?.employees?.toString().padStart(2, '0') || '00'}</span>
                </p>
              </div>

            </div>
          ))}
          {teams.length === 0 && (
            <div className="text-sm text-slate-500 text-center py-4">No teams available</div>
          )}
        </div>
      )}
    </div>
  );
}
