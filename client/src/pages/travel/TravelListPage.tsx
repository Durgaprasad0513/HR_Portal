import React from 'react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { travelApi } from '@/api/travel';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Plus } from 'lucide-react';

export default function TravelListPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAdminOrHR = user?.role === 'ADMIN' || user?.role === 'HR';

  const { data: travelData, isLoading } = useQuery({
    queryKey: ['travelRequests'],
    queryFn: isAdminOrHR ? travelApi.getAll : travelApi.getMyRequests,
  });

  const createMutation = useMutation({
    mutationFn: travelApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travelRequests'] });
      toast.success('Travel request created successfully');
      setIsModalOpen(false);
    },
    onError: () => toast.error('Failed to create travel request')
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVAL_PENDING': return <Badge variant="warning">Pending</Badge>;
      case 'APPROVAL_APPROVED': return <Badge variant="success">Approved</Badge>;
      case 'APPROVAL_REJECTED': return <Badge variant="danger">Rejected</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  const columns: any[] = [
    { header: 'Purpose', accessor: ((row: any) => row.travelPurpose) as any },
    { header: 'Destination', accessor: ((row: any) => row.destination) as any },
    { header: 'Start Date', accessor: (row: any) => new Date(row.startDate).toLocaleDateString() },
    { header: 'End Date', accessor: (row: any) => new Date(row.endDate).toLocaleDateString() },
    { header: 'Amount', accessor: ((row: any) => row.advanceRequested) as any },
    { header: 'Status', accessor: (row: any) => getStatusBadge(row.status) },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createMutation.mutate(Object.fromEntries(formData.entries()));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Travel Requests</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> New Request
        </Button>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          columns={columns}
          data={travelData?.data || []}
          keyField="id"
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Travel Request">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="purpose" label="Purpose" required />
          <Input name="destination" label="Destination" required />
          <Input type="date" name="startDate" label="Start Date" required />
          <Input type="date" name="endDate" label="End Date" required />
          <Input type="number" name="advanceAmount" label="Advance Amount" required />
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending}>Submit</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
