import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { employeesApi } from '@/api/employees';
import { departmentsApi } from '@/api/departments';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Plus, Search, MoreHorizontal, UsersRound, Download } from 'lucide-react';
import { Employee } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';

export default function EmployeeListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { canExport } = usePermissions();
  const [search, setSearch] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('');
  
  const { data: deptData } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentsApi.getAll,
  });

  const { data: empData, isLoading } = useQuery({
    queryKey: ['employees', { search, departmentId, location, status }],
    queryFn: () => employeesApi.getAll({ search, departmentId, location, status }),
  });

  const getEmpTypeBadge = (type: string) => {
    if (type === 'PERMANENT') return <Badge variant="success">Full-time</Badge>;
    if (type === 'CONTRACT') return <Badge variant="warning">Part-time</Badge>;
    if (type === 'INTERN') return <Badge variant="default">Intern</Badge>;
    return <Badge variant="default">{type}</Badge>;
  };

  const columns = [
    { 
      header: 'Name', 
      accessor: (row: Employee) => (
        <div className="font-semibold text-navy-900 dark:text-white">
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
      accessor: (row: Employee) => getEmpTypeBadge(row.employmentType || '')
    },
    { header: 'Office', accessor: (row: Employee) => row.location || '-' },
    { 
      header: 'Status', 
      accessor: (row: Employee) => (
        <Badge variant={row.status === 'ACTIVE' ? 'success' : 'default'}>
          {row.status || 'ACTIVE'}
        </Badge>
      )
    },
  ];


  const handleExport = () => {
    if (!empData?.data?.length) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Employee ID,First Name,Last Name,Email,Phone,Department,Job Title,Employment Type,Status\n"
      + empData.data.map((e: any) => 
          `${e.employeeCode},${e.firstName},${e.lastName},${e.email},${e.phone || ''},${e.department?.name || ''},${e.designation || ''},${e.employmentType || ''},${e.status}`
        ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Employee_Register.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Management"
        description="Find, review, and manage employee records."
        actions={canExport('employees') && <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" /> Export Register
          </Button>}
      />

      {/* Station Cards */}
      {deptData?.data && deptData.data.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {deptData.data.map((dept: any) => (
            <div 
              key={dept.id} 
              role="button"
              tabIndex={0}
              aria-pressed={departmentId === dept.id}
              aria-label={`Filter employees by ${dept.name}`}
              className={`p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                departmentId === dept.id ? 'bg-accent-50 dark:bg-accent-900/20 border-accent-200 dark:border-accent-800' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
              }`}
              onClick={() => setDepartmentId(dept.id === departmentId ? '' : dept.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setDepartmentId(dept.id === departmentId ? '' : dept.id);
                }
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className={`font-semibold line-clamp-1 ${departmentId === dept.id ? 'text-accent-700 dark:text-accent-400' : 'text-navy-900 dark:text-white'}`} title={dept.name}>{dept.name}</h3>
                <UsersRound className={`h-5 w-5 ${departmentId === dept.id ? 'text-accent-500' : 'text-gray-400'}`} />
              </div>
              <p className={`text-2xl font-bold ${departmentId === dept.id ? 'text-accent-700 dark:text-accent-400' : 'text-gray-700 dark:text-gray-300'}`}>{dept._count?.employees || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Employees</p>
            </div>
          ))}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input 
              aria-label="Search employees"
              placeholder="Search..." 
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <select 
            aria-label="Filter employees by office"
            className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">All Offices</option>
            <option value="Hyd Office">Hyd Office</option>
            <option value="Peddapuram Plant">Peddapuram Plant</option>
          </select>
          
          <select 
            aria-label="Filter employees by status"
            className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="TERMINATED">Terminated</option>
          </select>

          <button
            type="button"
            onClick={() => {
              setSearch('');
              setDepartmentId('');
              setLocation('');
              setStatus('');
            }}
            disabled={!search && !departmentId && !location && !status}
            className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-navy-900 dark:text-white underline underline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline"
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
          description={search || departmentId || location || status ? "Try adjusting your search or filters to find what you're looking for." : "No employees are currently in the system."}
          actionLabel={search || departmentId || location || status ? "Clear Filters" : ((user?.role === 'ADMIN' || user?.role === 'HR') ? "Add Employee" : undefined)}
          onAction={() => {
            if (search || departmentId || location || status) {
              setSearch('');
              setDepartmentId('');
              setLocation('');
              setStatus('');
            } else if (user?.role === 'ADMIN' || user?.role === 'HR') {
              navigate('/employees/new');
            }
          }}
        />
      ) : (
        <DataTable 
          caption="Employees"
          columns={columns} 
          data={empData?.data || []} 
          keyField="id" 
          pageSize={10}
          onRowClick={(row) => navigate(`/employees/${row.id}`)}
        />
      )}
    </div>
  );
}
