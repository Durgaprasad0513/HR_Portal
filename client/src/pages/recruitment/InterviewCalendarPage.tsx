import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recruitmentApi } from '@/api/recruitment';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatDate, formatDateTime } from '@/utils/dateFormat';
import { Calendar as CalendarPicker } from '@/components/ui/Calendar';
import { isSameDay } from 'date-fns';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ScheduleInterviewModal } from '@/pages/dashboard/components/ScheduleInterviewModal';
import { Calendar as CalendarIcon, CheckCircle2, Award, Plus, CalendarDays, List, Search, MoreHorizontal, Download, XCircle, History } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePermissions } from '@/hooks/usePermissions';

export default function InterviewCalendarPage() {
  const { canEdit, canExport } = usePermissions();
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [stageFilter, setStageFilter] = useState('ALL');

  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const reqId = searchParams.get('reqId');

  const updateCandidateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: any }) => recruitmentApi.interviewCandidate(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      queryClient.invalidateQueries({ queryKey: ['requisitions'] });
      toast.success('Candidate updated');
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || 'Could not update candidate')
  });

  const handleMarkFinish = (id: string, currentRound: string) => {
    const rounds = ['TELEPHONIC', 'HR_INTERVIEW', 'TECHNICAL', 'MANAGEMENT', 'OFFER'];
    const currentIndex = rounds.indexOf(currentRound || 'TELEPHONIC');
    
    if (currentIndex >= 0 && currentIndex < rounds.length - 1) {
      const nextRound = rounds[currentIndex + 1];
      updateCandidateMutation.mutate({ 
        id, 
        payload: { 
          interviewRound: nextRound,
          interviewFeedback: 'Pending'
        } 
      });
    } else {
      updateCandidateMutation.mutate({ 
        id, 
        payload: { 
          interviewFeedback: 'Finished'
        } 
      });
    }
  };

  const handleSetPhase = (id: string, phase: string) => {
    updateCandidateMutation.mutate({ id, payload: { interviewRound: phase, interviewFeedback: 'Pending' } });
  };

  const handleSetStatus = (id: string, status: string) => {
    updateCandidateMutation.mutate({
      id,
      payload: { selectionStatus: status === 'IN_PROGRESS' ? null : status }
    });
  };

  const { data: interviewsData, isLoading } = useQuery({
    queryKey: ['interviews', reqId],
    queryFn: () => reqId 
      ? recruitmentApi.getCandidates(reqId).then((res: any) => res.data)
      : recruitmentApi.getInterviews().then((res: any) => res.data)
  });

  const filteredInterviews = useMemo(() => {
    if (!interviewsData) return [];
    return interviewsData.filter((cand: any) => {
      const matchesHistory = showHistory
        ? cand.selectionStatus === 'SELECTION_REJECTED'
        : cand.selectionStatus !== 'SELECTION_REJECTED';
      const matchesStage = stageFilter === 'ALL' || cand.interviewRound === stageFilter;
      return matchesHistory && matchesStage;
    });
  }, [interviewsData, showHistory, stageFilter]);

  const handleReject = (id: string) => {
    if (window.confirm('Are you sure you want to reject this candidate and move them to history?')) {
      updateCandidateMutation.mutate({ 
        id, 
        payload: { selectionStatus: 'SELECTION_REJECTED' } 
      });
    }
  };

  const handleExport = () => {
    if (!filteredInterviews?.length) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Candidate Name,Role,Interview Date,Location,Interviewer,Round,Status\n"
      + filteredInterviews.map((cand: any) => 
          `${cand.candidateName},${cand.requisition?.positionTitle || ''},${cand.interviewDate || 'Not Scheduled'},${cand.interviewLocation || 'In-person'},${cand.interviewer ? cand.interviewer.firstName + ' ' + cand.interviewer.lastName : 'Unassigned'},${cand.interviewRound || 'HR_INTERVIEW'},${cand.interviewFeedback || 'Pending'}`
        ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Interview_Calendar.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      <PageHeader
        title="Interview Calendar"
        description="Coordinate panel interviews, technical rounds, video meeting links, and track scoring outcomes all in one place."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowHistory(!showHistory)} className={`gap-2 ${showHistory ? 'bg-slate-100 dark:bg-slate-800' : ''}`}>
              <History className="w-4 h-4" /> {showHistory ? 'Hide History' : 'Show History'}
            </Button>
            {canExport('recruitment') && <Button variant="outline" onClick={handleExport} className="gap-2">
              <Download className="w-4 h-4" /> Export Excel
            </Button>}
            {canEdit('recruitment') && <Button onClick={() => setIsScheduleModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Schedule Interview
            </Button>}
          </div>
        }
      />

      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-border bg-surface px-4 py-3">
        <div className="flex shrink-0 rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800" role="group" aria-label="Choose calendar or list view">
          <button
            type="button"
            aria-pressed={viewMode === 'calendar'}
            onClick={() => setViewMode('calendar')}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${viewMode === 'calendar' ? 'bg-white text-slate-900 shadow-sm dark:bg-surface dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
            Calendar View
          </button>
          <button
            type="button"
            aria-pressed={viewMode === 'list'}
            onClick={() => setViewMode('list')}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm dark:bg-surface dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
            List View
          </button>
        </div>
        <div className="flex min-w-0 max-w-full flex-wrap justify-end gap-2" role="group" aria-label="Filter interviews by opening stage">
          {[
            { value: 'ALL', label: 'All' },
            { value: 'TELEPHONIC', label: 'Telephonic' },
            { value: 'HR_INTERVIEW', label: 'HR Interview' },
            { value: 'MANAGEMENT', label: 'Management Interview' },
            { value: 'OFFER', label: 'Offer' },
          ].map((stage) => (
            <button
              key={stage.value}
              type="button"
              aria-pressed={stageFilter === stage.value}
              onClick={() => setStageFilter(stage.value)}
              className={`rounded-full px-3 py-2 text-xs font-semibold transition-colors ${stageFilter === stage.value ? 'bg-brand-primary text-white' : 'bg-tint text-text-muted hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
              {stage.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-surface rounded-xl shadow-sm border border-slate-border overflow-hidden min-h-[400px]">
        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[64rem] text-left text-sm">
              <thead className="bg-tint border-b border-slate-border">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-muted">Candidate & Role</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-muted">Date & Time</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-muted">Mode & Venue</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-muted">Panel</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-muted">Round</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-muted">Status</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-muted">Actions</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-border">
                {isLoading ? (
                  <tr><td colSpan={7} className="py-10"><LoadingSpinner /></td></tr>
                ) : filteredInterviews && filteredInterviews.length > 0 ? (
                  filteredInterviews.map((cand: any) => (
                    <tr key={cand.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900 dark:text-white">{cand.candidateName}</p>
                        <p className="text-xs text-slate-500">{cand.requisition?.positionTitle || 'Unknown Role'}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {cand.interviewDate ? formatDateTime(cand.interviewDate) : 'Not Scheduled'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {cand.interviewLocation || 'In-person'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {cand.interviewer ? `${cand.interviewer.firstName} ${cand.interviewer.lastName}` : 'Unassigned'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {cand.interviewRound ? cand.interviewRound.replace('_', ' ') : 'HR INTERVIEW'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          aria-label={`Status for ${cand.candidateName}`}
                          className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1.5 outline-none cursor-pointer"
                          value={cand.selectionStatus || 'IN_PROGRESS'}
                          onChange={(event) => handleSetStatus(cand.id, event.target.value)}
                          disabled={!canEdit('recruitment') || updateCandidateMutation.isPending}
                        >
                          <option value="IN_PROGRESS">In progress</option>
                          <option value="SELECTION_ON_HOLD">On hold</option>
                          <option value="SELECTED">Selected</option>
                          <option value="SELECTION_REJECTED">Rejected</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <select 
                            className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 outline-none cursor-pointer"
                            value={cand.interviewRound || 'HR_INTERVIEW'}
                            onChange={(e) => handleSetPhase(cand.id, e.target.value)}
                            disabled={!canEdit('recruitment') || updateCandidateMutation.isPending || cand.selectionStatus === 'SELECTION_REJECTED'}
                          >
                            <option value="TELEPHONIC">Telephonic</option>
                            <option value="HR_INTERVIEW">HR Interview</option>
                            <option value="TECHNICAL">Technical</option>
                            <option value="MANAGEMENT">Management</option>
                            <option value="OFFER">Offer</option>
                          </select>
                          {cand.interviewFeedback === 'Finished' ? (
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Finished
                            </span>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => handleMarkFinish(cand.id, cand.interviewRound || 'TELEPHONIC')} disabled={!canEdit('recruitment') || updateCandidateMutation.isPending}>
                              Mark Finish
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
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
                        {canEdit('recruitment') && <Button onClick={() => setIsScheduleModalOpen(true)} className="rounded-xl shadow-sm">
                          Schedule Interview
                        </Button>}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        ) : (

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-border">
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center">
              <CalendarPicker value={selectedDate} onChange={setSelectedDate} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm" />
            </div>
            <div className="md:col-span-2 p-6">
              <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">
                Interviews on {formatDate(selectedDate.toISOString())}
              </h3>
              <div className="space-y-4">
                {filteredInterviews && filteredInterviews.filter((cand: any) => cand.interviewDate && isSameDay(new Date(cand.interviewDate), selectedDate)).length > 0 ? (
                  filteredInterviews.filter((cand: any) => cand.interviewDate && isSameDay(new Date(cand.interviewDate), selectedDate)).map((cand: any) => (
                    <div key={cand.id} className="flex items-start justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-md transition-shadow">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900 dark:text-white">{cand.candidateName}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                            {cand.interviewRound ? cand.interviewRound.replace('_', ' ') : 'HR INTERVIEW'}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{cand.requisition?.positionTitle || 'Unknown Role'}</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                          <span className="flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5" /> {formatDateTime(cand.interviewDate)}</span>
                          <span className="flex items-center gap-1.5">Panel: {cand.interviewer ? `${cand.interviewer.firstName} ${cand.interviewer.lastName}` : 'Unassigned'}</span>
                        </div>
                      </div>
                        <div className="flex flex-col gap-2 shrink-0 items-end">
                        {cand.interviewFeedback === 'Finished' ? (
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Finished</span>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => handleMarkFinish(cand.id, cand.interviewRound || 'TELEPHONIC')} disabled={!canEdit('recruitment') || updateCandidateMutation.isPending}>Mark Finish</Button>
                        )}
                        {!showHistory && canEdit('recruitment') && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleReject(cand.id)} 
                                disabled={updateCandidateMutation.isPending}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 px-2"
                                title="Reject Candidate"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            )}
                            <select 
                          className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-1 py-0.5 outline-none cursor-pointer max-w-[120px]"
                          value={cand.interviewRound || 'HR_INTERVIEW'}
                          onChange={(e) => handleSetPhase(cand.id, e.target.value)}
                          disabled={!canEdit('recruitment') || updateCandidateMutation.isPending || cand.selectionStatus === 'SELECTION_REJECTED'}
                        >
                          <option value="TELEPHONIC">Telephonic</option>
                          <option value="HR_INTERVIEW">HR Interview</option>
                          <option value="TECHNICAL">Technical</option>
                          <option value="MANAGEMENT">Management</option>
                          <option value="OFFER">Offer</option>
                        </select>
                        <select
                          aria-label={`Status for ${cand.candidateName}`}
                          className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-1 py-0.5 outline-none cursor-pointer max-w-[120px]"
                          value={cand.selectionStatus || 'IN_PROGRESS'}
                          onChange={(event) => handleSetStatus(cand.id, event.target.value)}
                          disabled={!canEdit('recruitment') || updateCandidateMutation.isPending}
                        >
                          <option value="IN_PROGRESS">In progress</option>
                          <option value="SELECTION_ON_HOLD">On hold</option>
                          <option value="SELECTED">Selected</option>
                          <option value="SELECTION_REJECTED">Rejected</option>
                        </select>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                      <CalendarDays className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="font-medium text-slate-900 dark:text-white">No interviews</p>
                    <p className="text-sm text-slate-500">There are no interviews scheduled for this date.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        )}
      </div>

      {/* Schedule Interview Modal */}
      <ScheduleInterviewModal isOpen={isScheduleModalOpen && canEdit('recruitment')} onClose={() => setIsScheduleModalOpen(false)} initialRequisitionId={reqId || undefined} />

    </div>
  );
}





