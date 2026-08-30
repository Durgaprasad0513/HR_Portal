import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { employeesApi } from '@/api/employees';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MoreHorizontal , ArrowLeft, FileText, CheckCircle2} from 'lucide-react';
import { cn } from '@/lib/utils';

const SECTIONS = [
  { id: 'general', label: 'General Information' },
  { id: 'job', label: 'Job' },
  ];

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isDeactivateOpen, setIsDeactivateOpen] = React.useState(false);
  const deactivateMutation = { mutate: (id: string) => {}, isPending: false }; // stub
  const [activeSection, setActiveSection] = useState('general');

  const { data: empData, isLoading } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => employeesApi.getById(id!),
  });

  // Intersection observer logic for scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    SECTIONS.forEach(section => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [empData]);

  if (isLoading) return <div className="py-12"><LoadingSpinner /></div>;
  const emp = empData?.data;
  if (!emp) return <div className="text-gray-500">Employee not found</div>;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center border-b border-gray-200 pb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => // @ts-ignore
    navigate('/employees' as any)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 font-bold text-lg ring-2 ring-white shadow-sm">
              {emp.firstName[0]}{emp.lastName[0]}
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-navy-900 flex items-center gap-2">
                {emp.firstName} {emp.lastName}
                <Badge variant={emp.status === 'ACTIVE' ? 'success' : 'default'}>{emp.status}</Badge>
              </h1>
              <p className="text-sm text-gray-500">{emp.designation}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-8 pb-32">
          
          {/* General Information */}
          <section id="general" className="space-y-6 scroll-mt-24">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy-900">General Information</h2>
              <button className="text-accent-500 text-sm font-medium hover:underline">Edit</button>
            </div>
            
            <Card>
              <CardHeader><CardTitle className="text-base">Personal Information</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">First Name</p>
                    <p className="font-medium text-navy-900">{emp.firstName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Last Name</p>
                    <p className="font-medium text-navy-900">{emp.lastName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email Address</p>
                    <p className="font-medium text-navy-900">{emp.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                    <p className="font-medium text-navy-900">{emp.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Date of Birth</p>
                    <p className="font-medium text-navy-900">Jan 15, 1990</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Gender</p>
                    <p className="font-medium text-navy-900">Male</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Address Information</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Street Address</p>
                    <p className="font-medium text-navy-900">123 Business Avenue, Suite 100</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">City</p>
                    <p className="font-medium text-navy-900">San Francisco</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">State / Province</p>
                    <p className="font-medium text-navy-900">California</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">ZIP / Postal Code</p>
                    <p className="font-medium text-navy-900">94107</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Country</p>
                    <p className="font-medium text-navy-900">United States</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader><CardTitle className="text-base">Education</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg">
                    <div className="bg-blue-50 p-3 rounded-lg"><FileText className="text-blue-500 w-6 h-6" /></div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-navy-900">Bachelor of Science in Computer Science</h4>
                      <p className="text-sm text-gray-500">Stanford University • 2012 - 2016</p>
                      <div className="mt-2 flex items-center gap-2 text-sm text-accent-500 font-medium cursor-pointer">
                        <CheckCircle2 className="w-4 h-4" /> Degree_Certificate.pdf
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Job Section */}
          <section id="job" className="space-y-6 scroll-mt-24">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy-900">Job Information</h2>
              <button className="text-accent-500 text-sm font-medium hover:underline">Edit</button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Employee Code</p>
                    <p className="font-medium text-navy-900">{emp.employeeCode}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Join Date</p>
                    <p className="font-medium text-navy-900">{new Date(emp.joiningDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Department</p>
                    <p className="font-medium text-navy-900">{emp.department?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Line Manager</p>
                    <p className="font-medium text-navy-900">David Smith</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Employment Type</p>
                    <p className="font-medium text-navy-900">Full-time</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Office Location</p>
                    <p className="font-medium text-navy-900">HQ - San Francisco</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          </div>

        {/* Right Sticky Navigation */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <Card>
            <CardContent className="p-2">
              <nav className="flex flex-col space-y-1">
                {SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      "px-4 py-2.5 text-sm font-medium rounded-lg text-left transition-colors",
                      activeSection === section.id
                        ? "bg-accent-50 text-accent-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>
        <ConfirmDialog isOpen={isDeactivateOpen} title="Deactivate Employee" message="Are you sure you want to deactivate this employee? They will lose access to the system immediately." confirmLabel="Deactivate" cancelLabel="Cancel" isDestructive={true} onConfirm={() => deactivateMutation.mutate(id as string)} onCancel={() => setIsDeactivateOpen(false)} />
</div>
    </div>
  );
}
