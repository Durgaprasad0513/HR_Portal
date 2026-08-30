import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trainingApi } from '@/api/training';
import { DataTable } from '@/components/ui/DataTable';
import {} from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Plus } from 'lucide-react';

export default function TrainingListPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAdminOrHR = user?.role === 'ADMIN' || user?.role === 'HR';

  const { data: trainingData, isLoading } = useQuery({
    queryKey: ['trainings'],
    queryFn: isAdminOrHR ? trainingApi.getAll : trainingApi.getMyTrainings,
  });

  const createMutation = useMutation({
    mutationFn: trainingApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
      toast.success('Training session created successfully');
      setIsModalOpen(false);
    },
    onError: () => toast.error('Failed to create training')
  });

  const columns = [
    { header: 'Topic', accessor: 'topic' },
    { header: 'Type', accessor: 'type' },
    { header: 'Trainer', accessor: 'trainer' },
    { header: 'Date', accessor: (row: any) => new Date(row.date).toLocaleDateString() },
    { header: 'Location', accessor: 'location' },
    { header: 'Hours', accessor: 'hours' },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createMutation.mutate(Object.fromEntries(formData.entries()));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Training Sessions</h1>
        {isAdminOrHR && (
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> New Training
          </Button>
        )}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <DataTable columns={columns} data={trainingData?.data || []} keyField="id" />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Training Session">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="topic" label="Topic" required />
          <Input name="type" label="Type" required />
          <Input name="trainer" label="Trainer" required />
          <Input type="date" name="date" label="Date" required />
          <Input name="location" label="Location" required />
          <Input type="number" name="hours" label="Duration (Hours)" required />
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending}>Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
