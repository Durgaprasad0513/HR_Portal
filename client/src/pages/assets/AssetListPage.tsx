import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assetsApi } from '@/api/assets';
import { employeesApi } from '@/api/employees';
import { useAuth } from '@/contexts/AuthContext';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Laptop, Plus, Settings2, RefreshCcw } from 'lucide-react';

export default function AssetListPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isAdminOrHR = user?.role === 'ADMIN' || user?.role === 'HR';
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [returnConfirmOpen, setReturnConfirmOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: () => assetsApi.getAll().then(res => res.data),
  });

  const { data: empData } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeesApi.getAll({}),
    enabled: isAdminOrHR,
  });

  const createMutation = useMutation({
    mutationFn: (payload: any) => assetsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      setIsModalOpen(false);
    }
  });

  const returnMutation = useMutation({
    mutationFn: (id: string) => assetsApi.returnAsset(id, { returnCondition: 'RETURN_GOOD' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      setReturnConfirmOpen(false);
    }
  });

  const columns = [
    { 
      header: 'Asset', 
      accessor: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
             <Laptop className="w-4 h-4 text-gray-500 dark:text-gray-400 dark:text-gray-500" />
          </div>
          <div>
            <div className="font-semibold text-navy-900 dark:text-white">{row.brandModel || row.assetType}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">SN: {row.serialNumber}</div>
          </div>
        </div>
      )
    },
    { header: 'Type', accessor: 'assetType', className: 'text-gray-600 dark:text-gray-400 dark:text-gray-500' },
    { 
      header: 'Assigned To', 
      accessor: (row: any) => row.assignedEmployee ? `${row.assignedEmployee.firstName} ${row.assignedEmployee.lastName}` : <span className="text-gray-400 dark:text-gray-500">Unassigned</span>,
      className: 'text-gray-600 dark:text-gray-400 dark:text-gray-500'
    },
    { 
      header: 'Status', 
      accessor: (row: any) => {
        if (row.status === 'IN_USE') return <Badge variant="success">In Use</Badge>;
        if (row.status === 'RETURNED') return <Badge variant="default">Returned</Badge>;
        return <Badge variant="warning">{row.status}</Badge>;
      }
    },
    { 
      header: 'Action', 
      accessor: (row: any) => (
        <div className="flex items-center gap-2">
          {row.status === 'IN_USE' && row.assignedEmployee?.id === user?.employeeId && (
            <button 
              className="p-1 text-gray-400 dark:text-gray-500 hover:text-amber-500 transition-colors" 
              title="Return Asset"
              onClick={() => {
                setSelectedAssetId(row.id);
                setReturnConfirmOpen(true);
              }}
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
          )}
          {isAdminOrHR && (
             <button className="p-1 text-gray-400 dark:text-gray-500 hover:text-navy-900 dark:text-white transition-colors">
               <Settings2 className="w-4 h-4" />
             </button>
          )}
        </div>
      ) 
    },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const assignedEmployeeId = formData.get('assignedEmployeeId') as string;
    createMutation.mutate({
      assetType: formData.get('assetType'),
      assetCategory: formData.get('assetCategory'),
      brandModel: formData.get('brandModel'),
      serialNumber: formData.get('serialNumber'),
      purchaseValue: Number(formData.get('purchaseValue')),
      ...(assignedEmployeeId ? { assignedEmployeeId, status: 'IN_USE' } : {})
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900 dark:text-white">Asset Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">{isAdminOrHR ? 'Manage company assets and assignments' : 'View your assigned hardware and equipment'}</p>
        </div>
        
        {isAdminOrHR && (
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Add Asset
          </Button>
        )}
      </div>

      <div className="animate-in fade-in">
        {isLoading ? (
          <div className="py-12"><LoadingSpinner /></div>
        ) : !data || data.length === 0 ? (
          <EmptyState 
            icon={Laptop}
            title={isAdminOrHR ? "No assets in inventory" : "No assigned assets"}
            description={isAdminOrHR ? "Start tracking hardware by adding your first asset." : "You do not currently have any equipment assigned to you."}
            actionLabel={isAdminOrHR ? "Add Asset" : undefined}
            onAction={isAdminOrHR ? () => setIsModalOpen(true) : undefined}
          />
        ) : (
          <DataTable 
            columns={columns} 
            data={data} 
            keyField="id" 
            emptyMessage="No assets found."
          />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Asset">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Asset Type</label>
              <select name="assetType" className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500">
                <option value="LAPTOP">Laptop</option>
                <option value="DESKTOP">Desktop</option>
                <option value="MOBILE">Mobile</option>
                <option value="ASSET_OTHER">Other</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select name="assetCategory" className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500">
                <option value="IT">IT Equipment</option>
                <option value="NON_IT">Non-IT</option>
              </select>
            </div>
          </div>
          <Input name="brandModel" label="Brand & Model" placeholder="e.g. MacBook Pro 16" required />
          <Input name="serialNumber" label="Serial Number" required />
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign To (Optional)</label>
            <select name="assignedEmployeeId" className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500">
              <option value="">Unassigned</option>
              {empData?.data?.map((emp: any) => (
                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
              ))}
            </select>
          </div>
          <Input name="purchaseValue" label="Purchase Value (₹)" type="number" step="0.01" />
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Saving...' : 'Add Asset'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog 
        isOpen={returnConfirmOpen}
        title="Return Asset"
        message="Are you sure you want to return this asset? This will notify IT and unassign it from your profile."
        confirmLabel="Confirm Return"
        onConfirm={() => selectedAssetId && returnMutation.mutate(selectedAssetId)}
        onCancel={() => {
          setReturnConfirmOpen(false);
          setSelectedAssetId(null);
        }}
      />
    </div>
  );
}
