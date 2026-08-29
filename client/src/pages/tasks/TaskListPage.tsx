import React, { useState } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Search, Plus, MoreHorizontal, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'To-Do' | 'Onboarding' | 'Offboarding';

export default function TaskListPage() {
  const [activeTab, setActiveTab] = useState<Tab>('To-Do');

  const todoColumns = [
    { header: 'Task Name', accessor: (row: any) => <span className="font-semibold text-navy-900">{row.name}</span> },
    { header: 'Status', accessor: (row: any) => {
        if (row.status === 'Completed') return <Badge variant="success">Completed</Badge>;
        if (row.status === 'In progress') return <Badge variant="info">In progress</Badge>;
        if (row.status === 'Pending') return <Badge variant="warning">Pending</Badge>;
        return <Badge variant="default">Incomplete</Badge>;
    }},
    { header: 'Due Date', accessor: (row: any) => (
       <span className={row.overdue ? "text-red-600 font-semibold" : "text-gray-600"}>{row.date}</span>
    )},
    { header: 'Department', accessor: 'dept', className: 'text-gray-600' },
    { header: 'Category', accessor: 'category', className: 'text-gray-600' },
    { header: 'Action', accessor: () => (
      <div className="flex gap-2">
        <button className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
        <button className="text-gray-400 hover:text-navy-900"><MoreHorizontal className="w-4 h-4" /></button>
      </div>
    )},
  ];

  const todoData = [
    { id: 1, name: 'Review Q4 Performance Goals', status: 'In progress', date: 'Dec 15, 2023', overdue: false, dept: 'All', category: 'Review' },
    { id: 2, name: 'Update Employee Handbook', status: 'Pending', date: 'Dec 10, 2023', overdue: true, dept: 'HR', category: 'Policy' },
    { id: 3, name: 'Approve pending timesheets', status: 'Completed', date: 'Dec 05, 2023', overdue: false, dept: 'Finance', category: 'Payroll' },
    { id: 4, name: 'Schedule interviews for Designer', status: 'Incomplete', date: 'Dec 20, 2023', overdue: false, dept: 'Design', category: 'Recruitment' },
  ];

  const onboardingColumns = [
    { header: 'Name', accessor: (row: any) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 font-bold text-xs">
          {row.name.substring(0,2).toUpperCase()}
        </div>
        <span className="font-semibold text-navy-900">{row.name}</span>
      </div>
    )},
    { header: 'ID', accessor: 'empId', className: 'text-gray-500' },
    { header: 'Status', accessor: 'status', className: 'font-medium text-navy-900' },
    { header: 'Progress', accessor: (row: any) => (
       <div className="w-full bg-gray-200 rounded-full h-2 min-w-[100px]">
          <div className={cn("h-2 rounded-full", row.progress === 100 ? "bg-emerald-500" : "bg-accent-500")} style={{ width: \`\${row.progress}%\` }}></div>
       </div>
    )},
    { header: 'Department', accessor: 'dept', className: 'text-gray-600' },
    { header: 'Type', accessor: () => <Badge variant="success">Full-time</Badge> },
    { header: 'Action', accessor: () => <button className="text-gray-400 hover:text-navy-900"><MoreHorizontal className="w-4 h-4" /></button> },
  ];

  const onboardingData = [
    { id: 1, name: 'Darrell Steward', empId: '#EMP-102', status: 'Orientation Scheduled', progress: 80, dept: 'Marketing' },
    { id: 2, name: 'Wade Warren', empId: '#EMP-103', status: 'Reference Check', progress: 40, dept: 'Engineering' },
    { id: 3, name: 'Jane Cooper', empId: '#EMP-104', status: 'First Day Onsite', progress: 100, dept: 'Design' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">Task Lists</h1>
        
        <div className="flex bg-gray-100 p-1 rounded-full w-full sm:w-auto">
          {(['To-Do', 'Onboarding', 'Offboarding'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-full transition-colors flex-1 sm:flex-none text-center",
                activeTab === tab 
                  ? "bg-white text-navy-900 shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              placeholder="Search tasks..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all"
            />
          </div>
          
          <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500">
            <option>All Departments</option>
          </select>
          
          <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500">
            <option>All Status</option>
          </select>

          <button className="text-sm text-gray-500 hover:text-navy-900 underline underline-offset-2">
            Clear filters
          </button>
        </div>

        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Add new
        </Button>
      </div>

      <div className="animate-in fade-in">
        {activeTab === 'To-Do' && (
          <DataTable columns={todoColumns} data={todoData} keyField="id" selectable />
        )}
        
        {activeTab === 'Onboarding' && (
          <DataTable columns={onboardingColumns} data={onboardingData} keyField="id" selectable />
        )}

        {activeTab === 'Offboarding' && (
          <div className="p-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
             <p className="text-lg font-medium text-navy-900 mb-2">No Offboarding Tasks</p>
             <p>There are currently no active offboarding processes.</p>
          </div>
        )}
      </div>
    </div>
  );
}
