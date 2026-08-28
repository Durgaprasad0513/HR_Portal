import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { attendanceApi } from '@/api/attendance';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ChevronLeft, ChevronRight, Download, Search, CheckCircle, XCircle, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/ui/DataTable';

type Tab = 'My Time Tracking' | 'Team Time Tracking';

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<Tab>('My Time Tracking');

  // Mocking data logic since the backend API for team timesheets doesn't match this exact structure yet
  const myColumns = [
    { header: 'Date', accessor: 'date' },
    { header: 'Time (hrs)', accessor: 'time' },
    { header: 'Time In', accessor: 'timeIn' },
    { header: 'Time Out', accessor: 'timeOut' },
    { header: 'Notes', accessor: 'notes', className: 'text-gray-500 max-w-xs truncate' },
    { header: 'Action', accessor: () => <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" /> },
  ];

  const myData = [
    { date: 'Mon, Dec 11', time: '8h 00m', timeIn: '09:00 AM', timeOut: '06:00 PM', notes: 'Worked on new feature' },
    { date: 'Tue, Dec 12', time: '8h 30m', timeIn: '08:30 AM', timeOut: '06:00 PM', notes: 'Team planning' },
    { date: 'Wed, Dec 13', time: '7h 30m', timeIn: '09:30 AM', timeOut: '06:00 PM', notes: 'Doctor appt morning' },
    { date: 'Thu, Dec 14', time: '8h 00m', timeIn: '09:00 AM', timeOut: '06:00 PM', notes: '-' },
    { date: 'Fri, Dec 15', time: '8h 00m', timeIn: '09:00 AM', timeOut: '06:00 PM', notes: 'Sprint review' },
    { date: 'Sat, Dec 16', time: '-', timeIn: '-', timeOut: '-', notes: 'Weekend' },
    { date: 'Sun, Dec 17', time: '-', timeIn: '-', timeOut: '-', notes: 'Weekend' },
  ];

  const teamColumns = [
    { 
      header: 'Employee', 
      accessor: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 font-bold text-xs">
            {row.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
             <p className="font-semibold text-navy-900">{row.name}</p>
             <Badge variant={row.type === 'Full time' ? 'success' : 'warning'} className="mt-1">{row.type}</Badge>
          </div>
        </div>
      )
    },
    { 
      header: 'Total Work Hours', 
      accessor: (row: any) => (
        <span className={row.over ? 'text-red-600 font-semibold' : 'text-gray-700'}>{row.total}</span>
      ) 
    },
    { header: 'Overtime', accessor: 'overtime', className: 'text-gray-500' },
    { 
      header: 'Status', 
      accessor: (row: any) => (
        <Badge variant={row.status === 'Approved' ? 'success' : 'warning'}>{row.status}</Badge>
      ) 
    },
    { header: 'Action', accessor: () => <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" /> },
  ];

  const teamData = [
    { name: 'Sarah Miller', type: 'Full time', total: '40h 00m | 40h', over: false, overtime: '-', status: 'Approved' },
    { name: 'James King', type: 'Part time', total: '25h 00m | 20h', over: true, overtime: '5h 00m', status: 'Pending' },
    { name: 'Alex Johnson', type: 'Full time', total: '42h 00m | 40h', over: true, overtime: '2h 00m', status: 'Pending' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">Time Tracking</h1>
        
        <div className="flex bg-gray-100 p-1 rounded-full w-full sm:w-auto">
          {(['My Time Tracking', 'Team Time Tracking'] as Tab[]).map((tab) => (
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

      {activeTab === 'My Time Tracking' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg p-2">
                <button className="p-1 hover:bg-gray-100 rounded text-gray-500"><ChevronLeft className="w-4 h-4" /></button>
                <span className="text-sm font-semibold text-navy-900">Dec 11 - 17, 2023</span>
                <button className="p-1 hover:bg-gray-100 rounded text-gray-500"><ChevronRight className="w-4 h-4" /></button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <Card>
               <CardContent className="p-6">
                 <p className="text-sm text-gray-500 font-medium mb-1">Overtime</p>
                 <h3 className="text-3xl font-bold text-navy-900">0<span className="text-lg text-gray-500 font-medium ml-1">h</span></h3>
               </CardContent>
             </Card>
             <Card>
               <CardContent className="p-6">
                 <p className="text-sm text-gray-500 font-medium mb-1">Worked this week</p>
                 <h3 className="text-3xl font-bold text-navy-900">40<span className="text-lg text-gray-500 font-medium ml-1">h 00m</span></h3>
               </CardContent>
             </Card>
             <Card className="bg-accent-50 border-accent-100">
               <CardContent className="p-6">
                 <p className="text-sm text-accent-700 font-medium mb-1">Total hours</p>
                 <h3 className="text-3xl font-bold text-accent-600">128<span className="text-lg font-medium ml-1">h 00m</span></h3>
                 <p className="text-xs text-accent-500 mt-1">For this month</p>
               </CardContent>
             </Card>
          </div>

          <DataTable columns={myColumns} data={myData} keyField="date" />
        </div>
      )}

      {activeTab === 'Team Time Tracking' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg p-2">
                <button className="p-1 hover:bg-gray-100 rounded text-gray-500"><ChevronLeft className="w-4 h-4" /></button>
                <span className="text-sm font-semibold text-navy-900">Dec 11 - 17, 2023</span>
                <button className="p-1 hover:bg-gray-100 rounded text-gray-500"><ChevronRight className="w-4 h-4" /></button>
             </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button variant="outline" className="gap-2 text-gray-600">
                <Download className="w-4 h-4" /> Download
              </Button>
              <Button variant="danger" className="gap-2 bg-red-500 hover:bg-red-600 text-white border-transparent">
                <XCircle className="w-4 h-4" /> Reject
              </Button>
              <Button variant="approve" className="gap-2">
                <CheckCircle className="w-4 h-4" /> Approve
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="relative w-full sm:w-64">
               <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
               <input 
                 placeholder="Search team member..." 
                 className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all"
               />
             </div>
             <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500">
               <option>All Employment Type</option>
             </select>
             <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500">
               <option>All Status</option>
             </select>
          </div>

          <DataTable columns={teamColumns} data={teamData} keyField="name" selectable />
        </div>
      )}
    </div>
  );
}
