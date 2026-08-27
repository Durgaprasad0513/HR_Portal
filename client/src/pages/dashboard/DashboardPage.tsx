import React from 'react';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { employeesApi } from '@/api/employees';
import { leavesApi } from '@/api/leaves';
import { StatsCard } from '@/components/ui/StatsCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Users, Building2, UserCheck, CalendarOff } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdminOrHR = user?.role === 'ADMIN' || user?.role === 'HR';

  const { data: empStats, isLoading: empLoading } = useQuery({
    queryKey: ['dashboard', 'employees'],
    queryFn: employeesApi.getDashboardStats,
    enabled: isAdminOrHR,
  });

  const { data: leaveStats, isLoading: leaveLoading } = useQuery({
    queryKey: ['dashboard', 'leaves'],
    queryFn: leavesApi.getDashboardStats,
    enabled: isAdminOrHR,
  });

  if (isAdminOrHR && (empLoading || leaveLoading)) {
    return <LoadingSpinner />;
  }

  const stats = empStats?.data;
  const leaveData = leaveStats?.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Welcome back, {user?.employee?.firstName || user?.email}</p>
      </div>

      {isAdminOrHR ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Employees"
              value={stats?.totalEmployees || 0}
              icon={Users}
            />
            <StatsCard
              title="Active Employees"
              value={stats?.activeEmployees || 0}
              icon={UserCheck}
            />
            <StatsCard
              title="Departments"
              value={stats?.departments || 0}
              icon={Building2}
            />
            <StatsCard
              title="Pending Leaves"
              value={leaveData?.pendingCount || 0}
              icon={CalendarOff}
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Joiners</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentJoinees?.length ? (
                    stats.recentJoinees.map((emp: any) => (
                      <div key={emp.id} className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-semibold text-slate-600">
                          {emp.firstName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-none">{emp.firstName} {emp.lastName}</p>
                          <p className="text-sm text-slate-500">{emp.designation}</p>
                        </div>
                        <div className="ml-auto text-sm text-slate-500">
                          {new Date(emp.joiningDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No recent joiners</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>On Leave Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaveData?.todayOnLeave?.length ? (
                    leaveData.todayOnLeave.map((leave: any) => (
                      <div key={leave.id} className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-semibold text-slate-600">
                          {leave.employee?.firstName?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-none">{leave.employee?.firstName} {leave.employee?.lastName}</p>
                          <p className="text-sm text-slate-500">{leave.leaveType} Leave</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No one is on leave today</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>My Portal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Use the sidebar to view your attendance, apply for leave, or view company updates.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
