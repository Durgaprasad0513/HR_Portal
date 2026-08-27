import React from 'react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { performanceApi } from '@/api/performance';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Plus } from 'lucide-react';

export default function PerformanceListPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isManagerOrHR = user?.role === 'ADMIN' || user?.role === 'HR' || user?.role === 'MANAGER';

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['performanceReviews'],
    queryFn: isManagerOrHR ? performanceApi.getAll : performanceApi.getMyReviews,
  });

  const createMutation = useMutation({
    mutationFn: performanceApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performanceReviews'] });
      toast.success('Review created successfully');
      setIsModalOpen(false);
    },
    onError: () => toast.error('Failed to create review')
  });

  const columns = [
    { header: 'Period', accessor: 'period' },
    { header: 'KRA', accessor: 'kra' },
    { header: 'Ratings', accessor: 'ratings' },
    { header: 'Status', accessor: (row: any) => <Badge variant="info">{row.status}</Badge> },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createMutation.mutate(Object.fromEntries(formData.entries()));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Performance Reviews</h1>
        {isManagerOrHR && (
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> New Review
          </Button>
        )}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <DataTable columns={columns} data={reviewsData?.data || []} keyField="id" />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Performance Review">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="period" label="Review Period" required />
          <Input name="kra" label="Key Result Area" required />
          <Input type="number" name="ratings" label="Ratings (1-5)" min="1" max="5" required />
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending}>Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
