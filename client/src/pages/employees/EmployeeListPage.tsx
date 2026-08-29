import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { employeesApi } from '@/api/employees';
import { departmentsApi } from '@/api/departments';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Plus, Search, MoreHorizontal, Download, Phone, Mail } from 'lucide-react';
import { Employee } from '@/types';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';

type Tab = 'Team members' | 'Directory' | 'Org chart';

export default function EmployeeListPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('Team members');
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

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'danger' | 'warning' | 'default'> = {
      ACTIVE: 'success',
      TERMINATED: 'danger',
      ON_LEAVE: 'warning',
      INACTIVE: 'default',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const getEmpTypeBadge = (type: string = 'Full time') => {
    if (type === 'Full time') return <Badge variant="success">Full time</Badge>;
    if (type === 'Part time') return <Badge variant="warning">Part time</Badge>;
    return <Badge variant="default">Contractor</Badge>;
  };

  const columns = [
    { 
      header: 'Avatar', 
      accessor: (row: Employee) => (
        <div className="h-8 w-8 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 font-bold text-xs">
          {row.firstName[0]}{row.lastName[0]}
        </div>
      )
    },
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
        <button onClick={() => navigate(`/employees/${row.id}`)} className="text-gray-400 hover:text-navy-900 transition-colors">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">Employee Management</h1>
        
        <div className="flex bg-gray-100 p-1 rounded-full w-full sm:w-auto">
          {(['Team members', 'Directory', 'Org chart'] as Tab[]).map((tab) => (
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

          <button className="text-sm text-gray-500 hover:text-navy-900 underline underline-offset-2">
            Clear filters
          </button>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="outline" className="gap-2 text-gray-600">
            <Download className="w-4 h-4" /> Download
          </Button>
          <Button onClick={() => navigate('/employees/new')} className="gap-2">
            <Plus className="w-4 h-4" /> Add new
          </Button>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="py-12"><LoadingSpinner /></div>
      ) : activeTab === 'Team members' ? (
        <DataTable 
          columns={columns} 
          data={empData?.data || []} 
          keyField="id" 
          selectable
          pageSize={10}
        />
      ) : activeTab === 'Directory' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {empData?.data?.map((emp) => (
            <Card key={emp.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-20 w-20 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 font-bold text-2xl mb-4 border-4 border-white shadow-sm ring-2 ring-gray-50">
                  {emp.firstName[0]}{emp.lastName[0]}
                </div>
                <h3 className="font-bold text-navy-900 text-lg">{emp.firstName} {emp.lastName}</h3>
                <p className="text-sm text-gray-500 mb-4">{emp.designation}</p>
                
                <div className="w-full space-y-2 mb-6">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{emp.phone || '202-555-0123'}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full text-accent-600 border-accent-200 hover:bg-accent-50"
                  onClick={() => navigate(`/employees/${emp.id}`)}
                >
                  View profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center text-gray-500 flex flex-col items-center justify-center min-h-[400px]">
             <img src="https://ui-avatars.com/api/?name=Org+Chart&background=F1F5F9&color=94A3B8&size=100" alt="Org Chart placeholder" className="mb-4 rounded-full" />
             <p className="text-lg font-medium text-navy-900 mb-2">Org Chart View</p>
             <p>The organizational chart view is currently under development.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
