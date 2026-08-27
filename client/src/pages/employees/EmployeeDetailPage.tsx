import React from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { employeesApi } from '@/api/employees';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ArrowLeft, Mail, Phone, Building2, Briefcase, Calendar } from 'lucide-react';

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: empData, isLoading } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => employeesApi.getById(id!),
  });

  if (isLoading) return <LoadingSpinner />;
  const emp = empData?.data;
  if (!emp) return <div>Employee not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/employees')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Employee Details
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-t-4 border-t-indigo-600">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-700 mb-4">
              {emp.firstName[0]}{emp.lastName[0]}
            </div>
            <h2 className="text-xl font-bold">{emp.firstName} {emp.lastName}</h2>
            <p className="text-sm text-slate-500 mb-4">{emp.designation}</p>
            <Badge 
              variant={emp.status === 'ACTIVE' ? 'success' : emp.status === 'TERMINATED' ? 'danger' : 'warning'}
              className="mb-6"
            >
              {emp.status}
            </Badge>

            <div className="w-full space-y-3 text-left">
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-slate-400" />
                <span className="truncate">{emp.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-slate-400" />
                <span>{emp.phone || '-'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500 flex items-center">
                  <Briefcase className="h-4 w-4 mr-1" /> Employee Code
                </p>
                <p className="font-medium">{emp.employeeCode}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500 flex items-center">
                  <Building2 className="h-4 w-4 mr-1" /> Department
                </p>
                <p className="font-medium">{emp.department?.name || '-'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" /> Join Date
                </p>
                <p className="font-medium">{new Date(emp.joiningDate).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
