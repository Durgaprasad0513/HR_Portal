import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Search, Target, ClipboardCheck, Clock3, ShieldCheck, CheckCircle2, CalendarDays, List, Milestone } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'My Performance' | 'Team/Company Reviews';

import { useQuery } from '@tanstack/react-query';
import { performanceApi } from '@/api/performance';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PerformanceReviewModal } from './PerformanceReviewModal';
import { PerformanceCreateModal } from './PerformanceCreateModal';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { DataTable } from '@/components/ui/DataTable';

export default function PerformanceListPage() {
  const { user } = useAuth();
  const isAdminOrHR = user?.role === 'ADMIN' || user?.role === 'HR';
  const secondTabName: Tab = isAdminOrHR ? 'Team/Company Reviews' : 'Team/Company Reviews'; // Simplified for type matching
  const [activeTab, setActiveTab] = useState<Tab>('My Performance');
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [viewMode, setViewMode] = useState<'list' | 'timeline' | 'calendar'>('list');
  
  const { data: rawReviews, isLoading } = useQuery({
    queryKey: ['performance', activeTab],
    queryFn: () => activeTab === 'My Performance' ? performanceApi.getMyReviews().then(res => res.data) : performanceApi.getAll().then(res => res.data)
  });

  const reviews = React.useMemo(() => {
    if (!rawReviews) return [];
    return rawReviews.filter((review: any) => {
      const searchStr = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        (review.employee?.firstName?.toLowerCase().includes(searchStr)) || 
        (review.employee?.lastName?.toLowerCase().includes(searchStr)) ||
        (review.reviewPeriod?.toLowerCase().includes(searchStr));
      
      const matchesType = typeFilter === 'All Types' || review.reviewPeriod === typeFilter.toUpperCase().replace(' ', '_');
      const matchesStatus = statusFilter === 'All Status' || review.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [rawReviews, searchQuery, typeFilter, statusFilter]);

  const hasActiveFilters = Boolean(searchQuery || typeFilter !== 'All Types' || statusFilter !== 'All Status');

  const actionableReviews = React.useMemo(() => {
    if (!rawReviews) return [];
    const actionableStatuses = user?.role === 'EMPLOYEE'
      ? ['EMPLOYEE_REVIEW']
      : user?.role === 'MANAGER'
        ? ['MANAGER_REVIEW']
        : ['HR_REVIEW', 'FINAL_APPROVAL'];
    return rawReviews.filter((review: any) => actionableStatuses.includes(review.status)).slice(0, 4);
  }, [rawReviews, user?.role]);

  const actionLabel = (status: string) => {
    switch (status) {
      case 'EMPLOYEE_REVIEW': return 'Complete self-review';
      case 'MANAGER_REVIEW': return 'Review employee';
      case 'HR_REVIEW': return 'Complete HR review';
      case 'FINAL_APPROVAL': return 'Finalize review';
      default: return 'Open review';
    }
  };

  const actionIcon = (status: string) => {
    if (status === 'FINAL_APPROVAL') return <ShieldCheck className="h-4 w-4" />;
    if (status === 'HR_REVIEW') return <ClipboardCheck className="h-4 w-4" />;
    if (status === 'COMPLETED') return <CheckCircle2 className="h-4 w-4" />;
    return <Clock3 className="h-4 w-4" />;
  };

  const formatReviewPeriod = (period?: string) => {
    if (!period) return 'Review';
    return period.toLowerCase().replace('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('All Types');
    setStatusFilter('All Status');
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'EMPLOYEE_REVIEW': return <Badge variant="default">Self Review Pending</Badge>;
      case 'MANAGER_REVIEW': return <Badge variant="info">Manager Review Pending</Badge>;
      case 'HR_REVIEW': return <Badge variant="warning">HR Review Pending</Badge>;
      case 'FINAL_APPROVAL': return <Badge className="bg-purple-500 text-white hover:bg-purple-600">Final Approval Pending</Badge>;
      case 'COMPLETED': return <Badge variant="success">Completed</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getReviewEmployee = (review: any) => review.employee ? `${review.employee.firstName} ${review.employee.lastName}` : 'My review';

  const renderReviewList = () => (
    <DataTable
      caption="Performance reviews"
      data={reviews}
      keyField="id"
      pageSize={8}
      onRowClick={(review: any) => setSelectedReview(review)}
      emptyMessage="No reviews match the selected filters."
      columns={[
        { header: 'Employee', accessor: (review: any) => <span className="font-medium text-navy-900 dark:text-white">{getReviewEmployee(review)}</span> },
        { header: 'Review cycle', accessor: (review: any) => formatReviewPeriod(review.reviewPeriod), sortable: true },
        { header: 'Stage', accessor: (review: any) => getStatusBadge(review.status) },
        { header: 'Self', accessor: (review: any) => review.selfRating != null ? `${review.selfRating}/5` : 'Not rated' },
        { header: 'Manager', accessor: (review: any) => review.managerRating != null ? `${review.managerRating}/5` : 'Not rated' },
        { header: 'Final', accessor: (review: any) => review.finalRating != null ? `${review.finalRating}/5` : 'Pending' },
        { header: 'Next action', accessor: (review: any) => <span className="font-medium text-accent-700 dark:text-accent-300">{actionLabel(review.status)}</span> }
      ]}
    />
  );

  const renderReviewTimeline = () => (
    <div className="relative ml-4 space-y-6 border-l-2 border-gray-100 pl-12 dark:border-gray-800">
      {reviews.map((review: any) => (
        <Card key={review.id} className="relative cursor-pointer transition-shadow hover:shadow-md" onClick={() => setSelectedReview(review)}>
          <div className="absolute -left-[3.5rem] top-8 w-6 border-t-2 border-dashed border-gray-100 dark:border-gray-800" />
          <div className="absolute -left-[3.8rem] top-7 h-3 w-3 rounded-full bg-gray-200 ring-4 ring-white dark:ring-slate-900" />
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 sm:flex-row">
              <div className="flex-shrink-0"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50 text-lg font-bold text-accent-600 dark:bg-accent-900/50 dark:text-accent-400">{review.reviewPeriod === 'ANNUAL' ? 'A' : review.reviewPeriod === 'HALF_YEARLY' ? 'H' : review.reviewPeriod === 'MONTHLY' ? 'M' : 'Q'}</div></div>
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-3"><h3 className="text-lg font-bold text-navy-900 dark:text-white">{formatReviewPeriod(review.reviewPeriod)} review</h3>{getStatusBadge(review.status)}</div>
                <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                  <div><p className="mb-0.5 text-gray-500 dark:text-gray-400">Employee</p><p className="font-medium text-navy-900 dark:text-white">{getReviewEmployee(review)}</p></div>
                  <div><p className="mb-0.5 text-gray-500 dark:text-gray-400">Self rating</p><p className="font-medium text-navy-900 dark:text-white">{review.selfRating != null ? `${review.selfRating}/5` : 'Not rated'}</p></div>
                  <div><p className="mb-0.5 text-gray-500 dark:text-gray-400">Manager rating</p><p className="font-medium text-navy-900 dark:text-white">{review.managerRating != null ? `${review.managerRating}/5` : 'Not rated'}</p></div>
                  <div><p className="mb-0.5 text-gray-500 dark:text-gray-400">Final score</p><p className="font-medium text-navy-900 dark:text-white">{review.finalRating != null ? `${review.finalRating}/5` : 'Not finalized'}</p></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderReviewCalendar = () => {
    const groupedReviews = reviews.reduce((groups: Record<string, any[]>, review: any) => {
      const date = review.createdAt ? new Date(review.createdAt) : null;
      const key = date && !Number.isNaN(date.getTime()) ? date.toISOString().slice(0, 10) : 'unknown';
      groups[key] = [...(groups[key] || []), review];
      return groups;
    }, {});

    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">Review dates are based on when each cycle was initiated.</p>
        {Object.entries(groupedReviews).map(([dateKey, dateReviews]) => {
          const date = dateKey === 'unknown' ? null : new Date(`${dateKey}T00:00:00`);
          return (
            <div key={dateKey} className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 sm:flex-row sm:items-start dark:border-slate-700">
              <div className="w-28 shrink-0"><p className="text-xs font-semibold uppercase text-gray-500">{date ? date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Date unknown'}</p><p className="text-xs text-gray-400">{date?.getFullYear() || ''}</p></div>
              <div className="grid flex-1 gap-2 md:grid-cols-2">{dateReviews.map((review: any) => <button key={review.id} type="button" onClick={() => setSelectedReview(review)} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-left hover:bg-accent-50 dark:bg-slate-800/60 dark:hover:bg-slate-800"><span><span className="block font-medium text-navy-900 dark:text-white">{getReviewEmployee(review)}</span><span className="text-xs text-gray-500">{formatReviewPeriod(review.reviewPeriod)} · {actionLabel(review.status)}</span></span>{getStatusBadge(review.status)}</button>)}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <PageHeader
        title="Performance"
        description="Track review progress, feedback, and next approvals."
        actions={<>
          {(user?.role === 'ADMIN' || user?.role === 'HR') && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Initiate Review
            </Button>
          )}
          <div className="flex bg-surface p-1 rounded-full w-full sm:w-auto">
          {(['My Performance', 'Team/Company Reviews'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-full transition-colors flex-1 sm:flex-none text-center",
                activeTab === tab 
                  ? "bg-surface text-navy-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300"
              )}
            >
              {tab}
            </button>
          ))}
          </div>
        </>}
      />

      <section className="rounded-xl border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700" aria-labelledby="action-needed-heading">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="action-needed-heading" className="text-lg font-semibold text-navy-900 dark:text-white">Action needed</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Reviews waiting for your next step.</p>
          </div>
          <span className="rounded-full bg-accent-50 px-3 py-1 text-sm font-semibold text-accent-700 dark:bg-accent-900/30 dark:text-accent-300">{actionableReviews.length}</span>
        </div>
        {actionableReviews.length > 0 ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {actionableReviews.map((review: any) => (
              <button key={review.id} type="button" onClick={() => setSelectedReview(review)} className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4 text-left transition-colors hover:border-accent-400 hover:bg-accent-50/40 dark:border-slate-700 dark:hover:bg-slate-800">
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent-50 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300">{actionIcon(review.status)}</span>
                  <span className="min-w-0"><span className="block truncate font-medium text-navy-900 dark:text-white">{review.employee ? `${review.employee.firstName} ${review.employee.lastName}` : 'My review'}</span><span className="block text-sm text-gray-500 dark:text-gray-400">{formatReviewPeriod(review.reviewPeriod)} · {actionLabel(review.status)}</span></span>
                </span>
                <span className="shrink-0 text-sm font-semibold text-accent-700 dark:text-accent-300">Open</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-3 text-sm text-gray-600 dark:bg-slate-800/60 dark:text-gray-300"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> You’re all caught up.</div>
        )}
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-surface shadow-sm dark:border-slate-700" aria-labelledby="review-register-heading">
        <div className="border-b border-slate-200 p-5 dark:border-slate-700">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div><h2 id="review-register-heading" className="text-lg font-semibold text-navy-900 dark:text-white">Review register</h2><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Browse review progress and open a record to take action.</p></div>
            <div className="flex rounded-lg border border-slate-200 p-1 dark:border-slate-700" role="tablist" aria-label="Review display mode">
              {[{ value: 'list', label: 'List', icon: List }, { value: 'timeline', label: 'Timeline', icon: Milestone }, { value: 'calendar', label: 'Calendar', icon: CalendarDays }].map(({ value, label, icon: Icon }) => <button key={value} type="button" role="tab" aria-selected={viewMode === value} onClick={() => setViewMode(value as 'list' | 'timeline' | 'calendar')} className={cn('flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors', viewMode === value ? 'bg-accent-600 text-white' : 'text-gray-500 hover:bg-slate-100 dark:text-gray-400 dark:hover:bg-slate-800')}><Icon className="h-4 w-4" />{label}</button>)}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-64"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" /><input aria-label="Search reviews" placeholder="Search reviews..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-surface py-2 pl-9 pr-4 text-sm shadow-sm transition-all focus:outline-none dark:border-slate-600" /></div>
            <select aria-label="Filter by review cycle" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded-lg border border-slate-border bg-surface px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:text-gray-400 dark:focus:ring-slate-600"><option value="All Types">All cycles</option><option value="Monthly">Monthly</option><option value="Quarterly">Quarterly</option><option value="Half Yearly">Half-yearly</option><option value="Annual">Annual</option></select>
            <select aria-label="Filter by review status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-border bg-surface px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:text-gray-400 dark:focus:ring-slate-600"><option value="All Status">All stages</option><option value="EMPLOYEE_REVIEW">Self-review pending</option><option value="MANAGER_REVIEW">Manager review pending</option><option value="HR_REVIEW">HR review pending</option><option value="FINAL_APPROVAL">Final approval pending</option><option value="COMPLETED">Completed</option></select>
            {hasActiveFilters && <button onClick={clearFilters} className="text-sm text-gray-500 underline underline-offset-2 hover:text-navy-900 dark:text-gray-400 dark:hover:text-white">Clear filters</button>}
          </div>
        </div>

        <div className="p-5">
        {isLoading ? (
          <LoadingSpinner />
        ) : !reviews || reviews.length === 0 ? (
          <EmptyState
            icon={Target}
            title={hasActiveFilters ? 'No reviews match your filters' : 'No performance reviews yet'}
            description={
              hasActiveFilters
                ? 'Adjust or clear the filters to see more review cycles.'
                : isAdminOrHR
                  ? 'Start a review cycle to set goals, collect feedback, and track approvals.'
                  : 'Your assigned review cycles will appear here when they are initiated.'
            }
            actionLabel={hasActiveFilters ? 'Clear filters' : isAdminOrHR ? 'Initiate review' : undefined}
            onAction={hasActiveFilters ? clearFilters : isAdminOrHR ? () => setIsCreateModalOpen(true) : undefined}
          />
        ) : viewMode === 'list' ? renderReviewList() : viewMode === 'timeline' ? renderReviewTimeline() : renderReviewCalendar()}
        </div>
      </section>

      {selectedReview && (
        <PerformanceReviewModal
          isOpen={!!selectedReview}
          onClose={() => setSelectedReview(null)}
          review={selectedReview}
        />
      )}

      <PerformanceCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
