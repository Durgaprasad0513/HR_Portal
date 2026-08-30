import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { employeesApi } from '@/api/employees';
import { departmentsApi } from '@/api/departments';
import { useAuth } from '@/contexts/AuthContext';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Plus, Search, MoreHorizontal, UsersRound } from 'lucide-react';
import { Employee } from '@/types';

export default function EmployeeListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  
  const { data: deptData } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentsApi.getAll,
  });

  const { data: empData, isLoading } = useQuery({
    queryKey: ['employees', { search, departmentId }],
    queryFn: () => employeesApi.getAll({ search, departmentId }),
  });

  const getEmpTypeBadge = (type: string = 'Full time') => {
    if (type === 'Full time') return <Badge variant="success">Full time</Badge>;
    if (type === 'Part time') return <Badge variant="warning">Part time</Badge>;
    return <Badge variant="default">Contractor</Badge>;
  };

  const columns = [
    { 
      header: 'Name', 
      accessor: (row: Employee) => (
        <div className="font-semibold text-navy-900">
          {row.firstName} {row.lastName}
        </div>
      )
    },
    { header: 'Employee ID', accessor: 'employeeCode' as keyof Employee },
    { header: 'Job Title', accessor: 'designation' as keyof Employee },
    { 
      header: 'Department', 
      accessor: (row: Employee) => row.department?.name || '-'
    },
    { 
      header: 'Employment Type', 
      accessor: () => getEmpTypeBadge('Full time') // Mocked as full time for now
    },
    { header: 'Office', accessor: () => 'Main Office' },
    {
      header: 'Action',
      accessor: (row: Employee) => (
        <button 
          onClick={(e) => { e.stopPropagation(); navigate(`/employees/${row.id}`); }} 
          className="text-gray-400 hover:text-navy-900 transition-colors"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">Employee Management</h1>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              placeholder="Search..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500">
            <option>All Offices</option>
          </select>
          
          <select 
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
          >
            <option value="">All Departments</option>
            {deptData?.data?.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => {
              setSearch('');
              setDepartmentId('');
            }}
            disabled={!search && !departmentId}
            className="text-sm text-gray-500 hover:text-navy-900 underline underline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline"
          >
            Clear filters
          </button>
        </div>

        <div className="shrink-0">
          {(user?.role === 'ADMIN' || user?.role === 'HR') && (
            <Button onClick={() => navigate('/employees/new')} className="gap-2">
              <Plus className="w-4 h-4" /> Add new
            </Button>
          )}
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="py-12"><LoadingSpinner /></div>
      ) : empData?.data?.length === 0 ? (
        <EmptyState 
          icon={UsersRound}
          title="No employees found"
          description={search || departmentId ? "Try adjusting your search or filters to find what you're looking for." : "No employees are currently in the system."}
          actionLabel={search || departmentId ? "Clear Filters" : ((user?.role === 'ADMIN' || user?.role === 'HR') ? "Add Employee" : undefined)}
          onAction={() => {
            if (search || departmentId) {
              setSearch('');
              setDepartmentId('');
            } else if (user?.role === 'ADMIN' || user?.role === 'HR') {
              navigate('/employees/new');
            }
          }}
        />
      ) : (
        <DataTable 
          columns={columns} 
          data={empData?.data || []} 
          keyField="id" 
          selectable
          pageSize={10}
          onRowClick={(row) => navigate(`/employees/${row.id}`)}
        />
      )}
    </div>
  );
}
