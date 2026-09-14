import React from 'react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leavesApi } from '@/api/leaves';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function LeaveApprovalsPage() {
  const queryClient = useQueryClient();
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [remarks, setRemarks] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [action, setAction] = useState<'APPROVED' | 'REJECTED'>('APPROVED');

  const { data: leavesData, isLoading } = useQuery({
    queryKey: ['leaves', 'pending'],
    queryFn: leavesApi.getPending,
  });

  const statusMutation = useMutation({
    mutationFn: leavesApi.updateStatus,
    onSuccess: () => {
      toast.success(`Leave request ${action.toLowerCase()}`);
      queryClient.invalidateQueries({ queryKey: ['leaves', 'pending'] });
      setIsModalOpen(false);
      setSelectedLeave(null);
      setRemarks('');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Action failed'),
  });

  const handleAction = (leave: any, newAction: 'APPROVED' | 'REJECTED') => {
    setSelectedLeave(leave);
    setAction(newAction);
    setIsModalOpen(true);
  };

  const submitAction = () => {
    if (selectedLeave) {
      statusMutation.mutate({ id: selectedLeave.id, status: action, remarks });
    }
  };

  const columns = [
    { 
      header: 'Employee', 
      accessor: (row: any) => `${row.employee?.firstName} ${row.employee?.lastName}` 
    },
    { header: 'Type', accessor: 'leaveType' as const },
    { 
      header: 'Dates', 
      accessor: (row: any) => `${new Date(row.startDate).toLocaleDateString()} - ${new Date(row.endDate).toLocaleDateString()}` 
    },
    { header: 'Days', accessor: 'totalDays' as const },
    { 
      header: 'Reason', 
      accessor: (row: any) => <span className="truncate max-w-[200px] block" title={row.reason}>{row.reason}</span> 
    },
    {
      header: 'Actions',
      accessor: (row: any) => (
        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={() => handleAction(row, 'APPROVED')}>Approve</Button>
          <Button variant="danger" size="sm" onClick={() => handleAction(row, 'REJECTED')}>Reject</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Leave Approvals</h1>
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <DataTable columns={columns} data={leavesData?.data || []} keyField="id" />
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={`${action === 'APPROVED' ? 'Approve' : 'Reject'} Leave Request`}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to {action.toLowerCase()} the leave request for 
            <strong> {selectedLeave?.employee?.firstName} {selectedLeave?.employee?.lastName}</strong>?
          </p>
          
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-700">Remarks (Optional)</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="flex min-h-[100px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Add any remarks here..."
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button 
              variant={action === 'APPROVED' ? 'primary' : 'danger'} 
              onClick={submitAction}
              isLoading={statusMutation.isPending}
            >
              Confirm {action === 'APPROVED' ? 'Approval' : 'Rejection'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
