import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ScheduleInterviewModal } from '@/pages/dashboard/components/ScheduleInterviewModal';
import { Calendar as CalendarIcon, CheckCircle2, Award, Plus, CalendarDays, List, Search, MoreHorizontal } from 'lucide-react';

export default function InterviewCalendarPage() {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      
      <PageHeader
        title="Interview Calendar"
        description="Coordinate panel interviews, technical rounds, video meeting links, and track scoring outcomes all in one place."
        actions={
          <div className="flex gap-2">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700/50">
              <button 
                onClick={() => setViewMode('calendar')} 
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === 'calendar' ? 'bg-white dark:bg-surface shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
              >
                Calendar View
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === 'list' ? 'bg-white dark:bg-surface shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
              >
                List View
              </button>
            </div>
            <Button onClick={() => setIsScheduleModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Schedule Interview
            </Button>
          </div>
        }
      />

      {/* Content Area */}
      <div className="bg-surface rounded-xl shadow-sm border border-slate-border overflow-hidden min-h-[400px]">
        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-tint border-b border-slate-border">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-muted">Candidate & Role</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-muted">Date & Time</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-muted">Mode & Venue</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-muted">Panel</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-muted">Round</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-muted">Status</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-muted text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-border">
                {/* Empty State */}
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-700">
                        <CalendarIcon className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No interviews scheduled</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-6">
                        There are currently no interviews awaiting conduct. Click the button below to schedule one.
                      </p>
                      <Button onClick={() => setIsScheduleModalOpen(true)} className="rounded-xl shadow-sm">
                        Schedule Interview
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-700">
              <CalendarIcon className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Calendar View</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
              Calendar integration is ready to be configured. Switch back to List view to manage active schedules.
            </p>
          </div>
        )}
      </div>

      {/* Schedule Interview Modal */}
      <ScheduleInterviewModal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} />

    </div>
  );
}
