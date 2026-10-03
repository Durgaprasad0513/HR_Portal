import { formatDate, formatDateTime } from '@/utils/dateFormat';
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestsApi } from '@/api/requests';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Send, MessageSquare } from 'lucide-react';
import apiClient from '@/api/client';
import { PageHeader } from '@/components/ui/PageHeader';

const REQUEST_TYPES = [
  { value: 'HR_QUERY', label: 'HR Query' },
  { value: 'LEAVE_QUERY', label: 'Leave-related query' },
  { value: 'SALARY_QUERY', label: 'Salary query' },
  { value: 'DOCUMENT_REQUEST', label: 'Document request' },
  { value: 'EXPERIENCE_LETTER', label: 'Experience letter request' },
  { value: 'PAYSLIP', label: 'Payslip request' },
  { value: 'JOINING_DOCUMENTS', label: 'Joining document request' },
  { value: 'GENERAL', label: 'General HR request' },
  { value: 'OTHER', label: 'Other request' }
];

export default function RequestListPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReqId, setSelectedReqId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [responseNotes, setResponseNotes] = useState('');

  const isAdminOrHR = user?.role === 'ADMIN' || user?.role === 'HR';

  const { data: requestsData, isLoading } = useQuery({
    queryKey: ['requests'],
    queryFn: isAdminOrHR ? requestsApi.getAll : requestsApi.getMyRequests,
  });

  const { data: admins } = useQuery({
    queryKey: ['hr-users'],
    queryFn: async () => {
      const { data } = await apiClient.get('/requests/staff');
      return data;
    },
    enabled: isAdminOrHR
  });

  const createMutation = useMutation({
    mutationFn: requestsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast.success('Request submitted successfully');
      setIsModalOpen(false);
    },
    onError: () => toast.error('Failed to submit request')
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, payload }: any) => requestsApi.updateStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast.success('Ticket updated');
      setResponseNotes('');
    },
    onError: () => toast.error('Failed to update ticket')
  });

  const assignMutation = useMutation({
    mutationFn: ({ id, assignedToId }: any) => requestsApi.assign(id, { assignedToId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast.success('Ticket assigned');
    },
    onError: () => toast.error('Failed to assign ticket')
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-amber-100 text-amber-800 border border-amber-200">Submitted</span>;
      case 'ASSIGNED': return <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-blue-100 text-blue-800 border border-blue-200">Assigned</span>;
      case 'IN_PROGRESS': return <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-purple-100 text-purple-800 border border-purple-200">In Progress</span>;
      case 'RESOLVED': return <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-green-100 text-green-800 border border-green-200">Resolved</span>;
      case 'TICKET_CLOSED': return <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-gray-100 text-gray-800 border border-gray-200">Closed</span>;
      default: return <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getReqTypeLabel = (val: string) => {
    return REQUEST_TYPES.find(t => t.value === val)?.label || val;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createMutation.mutate(Object.fromEntries(formData.entries()));
  };

  const tickets = requestsData?.data || [];
  const filteredTickets = statusFilter === 'ALL' ? tickets : tickets.filter((t: any) => t.status === statusFilter);
  const selectedReq = tickets.find((t: any) => t.id === selectedReqId);

  const handleSendResponse = () => {
    if (!selectedReq) return;
    updateStatusMutation.mutate({
      id: selectedReq.id,
      payload: { responseNotes, status: selectedReq.status }
    });
  };

  return (
    <div className="p-6 h-[calc(100vh-80px)] flex flex-col space-y-4">
      <PageHeader
        title="HR Helpdesk"
        description="Submit, track, and resolve workplace requests."
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> New Request
          </Button>
        }
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-6 pb-6">
          
          {/* Left Pane - Ticket List */}
          <div className="md:col-span-4 lg:col-span-4 flex flex-col bg-white dark:bg-gray-900 rounded-[1.5rem] border border-slate-border dark:border-slate-800 shadow-sm overflow-hidden h-full">
            <div className="p-4 border-b border-slate-border dark:border-slate-800 bg-slate-50 dark:bg-gray-800">
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="ALL">All Ticket Statuses</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="TICKET_CLOSED">Closed</option>
              </Select>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredTickets.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500">No tickets found.</div>
              ) : (
                filteredTickets.map((req: any) => {
                  const isActive = req.id === selectedReqId;
                  return (
                    <div
                      key={req.id}
                      onClick={() => setSelectedReqId(req.id)}
                      className={`p-4 border-b border-slate-100 dark:border-slate-800/50 cursor-pointer transition-colors border-l-4 ${
                        isActive 
                          ? 'border-l-primary-500 bg-primary-50/30 dark:bg-primary-900/10' 
                          : 'border-l-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-primary-600 dark:text-primary-400">REQ-{req.id.slice(-10).toUpperCase()}</span>
                        {getStatusBadge(req.status)}
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{req.description}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{getReqTypeLabel(req.requestType)}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 truncate pr-2">
                          {req.employee?.firstName} {req.employee?.lastName} {req.employee?.department?.name ? `(${req.employee.department.name})` : ''}
                        </span>
                        <span className="text-[11px] text-gray-400 dark:text-gray-500 shrink-0">{formatDate(req.createdAt) || 'Invalid Date'}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Pane - Ticket Detail */}
          <div className="md:col-span-8 lg:col-span-8 flex flex-col bg-white dark:bg-gray-900 rounded-[1.5rem] border border-slate-border dark:border-slate-800 shadow-sm overflow-hidden h-full">
            {selectedReq ? (
              <>
                <div className="p-6 border-b border-slate-border dark:border-slate-800 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 shadow-sm z-10 bg-white dark:bg-gray-900">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{selectedReq.description}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Raised by <span className="font-medium text-gray-700 dark:text-gray-300">{selectedReq.employee?.firstName} {selectedReq.employee?.lastName}</span>
                      <span className="mx-2">•</span>
                      Assigned to: <span className="font-medium text-gray-700 dark:text-gray-300">{selectedReq.assignedTo?.employee?.firstName ? `${selectedReq.assignedTo.employee.firstName} ${selectedReq.assignedTo.employee.lastName}` : 'Unassigned'}</span>
                    </p>
                  </div>
                  
                  {isAdminOrHR && (
                    <div className="flex flex-col sm:items-end gap-2 shrink-0">
                      <Select 
                        className="w-[180px] min-h-[38px] text-sm"
                        value={selectedReq.status}
                        onChange={(e: any) => updateStatusMutation.mutate({ id: selectedReq.id, payload: { status: e.target.value } })}
                        disabled={updateStatusMutation.isPending}
                      >
                        <option value="SUBMITTED">Status: Submitted</option>
                        <option value="ASSIGNED">Status: Assigned</option>
                        <option value="IN_PROGRESS">Status: In Progress</option>
                        <option value="RESOLVED">Status: Resolved</option>
                        <option value="TICKET_CLOSED">Status: Closed</option>
                      </Select>
                      
                      <Select 
                        className="w-[180px] min-h-[38px] text-sm"
                        value={selectedReq.assignedToId || ''}
                        onChange={(e: any) => assignMutation.mutate({ id: selectedReq.id, assignedToId: e.target.value })}
                        disabled={assignMutation.isPending}
                      >
                        <option value="">Unassigned</option>
                        {admins?.data?.map((u: any) => (
                          <option key={u.id} value={u.id}>{u.employee?.firstName} {u.employee?.lastName}</option>
                        ))}
                      </Select>
                    </div>
                  )}
                </div>

                <div className="flex-1 p-6 overflow-y-auto bg-[#f8fafc] dark:bg-gray-900/50 space-y-6">
                   <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 dark:border-slate-700 max-w-[85%]">
                      <div className="flex items-center gap-3 mb-3">
                         <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs shrink-0">
                           {selectedReq.employee?.firstName?.charAt(0)}{selectedReq.employee?.lastName?.charAt(0)}
                         </div>
                         <div>
                           <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{selectedReq.employee?.firstName} {selectedReq.employee?.lastName}</p>
                           <p className="text-[11px] text-gray-400">{formatDateTime(selectedReq.createdAt)}</p>
                         </div>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap ml-11">{selectedReq.description}</p>
                   </div>

                   {selectedReq.responseNotes && (
                     <div className="bg-primary-50 dark:bg-primary-900/20 p-5 rounded-2xl rounded-tr-sm shadow-sm border border-primary-100 dark:border-primary-800/50 max-w-[85%] ml-auto">
                        <div className="flex items-center justify-end gap-3 mb-3">
                           <div className="text-right">
                             <p className="text-sm font-semibold text-primary-800 dark:text-primary-300">HR Helpdesk</p>
                             <p className="text-[11px] text-primary-600/70 dark:text-primary-400/70">Response</p>
                           </div>
                           <div className="w-8 h-8 rounded-full bg-primary-200 dark:bg-primary-800 text-primary-800 dark:text-primary-200 flex items-center justify-center shrink-0">
                             <MessageSquare className="w-4 h-4" />
                           </div>
                        </div>
                        <p className="text-sm text-primary-900 dark:text-primary-100 whitespace-pre-wrap mr-11 text-right">{selectedReq.responseNotes}</p>
                     </div>
                   )}
                </div>

                {isAdminOrHR && (
                  <div className="p-4 border-t border-slate-border dark:border-slate-800 bg-white dark:bg-gray-900 z-10">
                    <div className="flex gap-2">
                      <Input 
                        value={responseNotes}
                        onChange={(e) => setResponseNotes(e.target.value)}
                        placeholder="Type response or status resolution update..." 
                        className="flex-1 bg-slate-50 dark:bg-gray-800 focus:bg-white transition-colors"
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSendResponse() }}
                      />
                      <Button onClick={handleSendResponse} disabled={!responseNotes.trim() || updateStatusMutation.isPending} className="bg-primary-600 hover:bg-primary-700 shrink-0 gap-2 px-6 rounded-lg">
                        <Send className="w-4 h-4" /> Send
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-[#f8fafc] dark:bg-gray-900/50">
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 shadow-sm border border-slate-border dark:border-slate-700">
                  <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Select a ticket to view details</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Chat history and resolutions will appear here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Request Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit HR Request">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select name="requestType" label="Request Type" required>
            <option value="">Select request type...</option>
            {REQUEST_TYPES.map(rt => <option key={rt.value} value={rt.value}>{rt.label}</option>)}
          </Select>
          <Input name="description" label="Description" required />
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending}>Submit</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}


