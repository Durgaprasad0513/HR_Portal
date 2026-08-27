import React from 'react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assetsApi } from '@/api/assets';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Plus } from 'lucide-react';

export default function AssetListPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAdminOrHR = user?.role === 'ADMIN' || user?.role === 'HR';

  const { data: assetsData, isLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: isAdminOrHR ? assetsApi.getAll : assetsApi.getMyAssets,
  });

  const createMutation = useMutation({
    mutationFn: assetsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      toast.success('Asset created successfully');
      setIsModalOpen(false);
    },
    onError: () => toast.error('Failed to create asset')
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_USE': return <Badge variant="info">In Use</Badge>;
      case 'RETURNED': return <Badge variant="default">Returned</Badge>;
      case 'DAMAGED': return <Badge variant="danger">Damaged</Badge>;
      case 'LOST': return <Badge variant="danger">Lost</Badge>;
      case 'RETIRED': return <Badge variant="warning">Retired</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  const columns = [
    { header: 'Type', accessor: 'type' },
    { header: 'Category', accessor: 'category' },
    { header: 'Brand/Model', accessor: 'brand' },
    { header: 'Serial', accessor: 'serialNumber' },
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
        <h1 className="text-2xl font-semibold">Assets</h1>
        {isAdminOrHR && (
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Asset
          </Button>
        )}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          columns={columns}
          data={assetsData?.data || []}
          keyField="id"
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Asset">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="type" label="Type" required />
          <Input name="category" label="Category" required />
          <Input name="brand" label="Brand/Model" required />
          <Input name="serialNumber" label="Serial Number" required />
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending}>Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
