import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leavesApi } from '@/api/leaves';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function LeaveApplicationPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    leaveType: 'CASUAL',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const { data: balancesData, isLoading } = useQuery({
    queryKey: ['leaves', 'balances'],
    queryFn: leavesApi.getBalances,
  });

  const applyMutation = useMutation({
    mutationFn: leavesApi.apply,
    onSuccess: () => {
      toast.success('Leave application submitted');
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      navigate('/leaves/history');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to apply leave'),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyMutation.mutate(formData);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Apply for Leave</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Leave Application</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col space-y-1 w-full">
                  <label className="text-sm font-medium text-slate-700">Leave Type</label>
                  <select 
                    name="leaveType" 
                    value={formData.leaveType} 
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="CASUAL">Casual Leave</option>
                    <option value="SICK">Sick Leave</option>
                    <option value="EARNED">Earned Leave</option>
                    <option value="UNPAID">Unpaid Leave</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Start Date" type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
                  <Input label="End Date" type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
                </div>
                
                <div className="flex flex-col space-y-1 w-full">
                  <label className="text-sm font-medium text-slate-700">Reason</label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="flex min-h-[100px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button type="submit" isLoading={applyMutation.isPending}>Submit Application</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Leave Balances</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <div className="space-y-4">
                  {balancesData?.data?.map((balance: any) => (
                    <div key={balance.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{balance.leaveType}</p>
                        <p className="text-xs text-slate-500">Total: {balance.totalDays} · Used: {balance.usedDays}</p>
                      </div>
                      <div className="text-xl font-bold text-indigo-600">
                        {balance.remainingDays}
                      </div>
                    </div>
                  ))}
                  {(!balancesData?.data || balancesData.data.length === 0) && (
                    <p className="text-sm text-slate-500">No balance information available.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
