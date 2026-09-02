import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recruitmentApi } from '@/api/recruitment';
import { departmentsApi } from '@/api/departments';
import { useAuth } from '@/contexts/AuthContext';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { UserSearch, Plus, Briefcase, Users } from 'lucide-react';

export default function RecruitmentPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isAdminOrHR = user?.role === 'ADMIN' || user?.role === 'HR';
  
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);

  const { data: deptData } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentsApi.getAll,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['requisitions'],
    queryFn: () => recruitmentApi.getRequisitions().then(res => res.data),
  });

  const createReqMutation = useMutation({
    mutationFn: (payload: any) => recruitmentApi.createRequisition(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requisitions'] });
      setIsReqModalOpen(false);
    }
  });

  const columns = [
    { 
      header: 'Position', 
      accessor: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-emerald-50 flex items-center justify-center">
             <Briefcase className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <div className="font-semibold text-navy-900 dark:text-white">{row.positionTitle}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">{row.location}</div>
          </div>
        </div>
      )
    },
    { 
      header: 'Department', 
      accessor: (row: any) => row.department?.name,
      className: 'text-gray-600 dark:text-gray-400 dark:text-gray-500'
    },
    { 
      header: 'Vacancies', 
      accessor: 'numberOfVacancies',
      className: 'text-gray-600 dark:text-gray-400 dark:text-gray-500'
    },
    { 
      header: 'Candidates', 
      accessor: (row: any) => (
        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 dark:text-gray-500">
           <Users className="w-4 h-4" /> {row._count?.candidates || 0}
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: (row: any) => {
        if (row.status === 'OPEN') return <Badge variant="success">Open</Badge>;
        if (row.status === 'CLOSED') return <Badge variant="default">Closed</Badge>;
        if (row.status === 'ON_HOLD') return <Badge variant="warning">On Hold</Badge>;
        return <Badge variant="default">{row.status}</Badge>;
      }
    },
  ];

  const handleSubmitReq = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createReqMutation.mutate({
      positionTitle: formData.get('positionTitle'),
      departmentId: formData.get('departmentId'),
      location: formData.get('location'),
      numberOfVacancies: Number(formData.get('numberOfVacancies')),
      requisitionDate: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900 dark:text-white">Recruitment Tracker</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">Manage job requisitions and candidate pipelines</p>
        </div>
        
        {isAdminOrHR && (
          <Button onClick={() => setIsReqModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> New Requisition
          </Button>
        )}
      </div>

      <div className="animate-in fade-in">
        {isLoading ? (
          <div className="py-12"><LoadingSpinner /></div>
        ) : !data || data.length === 0 ? (
          <EmptyState 
            icon={UserSearch}
            title="No open requisitions"
            description="There are currently no active job openings."
            actionLabel={isAdminOrHR ? "Create Requisition" : undefined}
            onAction={() => {
              if (isAdminOrHR) setIsReqModalOpen(true);
            }}
          />
        ) : (
          <DataTable 
            columns={columns} 
            data={data} 
            keyField="id" 
            emptyMessage="No requisitions found."
          />
        )}
      </div>

      <Modal isOpen={isReqModalOpen} onClose={() => setIsReqModalOpen(false)} title="New Job Requisition">
        <form onSubmit={handleSubmitReq} className="space-y-4">
          <Input name="positionTitle" label="Job Title" placeholder="e.g. Senior Frontend Engineer" required />
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
            <Select name="departmentId" required className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500">
              <option value="">Select Department...</option>
              {deptData?.data?.map((dept: any) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input name="location" label="Location" placeholder="e.g. Remote" required />
            <Input name="numberOfVacancies" label="Vacancies" type="number" min="1" required />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsReqModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createReqMutation.isPending}>
              {createReqMutation.isPending ? 'Submitting...' : 'Create Requisition'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
