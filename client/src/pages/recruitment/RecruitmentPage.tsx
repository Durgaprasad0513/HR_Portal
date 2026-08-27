import React from 'react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recruitmentApi } from '@/api/recruitment';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

export default function RecruitmentPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const createMutation = useMutation({
    mutationFn: recruitmentApi.createRequisition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requisitions'] });
      toast.success('Requisition created successfully');
      setIsModalOpen(false);
    },
    onError: () => toast.error('Failed to create requisition')
  });

  const reqColumns = [
    { header: 'Position', accessor: 'position' },
    { header: 'Department', accessor: 'department' },
    { header: 'Vacancies', accessor: 'vacancies' },
    { header: 'Status', accessor: (row: any) => <Badge variant="info">{row.status}</Badge> },
    { header: 'Actions', accessor: (row: any) => (
      <Button variant="outline" size="sm" onClick={() => setSelectedReq(row.id)}>View Candidates</Button>
    )},
  ];

  const candColumns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Experience', accessor: 'experience' },
    { header: 'Status', accessor: (row: any) => <Badge variant="default">{row.status}</Badge> },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createMutation.mutate(Object.fromEntries(formData.entries()));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Recruitment</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> New Requisition
        </Button>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <DataTable columns={reqColumns} data={requisitionsData?.data || []} keyField="id" />
      )}

      {selectedReq && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Candidates for Selected Requisition</h2>
          <DataTable columns={candColumns} data={candidatesData?.data || []} keyField="id" />
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Requisition">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="position" label="Position" required />
          <Input name="department" label="Department" required />
          <Input type="number" name="vacancies" label="Vacancies" required />
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending}>Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
