import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Search, Plus, FileText, MoreHorizontal, Download, Link as LinkIcon } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';

export default function PolicyListPage() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAdminOrHR = user?.role === 'ADMIN' || user?.role === 'HR';

  const columns = [
    { 
      header: 'Documents', 
      accessor: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center">
             <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <span className="font-semibold text-navy-900">{row.name}</span>
        </div>
      )
    },
    { header: 'Created Date', accessor: 'date', className: 'text-gray-600' },
    { 
      header: 'Created By', 
      accessor: (row: any) => (
         <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 font-bold text-[10px]">
              {row.author.substring(0,2).toUpperCase()}
            </div>
            <span className="text-gray-600">{row.author}</span>
         </div>
      ) 
    },
    { header: 'Files count', accessor: 'count', className: 'text-gray-600' },
    { header: 'Description', accessor: 'description', className: 'text-gray-500 truncate max-w-xs' },
    { 
      header: 'Action', 
      accessor: () => (
        <div className="flex items-center gap-2">
          <button className="p-1 text-gray-400 hover:text-accent-500 transition-colors" title="Download"><Download className="w-4 h-4" /></button>
          <button className="p-1 text-gray-400 hover:text-accent-500 transition-colors" title="Copy Link"><LinkIcon className="w-4 h-4" /></button>
          <button className="p-1 text-gray-400 hover:text-navy-900 transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
        </div>
      ) 
    },
  ];

  const mockDocuments = [
    { id: '1', name: 'Employee Handbook 2024', date: 'Dec 01, 2023', author: 'HR Dept', count: '1 file', description: 'Updated company policies and guidelines' },
    { id: '2', name: 'Q4 Financial Report', date: 'Nov 15, 2023', author: 'Finance', count: '3 files', description: 'Quarterly financial statements' },
    { id: '3', name: 'Brand Guidelines', date: 'Oct 20, 2023', author: 'Marketing', count: '1 file', description: 'Official brand assets and usage rules' },
    { id: '4', name: 'Health Insurance Info', date: 'Sep 05, 2023', author: 'HR Dept', count: '2 files', description: 'Benefit details for next year' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">Documents</h1>
        
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
            placeholder="Search documents, files..." 
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all"
          />
        </div>
        <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500">
          <option>All Types</option>
          <option>PDF</option>
          <option>Word</option>
        </select>
      </div>

      <div className="animate-in fade-in">
        <DataTable columns={columns} data={mockDocuments} keyField="id" selectable />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Document">
        <form className="space-y-4">
          <Input name="name" label="Document Name" required />
          <Input name="description" label="Description" required />
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Upload</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
