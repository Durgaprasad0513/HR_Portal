import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { travelApi } from '@/api/travel';
import { useAuth } from '@/contexts/AuthContext';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Plane, Plus, FileText, CheckCircle2 } from 'lucide-react';

export default function TravelListPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['travel'],
    queryFn: () => travelApi.getAll().then(res => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (payload: any) => travelApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travel'] });
      setIsModalOpen(false);
    }
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => travelApi.updateApproval(id, { approvalStatus: status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travel'] });
      setApprovalModalOpen(false);
    }
  });

  const columns = [
    { 
      header: 'Destination & Purpose', 
      accessor: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-indigo-50 flex items-center justify-center">
             <Plane className="w-4 h-4 text-indigo-500" />
          </div>
          <div>
            <div className="font-semibold text-navy-900">{row.destination}</div>
            <div className="text-xs text-gray-500 max-w-[200px] truncate">{row.travelPurpose}</div>
          </div>
        </div>
      )
    },
    { 
      header: 'Employee', 
      accessor: (row: any) => `${row.employee.firstName} ${row.employee.lastName}`,
      className: 'text-gray-600'
    },
    { 
      header: 'Dates', 
      accessor: (row: any) => `${new Date(row.startDate).toLocaleDateString()} - ${new Date(row.endDate).toLocaleDateString()}`,
      className: 'text-gray-600 text-sm'
    },
    { 
      header: 'Approval', 
      accessor: (row: any) => {
        if (row.approvalStatus === 'APPROVED') return <Badge variant="success">Approved</Badge>;
        if (row.approvalStatus === 'REJECTED') return <Badge variant="danger">Rejected</Badge>;
        return <Badge variant="warning">Pending</Badge>;
      }
    },
    { 
      header: 'Settlement', 
      accessor: (row: any) => {
        if (row.settlementStatus === 'SETTLED') return <Badge variant="success">Settled</Badge>;
        return <Badge variant="default">Unsettled</Badge>;
      }
    },
    { 
      header: 'Action', 
      accessor: (row: any) => (
        <div className="flex items-center gap-2">
          {row.approvalStatus === 'APPROVAL_PENDING' && row.employee.id !== user?.employeeId && (
            <button 
              className="p-1 text-gray-400 hover:text-green-500 transition-colors" 
              title="Review"
              onClick={() => {
                setSelectedRequestId(row.id);
                setApprovalModalOpen(true);
              }}
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
          <button className="p-1 text-gray-400 hover:text-navy-900 transition-colors">
            <FileText className="w-4 h-4" />
          </button>
        </div>
      ) 
    },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createMutation.mutate({
      travelPurpose: formData.get('travelPurpose'),
      destination: formData.get('destination'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
      travelMode: formData.get('travelMode'),
      advanceRequested: Number(formData.get('advanceRequested'))
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900">Travel Requests</h1>
          <p className="text-sm text-gray-500 mt-1">Manage travel approvals and expense settlements</p>
        </div>
        
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> New Travel Request
        </Button>
      </div>

      <div className="animate-in fade-in">
        {isLoading ? (
          <div className="py-12"><LoadingSpinner /></div>
        ) : !data || data.length === 0 ? (
          <EmptyState 
            icon={Plane}
            title="No travel requests"
            description="You don't have any travel requests or approvals pending."
            actionLabel="Create Request"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <DataTable 
            columns={columns} 
            data={data} 
            keyField="id" 
            emptyMessage="No travel requests found."
          />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Travel Request">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="destination" label="Destination" placeholder="e.g. New York, NY" required />
          <Input name="travelPurpose" label="Business Purpose" required />
          <div className="grid grid-cols-2 gap-4">
            <Input name="startDate" label="Start Date" type="date" required />
            <Input name="endDate" label="End Date" type="date" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Travel Mode</label>
              <select name="travelMode" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500">
                <option value="FLIGHT">Flight</option>
                <option value="TRAIN">Train</option>
                <option value="BUS">Bus</option>
                <option value="CAB">Cab / Taxi</option>
                <option value="PERSONAL_VEHICLE">Personal Vehicle</option>
              </select>
            </div>
            <Input name="advanceRequested" label="Advance Required ($)" type="number" step="0.01" />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={approvalModalOpen} onClose={() => setApprovalModalOpen(false)} title="Review Travel Request">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Please review this travel request. Approved requests will proceed to expense settlement after travel is completed.</p>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button variant="outline" onClick={() => setApprovalModalOpen(false)}>Cancel</Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 border-red-600 text-white"
              onClick={() => selectedRequestId && approveMutation.mutate({ id: selectedRequestId, status: 'REJECTED' })}
              disabled={approveMutation.isPending}
            >
              Reject
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 border-green-600 text-white"
              onClick={() => selectedRequestId && approveMutation.mutate({ id: selectedRequestId, status: 'APPROVED' })}
              disabled={approveMutation.isPending}
            >
              Approve
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
