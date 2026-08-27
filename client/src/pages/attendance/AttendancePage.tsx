import React from 'react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from '@/api/attendance';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Clock, History } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AttendancePage() {
  const queryClient = useQueryClient();
  const currentDate = new Date();

  const { data: todayData, isLoading: todayLoading } = useQuery({
    queryKey: ['attendance', 'today'],
    queryFn: attendanceApi.getToday,
  });

  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ['attendance', 'history'],
    queryFn: () => attendanceApi.getHistory(),
  });

  const clockInMutation = useMutation({
    mutationFn: attendanceApi.clockIn,
    onSuccess: () => {
      toast.success('Successfully clocked in');
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to clock in'),
  });

  const clockOutMutation = useMutation({
    mutationFn: attendanceApi.clockOut,
    onSuccess: () => {
      toast.success('Successfully clocked out');
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to clock out'),
  });

  const attendance = todayData?.data;
  const isClockedIn = !!attendance?.clockIn;
  const isClockedOut = !!attendance?.clockOut;

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const columns = [
    { 
      header: 'Date', 
      accessor: (row: any) => new Date(row.date).toLocaleDateString() 
    },
    { 
      header: 'Clock In', 
      accessor: (row: any) => formatTime(row.clockIn) 
    },
    { 
      header: 'Clock Out', 
      accessor: (row: any) => formatTime(row.clockOut) 
    },
    { 
      header: 'Work Hours', 
      accessor: (row: any) => row.workHours ? `${row.workHours}h` : '-' 
    },
    { 
      header: 'Status', 
      accessor: (row: any) => (
        <Badge variant={row.status === 'PRESENT' ? 'success' : row.status === 'LATE' ? 'warning' : 'danger'}>
          {row.status}
        </Badge>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Attendance</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" /> 
              Today's Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-lg font-medium text-slate-600">
                    {currentDate.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-4xl font-bold mt-2">
                    {currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="flex justify-center gap-4">
                  <Button 
                    size="lg" 
                    className="w-40" 
                    disabled={isClockedIn || clockInMutation.isPending}
                    onClick={() => clockInMutation.mutate()}
                    isLoading={clockInMutation.isPending}
                  >
                    Clock In
                  </Button>
                  <Button 
                    size="lg" 
                    variant={isClockedOut ? "secondary" : "danger"} 
                    className="w-40"
                    disabled={!isClockedIn || isClockedOut || clockOutMutation.isPending}
                    onClick={() => clockOutMutation.mutate()}
                    isLoading={clockOutMutation.isPending}
                  >
                    Clock Out
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 border-t pt-4">
                  <div>
                    <p className="text-sm text-slate-500">Clock In Time</p>
                    <p className="font-semibold">{formatTime(attendance?.clockIn)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Clock Out Time</p>
                    <p className="font-semibold">{formatTime(attendance?.clockOut)}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="w-5 h-5 mr-2" />
              Recent History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <LoadingSpinner />
            ) : (
              <DataTable columns={columns} data={(historyData?.data || []).slice(0, 5)} keyField="id" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
