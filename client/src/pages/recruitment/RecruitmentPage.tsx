import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recruitmentApi } from '@/api/recruitment';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Search, Plus, MoreHorizontal, FileText, Star } from 'lucide-react';
import { KanbanBoard } from './KanbanBoard';
import { cn } from '@/lib/utils';

type Tab = 'Jobs' | 'Candidates' | 'Working Process';

export default function RecruitmentPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>('Jobs');
  const [selectedReq, setSelectedReq] = useState<string | null>(null);

  const { data: requisitionsData, isLoading } = useQuery({
    queryKey: ['requisitions'],
    queryFn: recruitmentApi.getRequisitions,
  });

  const { data: candidatesData } = useQuery({
    queryKey: ['candidates', selectedReq],
    queryFn: () => recruitmentApi.getCandidates(selectedReq!),
    enabled: !!selectedReq,
  });

  const handleStatusChange = (candidateId: string, newStatus: string) => {
    // In real app, call API
    // updateCandidateMutation.mutate({ id: candidateId, status: newStatus });
  };

  const jobColumns = [
    { header: 'Job title', accessor: (row: any) => <span className="font-semibold text-navy-900">{row.position}</span> },
    { header: 'Total Candidates', accessor: () => (
      <div className="flex items-center gap-1"><UsersIcon className="w-4 h-4 text-gray-400" /> 12</div>
    ) },
    { header: 'Vacancies', accessor: 'vacancies', className: 'text-gray-600' },
    { header: 'Status', accessor: (row: any) => <Badge variant="success">Published</Badge> },
    { header: 'Department', accessor: 'department', className: 'text-gray-600' },
    { header: 'Employment Type', accessor: () => <Badge variant="default">Full-time</Badge> },
    { header: 'Action', accessor: (row: any) => (
      <button 
        className="text-gray-400 hover:text-navy-900"
        onClick={() => { setSelectedReq(row.id); setActiveTab('Candidates'); }}
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>
    ) },
  ];

  // Dummy mock data since API structure might vary
  const candidateColumns = [
    { header: 'Name', accessor: (row: any) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 font-bold text-xs">
          {row.name.substring(0,2).toUpperCase()}
        </div>
        <span className="font-semibold text-navy-900">{row.name}</span>
      </div>
    ) },
    { header: 'Ratings', accessor: () => (
      <div className="flex text-amber-400"><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 text-gray-300"/></div>
    ) },
    { header: 'Stages', accessor: (row: any) => <span className="text-gray-600">{row.status}</span> },
    { header: 'CV', accessor: () => <FileText className="w-5 h-5 text-accent-500 cursor-pointer" /> },
    { header: 'Applied Date', accessor: () => <span className="text-gray-600">Nov 15, 2023</span> },
    { header: 'Department', accessor: () => <span className="text-gray-600">Design</span> },
    { header: 'Employment Type', accessor: () => <Badge variant="success">Full-time</Badge> },
    { header: 'Action', accessor: () => <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" /> },
  ];

  const mockCandidates = candidatesData?.data || [
     { id: '1', name: 'Darrell Steward', status: 'Screening', email: 'darrell@example.com', experience: '5 years' },
     { id: '2', name: 'Wade Warren', status: '1st Interview', email: 'wade@example.com', experience: '3 years' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">Recruitment</h1>
        
        <div className="flex bg-gray-100 p-1 rounded-full w-full sm:w-auto">
          {(['Jobs', 'Candidates', 'Working Process'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-full transition-colors flex-1 sm:flex-none text-center",
                activeTab === tab 
                  ? "bg-white text-navy-900 shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              placeholder="Search..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all"
            />
          </div>
          
          <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500">
            <option>All Departments</option>
          </select>
          
          {activeTab !== 'Jobs' && (
            <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500">
              <option>All Stages</option>
            </select>
          )}

          <button className="text-sm text-gray-500 hover:text-navy-900 underline underline-offset-2">
            Clear filters
          </button>
        </div>

        {activeTab === 'Jobs' && (
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Add new
          </Button>
        )}
      </div>

      <div className="animate-in fade-in">
        {isLoading ? (
          <div className="py-12"><LoadingSpinner /></div>
        ) : (
          <>
            {activeTab === 'Jobs' && (
              <DataTable columns={jobColumns} data={requisitionsData?.data || []} keyField="id" selectable />
            )}
            
            {activeTab === 'Candidates' && (
              <DataTable columns={candidateColumns} data={mockCandidates} keyField="id" selectable />
            )}

            {activeTab === 'Working Process' && (
              <div className="mt-4">
                <KanbanBoard candidates={mockCandidates} onStatusChange={handleStatusChange} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function UsersIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
