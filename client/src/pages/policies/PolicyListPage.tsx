import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Search, Plus, FileText, Download } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useQuery } from '@tanstack/react-query';
import { policiesApi } from '@/api/policies';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function PolicyListPage() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAdminOrHR = user?.role === 'ADMIN' || user?.role === 'HR';

  const { data, isLoading } = useQuery({
    queryKey: ['policies'],
    queryFn: () => policiesApi.getAll().then(res => res.data),
  });

  const columns = [
    { 
      header: 'Policy Name', 
      accessor: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center">
             <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <span className="font-semibold text-navy-900">{row.policyName}</span>
        </div>
      )
    },
    { header: 'Category', accessor: 'policyCategory', className: 'text-gray-600' },
    { header: 'Version', accessor: 'versionNumber', className: 'text-gray-600' },
    { 
      header: 'Created Date', 
      accessor: (row: any) => new Date(row.createdAt).toLocaleDateString(),
      className: 'text-gray-600' 
    },
    { 
      header: 'Action', 
      accessor: () => (
        <div className="flex items-center gap-2">
          <button className="p-1 text-gray-400 hover:text-accent-500 transition-colors" title="Download">
             <Download className="w-4 h-4" />
          </button>
        </div>
      ) 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">Policies & Documents</h1>
        
        {isAdminOrHR && (
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Upload Document
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3 animate-in fade-in">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input 
            placeholder="Search policies..." 
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all"
          />
        </div>
      </div>

      <div className="animate-in fade-in">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <DataTable 
            columns={columns} 
            data={data || []} 
            keyField="id" 
            emptyMessage="No policies or documents found."
          />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Policy">
        <form className="space-y-4">
          <Input name="policyName" label="Policy Name" required />
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Category</label>
            <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500">
              <option value="GENERAL">General</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="FINANCE">Finance</option>
            </select>
          </div>
          <Input type="file" name="file" label="Attachment" required />
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Upload</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
