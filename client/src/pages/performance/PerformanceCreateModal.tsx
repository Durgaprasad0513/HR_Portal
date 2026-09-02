import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { performanceApi } from '@/api/performance';
import { employeesApi } from '@/api/employees';
import toast from 'react-hot-toast';

interface PerformanceCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PerformanceCreateModal({ isOpen, onClose }: PerformanceCreateModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    employeeId: '',
    reviewPeriod: 'QUARTERLY',
    kraDescription: '',
    kpiWeightage: 100,
    goalDescription: '',
    targetValue: ''
  });

  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeesApi.getAll().then((res: any) => res.data)
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => performanceApi.create(data),
    onSuccess: () => {
      toast.success('Performance review initiated!');
      queryClient.invalidateQueries({ queryKey: ['performance'] });
      onClose();
    },
    onError: (error: any) => toast.error(error.message || 'Failed to create')
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeId) {
      toast.error('Please select an employee');
      return;
    }
    createMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-navy-900 dark:text-white">
            Initiate Performance Review
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl leading-none">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Employee</label>
            <select required name="employeeId" value={formData.employeeId} onChange={handleChange} className="flex h-10 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500">
              <option value="">Select Employee</option>
              {employees?.map((emp: any) => (
                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Review Period</label>
            <select name="reviewPeriod" value={formData.reviewPeriod} onChange={handleChange} className="flex h-10 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500">
              <option value="QUARTERLY">Quarterly</option>
              <option value="HALF_YEARLY">Half Yearly</option>
              <option value="ANNUAL">Annual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">KRA Description</label>
            <textarea name="kraDescription" value={formData.kraDescription} onChange={handleChange} className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 dark:bg-gray-900" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Goal Description</label>
            <textarea name="goalDescription" value={formData.goalDescription} onChange={handleChange} className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 dark:bg-gray-900" rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input name="targetValue" label="Target Value" value={formData.targetValue} onChange={handleChange} />
            <Input type="number" name="kpiWeightage" label="KPI Weightage (%)" value={formData.kpiWeightage} onChange={handleChange} />
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" isLoading={createMutation.isPending}>Initiate Review</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
