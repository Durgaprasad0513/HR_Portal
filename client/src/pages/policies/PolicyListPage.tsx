import React from 'react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { policiesApi } from '@/api/policies';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Check } from 'lucide-react';

export default function PolicyListPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAdminOrHR = user?.role === 'ADMIN' || user?.role === 'HR';

  const { data: policiesData, isLoading } = useQuery({
    queryKey: ['policies'],
    queryFn: policiesApi.getAll,
  });

  const { data: myAcknowledgements } = useQuery({
    queryKey: ['myAcknowledgements'],
    queryFn: policiesApi.getMyAcknowledgements,
    enabled: !isAdminOrHR,
  });

  const createMutation = useMutation({
    mutationFn: policiesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      toast.success('Policy uploaded successfully');
      setIsModalOpen(false);
    },
    onError: () => toast.error('Failed to upload policy')
  });

  const acknowledgeMutation = useMutation({
    mutationFn: policiesApi.acknowledge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAcknowledgements'] });
      toast.success('Policy acknowledged');
    },
    onError: () => toast.error('Failed to acknowledge policy')
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createMutation.mutate(Object.fromEntries(formData.entries()));
  };

  const isAcknowledged = (policyId: string) => {
    return myAcknowledgements?.data?.some((ack: any) => ack.policyId === policyId);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Company Policies</h1>
        {isAdminOrHR && (
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Upload Policy
          </Button>
        )}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {policiesData?.data?.map((policy: any) => (
            <Card key={policy.id}>
              <CardHeader>
                <CardTitle className="text-lg">{policy.name}</CardTitle>
                <Badge variant="info">{policy.category}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">Version: {policy.version}</p>
                {!isAdminOrHR && (
                  <Button
                    variant={isAcknowledged(policy.id) ? "outline" : "default"}
                    disabled={isAcknowledged(policy.id) || acknowledgeMutation.isPending}
                    onClick={() => acknowledgeMutation.mutate(policy.id)}
                    className="w-full"
                  >
                    {isAcknowledged(policy.id) ? (
                      <><Check className="w-4 h-4 mr-2" /> Acknowledged</>
                    ) : (
                      'Acknowledge'
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Policy">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" label="Policy Name" required />
          <Input name="category" label="Category" required />
          <Input name="version" label="Version" required />
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending}>Upload</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
