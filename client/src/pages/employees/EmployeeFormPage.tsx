import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeesApi } from '@/api/employees';
import { departmentsApi } from '@/api/departments';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

export default function EmployeeFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    employeeCode: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    departmentId: '',
    designation: '',
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
  });

  const { data: deptData } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentsApi.getAll,
  });

  const { data: empData, isLoading: isLoadingEmp } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => employeesApi.getById(id!),
    enabled: isEdit,
  });

  useEffect(() => {
    if (isEdit && empData?.data) {
      const e = empData.data;
      setFormData({
        employeeCode: e.employeeCode,
        firstName: e.firstName,
        lastName: e.lastName,
        email: e.email,
        phone: e.phone || '',
        departmentId: e.departmentId || '',
        designation: e.designation,
        joiningDate: new Date(e.joiningDate).toISOString().split('T')[0],
        status: e.status,
      });
    }
  }, [isEdit, empData]);

  const mutation = useMutation({
    mutationFn: (data: typeof formData) => isEdit ? employeesApi.update({ id: id!, ...data } as any) : employeesApi.create(data as any),
    onSuccess: () => {
      toast.success(`Employee ${isEdit ? 'updated' : 'created'} successfully`);
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      navigate('/employees');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save employee');
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isEdit && isLoadingEmp) return <div>Loading...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/employees')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {isEdit ? 'Edit Employee' : 'Add New Employee'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Employee Code" name="employeeCode" value={formData.employeeCode} onChange={handleChange} required />
              <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
              <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
              <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
              <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1 w-full">
                <label className="text-sm font-medium text-slate-700">Department</label>
                <select 
                  name="departmentId" 
                  value={formData.departmentId} 
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select Department</option>
                  {deptData?.data?.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              
              <Input label="Designation" name="designation" value={formData.designation} onChange={handleChange} required />
              <Input label="Joining Date" type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} required />
              
              <div className="flex flex-col space-y-1 w-full">
                <label className="text-sm font-medium text-slate-700">Status</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="TERMINATED">Terminated</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end pt-4 gap-2">
              <Button type="button" variant="outline" onClick={() => navigate('/employees')}>Cancel</Button>
              <Button type="submit" isLoading={mutation.isPending}>Save Employee</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
