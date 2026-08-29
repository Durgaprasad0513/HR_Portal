import React, { useState } from 'react';
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
import { Plus, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import clsx from 'clsx';

export default function TravelListPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Wizard state
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    purpose: '',
    destination: '',
    startDate: '',
    endDate: '',
    advanceAmount: '',
  });

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
      setStep(1);
      setFormData({ purpose: '', destination: '', startDate: '', endDate: '', advanceAmount: '' });
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
    { header: 'Purpose', accessor: ((row: any) => row.travelPurpose || row.purpose) as any },
    { header: 'Destination', accessor: ((row: any) => row.destination) as any },
    { header: 'Start Date', accessor: (row: any) => new Date(row.startDate).toLocaleDateString() },
    { header: 'End Date', accessor: (row: any) => new Date(row.endDate).toLocaleDateString() },
    { header: 'Amount', accessor: ((row: any) => row.advanceRequested || row.advanceAmount) as any },
    { header: 'Status', accessor: (row: any) => getStatusBadge(row.status) },
  ];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const STEPS = [
    { number: 1, title: 'Details' },
    { number: 2, title: 'Expenses' },
    { number: 3, title: 'Confirm' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold dark:text-white">Travel Requests</h1>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Travel Expense Wizard">
        <div className="mb-8">
          <nav aria-label="Progress">
            <ol role="list" className="flex items-center">
              {STEPS.map((s, idx) => (
                <li key={s.title} className={clsx("relative", idx !== STEPS.length - 1 ? "pr-8 sm:pr-20" : "")}>
                  <div className="flex items-center">
                    <div
                      className={clsx(
                        "h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold",
                        step > s.number ? "bg-indigo-600 text-white dark:bg-indigo-500" :
                        step === s.number ? "bg-indigo-600 text-white dark:bg-indigo-500 border-2 border-indigo-600 ring-2 ring-indigo-200 dark:ring-indigo-900" :
                        "bg-slate-100 text-slate-500 border-2 border-slate-300 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-400"
                      )}
                    >
                      {step > s.number ? <Check className="w-4 h-4" /> : s.number}
                    </div>
                    {idx !== STEPS.length - 1 && (
                      <div className={clsx(
                        "hidden sm:block absolute top-4 left-8 -mt-px h-0.5 w-full",
                        step > s.number ? "bg-indigo-600 dark:bg-indigo-500" : "bg-slate-200 dark:bg-slate-700"
                      )} />
                    )}
                  </div>
                  <span className="absolute -bottom-6 left-0 text-xs font-medium text-slate-500 dark:text-slate-400">
                    {s.title}
                  </span>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <Input 
                name="purpose" 
                label="Purpose of Travel" 
                value={formData.purpose} 
                onChange={(e) => updateField('purpose', e.target.value)} 
                required 
              />
              <Input 
                name="destination" 
                label="Destination" 
                value={formData.destination} 
                onChange={(e) => updateField('destination', e.target.value)} 
                required 
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  type="date" 
                  name="startDate" 
                  label="Start Date" 
                  value={formData.startDate} 
                  onChange={(e) => updateField('startDate', e.target.value)} 
                  required 
                />
                <Input 
                  type="date" 
                  name="endDate" 
                  label="End Date" 
                  value={formData.endDate} 
                  onChange={(e) => updateField('endDate', e.target.value)} 
                  required 
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">Advance Details</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Request an advance if needed before your trip.</p>
                <Input 
                  type="number" 
                  name="advanceAmount" 
                  label="Advance Amount Requested" 
                  value={formData.advanceAmount} 
                  onChange={(e) => updateField('advanceAmount', e.target.value)} 
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
                <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">Confirmation</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Purpose:</span>
                  <span className="font-medium dark:text-slate-200">{formData.purpose || '-'}</span>
                  
                  <span className="text-slate-500 dark:text-slate-400">Destination:</span>
                  <span className="font-medium dark:text-slate-200">{formData.destination || '-'}</span>
                  
                  <span className="text-slate-500 dark:text-slate-400">Dates:</span>
                  <span className="font-medium dark:text-slate-200">{formData.startDate} to {formData.endDate}</span>
                  
                  <span className="text-slate-500 dark:text-slate-400">Advance:</span>
                  <span className="font-medium dark:text-slate-200">${formData.advanceAmount || '0'}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button 
              type="button" 
              variant="outline" 
              onClick={step === 1 ? () => setIsModalOpen(false) : handleBack}
            >
              {step === 1 ? 'Cancel' : <><ChevronLeft className="w-4 h-4 mr-1" /> Back</>}
            </Button>
            
            {step < 3 ? (
              <Button type="button" onClick={handleNext}>
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Submitting...' : 'Submit Request'}
              </Button>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
}
