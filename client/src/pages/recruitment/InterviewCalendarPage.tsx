import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Calendar as CalendarIcon, CheckCircle2, Award, Plus, CalendarDays, List, Search, MoreHorizontal } from 'lucide-react';

export default function InterviewCalendarPage() {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Mock stats
  const stats = [
    { label: 'Awaiting conduct', value: 0, icon: CalendarIcon, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Scores recorded', value: 0, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Recommended for offer', value: 0, icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto pb-10">
      
      {/* Header Section */}
      <div className="bg-white dark:bg-surface p-6 sm:p-8 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800/50">
            <CalendarDays className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Interview Scheduling & Calendar</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">Centralized Calendar</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-xl leading-relaxed">
              Coordinate panel interviews, technical rounds, video meeting links, and track scoring outcomes all in one place.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
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
          <Button onClick={() => setIsScheduleModalOpen(true)} className="gap-2 shadow-sm rounded-xl">
            <Plus className="w-4 h-4" /> Schedule Interview
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-surface p-6 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-700/60 flex items-center justify-between group hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
            <div>
              <p className="text-4xl font-extrabold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
            </div>
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} dark:bg-slate-800/50 flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color} dark:text-slate-300`} />
            </div>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-surface rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden min-h-[400px]">
        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-slate-500 dark:text-slate-400">Candidate & Role</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-slate-500 dark:text-slate-400">Date & Time</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-slate-500 dark:text-slate-400">Mode & Venue</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-slate-500 dark:text-slate-400">Panel</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-slate-500 dark:text-slate-400">Round</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-slate-500 dark:text-slate-400">Status</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-slate-500 dark:text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
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
      <Modal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} title="Schedule Candidate Interview" className="max-w-xl">
        <form className="space-y-5 py-2" onSubmit={(e) => { e.preventDefault(); setIsScheduleModalOpen(false); }}>
          
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Select Candidate from Pipeline</label>
            <Select required>
              <option value="">-- Choose Candidate --</option>
              <option value="1">John Doe - Frontend Engineer</option>
              <option value="2">Jane Smith - Product Manager</option>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Interview Round</label>
              <Select required>
                <option value="hr">HR Screening</option>
                <option value="technical">Technical Interview</option>
                <option value="managerial">Managerial Round</option>
                <option value="final">Final Discussion</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Interview Mode</label>
              <Select required>
                <option value="in-person">In-Person</option>
                <option value="video">Video Call</option>
                <option value="phone">Phone Call</option>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Date & Time</label>
            <Input type="datetime-local" required />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Interviewer / Panel Assigned</label>
            <Input placeholder="e.g. Lakshmi Prasanna (HR) & Technical Head" required />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Location or Meeting Link</label>
            <Input placeholder="e.g. Hyderabad Corporate Office - Boardroom" required />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsScheduleModalOpen(false)} className="rounded-xl px-5">
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl px-6 bg-emerald-600 hover:bg-emerald-700 text-white border-0">
              Confirm Schedule
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
