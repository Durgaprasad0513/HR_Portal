import React from 'react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leavesApi } from '@/api/leaves';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function LeaveHistoryPage() {
  const queryClient = useQueryClient();

  const { data: leavesData, isLoading } = useQuery({
    queryKey: ['leaves', 'history'],
    queryFn: leavesApi.getMyLeaves,
  });

  const cancelMutation = useMutation({
    mutationFn: leavesApi.cancel,
    onSuccess: () => {
      toast.success('Leave application cancelled');
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to cancel leave'),
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'danger' | 'warning' | 'default'> = {
      APPROVED: 'success',
      REJECTED: 'danger',
      PENDING: 'warning',
      CANCELLED: 'default',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const columns = [
    { header: 'Type', accessor: 'leaveType' as const },
    { 
      header: 'Start Date', 
      accessor: (row: any) => new Date(row.startDate).toLocaleDateString() 
    },
    { 
      header: 'End Date', 
      accessor: (row: any) => new Date(row.endDate).toLocaleDateString() 
    },
    { header: 'Days', accessor: 'totalDays' as const },
    { 
      header: 'Status', 
      accessor: (row: any) => getStatusBadge(row.status)
    },
    {
      header: 'Actions',
      accessor: (row: any) => row.status === 'PENDING' ? (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => cancelMutation.mutate(row.id)}
          isLoading={cancelMutation.isPending}
        >
          Cancel
        </Button>
      ) : null,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Leave History</h1>
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <DataTable columns={columns} data={leavesData?.data || []} keyField="id" />
      )}
    </div>
  );
}
